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