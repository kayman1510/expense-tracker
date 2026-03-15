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