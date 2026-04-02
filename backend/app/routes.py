from fastapi import APIRouter, HTTPException
from fastapi import Query
from app.database import get_db_connection
from app.models import (
    CategoryCreate,
    CategoryResponse,
    ExpenseCreate,
    ExpenseResponse,
    ExpenseCreateResponse,
    IncomeCreate,
    IncomeResponse,
    IncomeCreateResponse,
    BudgetCreate,
    BudgetResponse,
    BudgetCreateResponse,
)

router = APIRouter()


# ------------------ CATEGORIES ------------------

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


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, category: CategoryCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM categories WHERE id = ?", (category_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Category not found")

    try:
        cursor.execute(
            "UPDATE categories SET name = ? WHERE id = ?",
            (category.name, category_id)
        )
        conn.commit()

        cursor.execute(
            "SELECT id, name, created_at FROM categories WHERE id = ?",
            (category_id,)
        )
        row = cursor.fetchone()
        conn.close()
        return dict(row)

    except Exception:
        conn.close()
        raise HTTPException(status_code=400, detail="Category name already exists or could not be updated")


@router.delete("/categories/{category_id}")
def delete_category(category_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM categories WHERE id = ?", (category_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Category not found")

    cursor.execute("SELECT COUNT(*) FROM expenses WHERE category_id = ?", (category_id,))
    expense_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM budgets WHERE category_id = ?", (category_id,))
    budget_count = cursor.fetchone()[0]

    if expense_count > 0 or budget_count > 0:
        conn.close()
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete: category is used by {expense_count} expense(s) and {budget_count} budget(s)"
        )

    cursor.execute("DELETE FROM categories WHERE id = ?", (category_id,))
    conn.commit()
    conn.close()

    return {"message": "Category deleted successfully"}


# ------------------ EXPENSES ------------------

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


# ------------------ INCOME ------------------

@router.get("/income", response_model=list[IncomeResponse])
def get_income():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, source, amount, income_date, notes, created_at
        FROM income
        ORDER BY income_date DESC, id DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@router.post("/income", response_model=IncomeCreateResponse)
def create_income(income: IncomeCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO income (source, amount, income_date, notes)
        VALUES (?, ?, ?, ?)
        """,
        (income.source, income.amount, income.income_date, income.notes)
    )

    income_id = cursor.lastrowid
    conn.commit()

    cursor.execute(
        "SELECT * FROM income WHERE id = ?",
        (income_id,)
    )
    row = cursor.fetchone()

    conn.close()
    return dict(row)


@router.put("/income/{income_id}", response_model=IncomeCreateResponse)
def update_income(income_id: int, income: IncomeCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE income
        SET source = ?, amount = ?, income_date = ?, notes = ?
        WHERE id = ?
        """,
        (
            income.source,
            income.amount,
            income.income_date,
            income.notes,
            income_id
        )
    )

    conn.commit()

    cursor.execute(
        "SELECT * FROM income WHERE id = ?",
        (income_id,)
    )
    row = cursor.fetchone()

    conn.close()
    return dict(row)


@router.delete("/income/{income_id}")
def delete_income(income_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM income WHERE id = ?",
        (income_id,)
    )

    conn.commit()
    conn.close()

    return {"message": "Income deleted successfully"}


# ------------------ BUDGETS ------------------

@router.get("/budgets", response_model=list[BudgetResponse])
def get_budgets():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            budgets.id,
            budgets.category_id,
            categories.name AS category_name,
            budgets.amount,
            budgets.period_month,
            budgets.period_year,
            budgets.created_at
        FROM budgets
        JOIN categories ON budgets.category_id = categories.id
        ORDER BY budgets.period_year DESC, budgets.period_month DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


@router.post("/budgets", response_model=BudgetCreateResponse)
def create_budget(budget: BudgetCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO budgets (category_id, amount, period_month, period_year)
            VALUES (?, ?, ?, ?)
            """,
            (
                budget.category_id,
                budget.amount,
                budget.period_month,
                budget.period_year,
            )
        )

        budget_id = cursor.lastrowid
        conn.commit()

        cursor.execute(
            "SELECT * FROM budgets WHERE id = ?",
            (budget_id,)
        )
        row = cursor.fetchone()

        conn.close()
        return dict(row)

    except Exception:
        conn.close()
        raise HTTPException(
            status_code=400,
            detail="Budget for this category and month already exists or could not be created"
        )


@router.put("/budgets/{budget_id}", response_model=BudgetCreateResponse)
def update_budget(budget_id: int, budget: BudgetCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE budgets
        SET category_id = ?, amount = ?, period_month = ?, period_year = ?
        WHERE id = ?
        """,
        (
            budget.category_id,
            budget.amount,
            budget.period_month,
            budget.period_year,
            budget_id
        )
    )

    conn.commit()

    cursor.execute(
        "SELECT * FROM budgets WHERE id = ?",
        (budget_id,)
    )
    row = cursor.fetchone()

    conn.close()
    return dict(row)


@router.delete("/budgets/{budget_id}")
def delete_budget(budget_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM budgets WHERE id = ?",
        (budget_id,)
    )

    conn.commit()
    conn.close()

    return {"message": "Budget deleted successfully"}
