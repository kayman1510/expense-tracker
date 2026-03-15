from fastapi import APIRouter, Query
from app.models import MonthlySummaryResponse
from app.services.analytics_service import get_monthly_summary

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/monthly-summary", response_model=MonthlySummaryResponse)
def monthly_summary(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2100),
):
    return get_monthly_summary(month, year)