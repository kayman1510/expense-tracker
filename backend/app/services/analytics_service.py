from app.database import get_db_connection


def get_monthly_summary(month: int, year: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    month_str = f"{month:02d}"

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM income
        WHERE strftime('%m', income_date) = ?
          AND strftime('%Y', income_date) = ?
        """,
        (month_str, str(year)),
    )
    total_income = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT COALESCE(SUM(amount), 0)
        FROM expenses
        WHERE strftime('%m', expense_date) = ?
          AND strftime('%Y', expense_date) = ?
        """,
        (month_str, str(year)),
    )
    total_expenses = cursor.fetchone()[0]

    conn.close()

    net_savings = total_income - total_expenses

    return {
        "month": month,
        "year": year,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_savings": net_savings,
    }

def get_category_spending(month: int, year: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    month_str = f"{month:02d}"

    cursor.execute(
        """
        SELECT
            categories.id AS category_id,
            categories.name AS category_name,
            COALESCE(SUM(expenses.amount), 0) AS total_spent
        FROM expenses
        JOIN categories ON expenses.category_id = categories.id
        WHERE strftime('%m', expenses.expense_date) = ?
          AND strftime('%Y', expenses.expense_date) = ?
        GROUP BY categories.id, categories.name
        ORDER BY total_spent DESC
        """,
        (month_str, str(year)),
    )

    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "category_id": row["category_id"],
            "category_name": row["category_name"],
            "total_spent": row["total_spent"],
        }
        for row in rows
    ]

def get_budget_vs_actual(month: int, year: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            budgets.category_id AS category_id,
            categories.name AS category_name,
            budgets.amount AS budget_amount,
            COALESCE(SUM(expenses.amount), 0) AS actual_spent
        FROM budgets
        JOIN categories ON budgets.category_id = categories.id
        LEFT JOIN expenses
            ON expenses.category_id = budgets.category_id
           AND strftime('%m', expenses.expense_date) = ?
           AND strftime('%Y', expenses.expense_date) = ?
        WHERE budgets.period_month = ?
          AND budgets.period_year = ?
        GROUP BY budgets.category_id, categories.name, budgets.amount
        ORDER BY categories.name ASC
        """,
        (f"{month:02d}", str(year), month, year),
    )

    rows = cursor.fetchall()
    conn.close()

    results = []

    for row in rows:
        budget_amount = row["budget_amount"]
        actual_spent = row["actual_spent"]
        remaining_amount = budget_amount - actual_spent
        over_budget = actual_spent > budget_amount

        results.append(
            {
                "category_id": row["category_id"],
                "category_name": row["category_name"],
                "budget_amount": budget_amount,
                "actual_spent": actual_spent,
                "remaining_amount": remaining_amount,
                "over_budget": over_budget,
            }
        )

    return results

def get_month_over_month(month: int, year: int):
    if month == 1:
        previous_month = 12
        previous_year = year - 1
    else:
        previous_month = month - 1
        previous_year = year

    current_summary = get_monthly_summary(month, year)
    previous_summary = get_monthly_summary(previous_month, previous_year)

    current_month_income = current_summary["total_income"]
    previous_month_income = previous_summary["total_income"]
    income_change = current_month_income - previous_month_income

    current_month_expenses = current_summary["total_expenses"]
    previous_month_expenses = previous_summary["total_expenses"]
    expense_change = current_month_expenses - previous_month_expenses

    current_month_savings = current_summary["net_savings"]
    previous_month_savings = previous_summary["net_savings"]
    savings_change = current_month_savings - previous_month_savings

    return {
        "month": month,
        "year": year,
        "current_month_income": current_month_income,
        "previous_month_income": previous_month_income,
        "income_change": income_change,
        "current_month_expenses": current_month_expenses,
        "previous_month_expenses": previous_month_expenses,
        "expense_change": expense_change,
        "current_month_savings": current_month_savings,
        "previous_month_savings": previous_month_savings,
        "savings_change": savings_change,
    }