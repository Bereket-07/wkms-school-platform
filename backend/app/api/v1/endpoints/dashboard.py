from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api import deps
from app.models.donation import Donation as DonationModel
from app.models.campaign import Campaign as CampaignModel
from app.schemas.donation import Donation

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    # current_user = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get aggregated dashboard statistics.
    """
    
    # 1. Total Raised USD (Stripe)
    total_raised_usd = db.query(func.sum(DonationModel.amount)).filter(
        DonationModel.status == "SUCCESS",
        DonationModel.currency == "USD"
    ).scalar() or 0.0

    # 2. Total Raised ETB (Chapa)
    total_raised_etb = db.query(func.sum(DonationModel.amount)).filter(
        DonationModel.status == "SUCCESS",
        DonationModel.currency == "ETB"
    ).scalar() or 0.0

    # 3. Active Campaigns
    active_campaign_count = db.query(CampaignModel).count() # Simply count all for now, or filter by active status if column exists

    # 4. Total Donation Count
    total_donations_count = db.query(DonationModel).filter(DonationModel.status == "SUCCESS").count()

    # 5. Recent Activity (Last 5 Donations)
    recent_donations = db.query(DonationModel).filter(
        DonationModel.status == "SUCCESS"
    ).order_by(DonationModel.created_at.desc()).limit(5).all()

    return {
        "total_raised_usd": total_raised_usd,
        "total_raised_etb": total_raised_etb,
        "active_campaigns": active_campaign_count,
        "total_donations_count": total_donations_count,
        "recent_donations": [Donation.model_validate(d) for d in recent_donations]
    }
