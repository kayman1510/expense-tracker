from fastapi import APIRouter, Query
from app.models import MonthlySummaryResponse, CategorySpendingItem, BudgetVsActualItem
from app.services.analytics_service import (
    get_monthly_summary,
    get_category_spending,
    get_budget_vs_actual,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/monthly-summary", response_model=MonthlySummaryResponse)
def monthly_summary(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2100),
):
    return get_monthly_summary(month, year)

@router.get("/category-spending", response_model=list[CategorySpendingItem])
def category_spending(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2100),
):
    return get_category_spending(month, year)

@router.get("/budget-vs-actual", response_model=list[BudgetVsActualItem])
def budget_vs_actual(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2100),
):
    return get_budget_vs_actual(month, year)