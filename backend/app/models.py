from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str


class CategoryResponse(BaseModel):
    id: int
    name: str
    created_at: str


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category_id: int
    expense_date: str


class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: float
    category_id: int
    category_name: str
    expense_date: str
    created_at: str


class ExpenseCreateResponse(BaseModel):
    id: int
    title: str
    amount: float
    category_id: int
    expense_date: str
    created_at: str


class IncomeCreate(BaseModel):
    source: str
    amount: float
    income_date: str
    notes: str | None = None


class IncomeResponse(BaseModel):
    id: int
    source: str
    amount: float
    income_date: str
    notes: str | None
    created_at: str


class IncomeCreateResponse(BaseModel):
    id: int
    source: str
    amount: float
    income_date: str
    notes: str | None
    created_at: str


class BudgetCreate(BaseModel):
    category_id: int
    amount: float
    period_month: int
    period_year: int


class BudgetResponse(BaseModel):
    id: int
    category_id: int
    category_name: str
    amount: float
    period_month: int
    period_year: int
    created_at: str


class BudgetCreateResponse(BaseModel):
    id: int
    category_id: int
    amount: float
    period_month: int
    period_year: int
    created_at: str

class MonthlySummaryResponse(BaseModel):
    month: int
    year: int
    total_income: float
    total_expenses: float
    net_savings: float

class CategorySpendingItem(BaseModel):
    category_id: int
    category_name: str
    total_spent: float