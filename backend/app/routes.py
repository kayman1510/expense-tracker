from fastapi import APIRouter, HTTPException
from fastapi import Query
from app.database import get_db_connection
from app.models import (
    CategoryCreate,
    CategoryResponse,
    ExpenseCreate,
    ExpenseResponse,
    ExpenseCreateResponse,
)


router = APIRouter()


@router.get("/categories", response_model=list[CategoryResponse])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, created_at
        FROM categories
        ORDER BY name ASC
    """)
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@router.post("/categories", response_model=CategoryResponse)
def create_category(category: CategoryCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO categories (name)
            VALUES (?)
        """, (category.name,))
        conn.commit()

        category_id = cursor.lastrowid

        cursor.execute("""
            SELECT id, name, created_at
            FROM categories
            WHERE id = ?
        """, (category_id,))
        row = cursor.fetchone()

        conn.close()
        return dict(row)

    except Exception:
        conn.close()
        raise HTTPException(status_code=400, detail="Category already exists or could not be created")


@router.get("/expenses", response_model=list[ExpenseResponse])
def get_expenses(
    category_id: int | None = None,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT
            expenses.id,
            expenses.title,
            expenses.amount,
            expenses.category_id,
            categories.name AS category_name,
            expenses.expense_date,
            expenses.created_at
        FROM expenses
        JOIN categories ON expenses.category_id = categories.id
    """

    params = []

    if category_id is not None:
        query += " WHERE expenses.category_id = ?"
        params.append(category_id)

    query += " ORDER BY expenses.expense_date DESC, expenses.id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, tuple(params))

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@router.post("/expenses", response_model=ExpenseCreateResponse)
def create_expense(expense: ExpenseCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO expenses (title, amount, category_id, expense_date)
        VALUES (?, ?, ?, ?)
        """,
        (expense.title, expense.amount, expense.category_id, expense.expense_date)
    )

    expense_id = cursor.lastrowid
    conn.commit()

    cursor.execute(
        "SELECT * FROM expenses WHERE id = ?",
        (expense_id,)
    )
    row = cursor.fetchone()

    conn.close()
    return dict(row)


@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM expenses WHERE id = ?",
        (expense_id,)
    )

    conn.commit()
    conn.close()

    return {"message": "Expense deleted successfully"}


@router.put("/expenses/{expense_id}", response_model=ExpenseCreateResponse)
def update_expense(expense_id: int, expense: ExpenseCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE expenses
        SET title = ?, amount = ?, category_id = ?, expense_date = ?
        WHERE id = ?
        """,
        (
            expense.title,
            expense.amount,
            expense.category_id,
            expense.expense_date,
            expense_id
        )
    )

    conn.commit()

    cursor.execute(
        "SELECT * FROM expenses WHERE id = ?",
        (expense_id,)
    )
    row = cursor.fetchone()

    conn.close()
    return dict(row)
