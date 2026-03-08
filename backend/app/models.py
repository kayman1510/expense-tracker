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