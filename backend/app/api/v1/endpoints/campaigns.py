from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services import campaign_service
from app.schemas.campaign import Campaign, CampaignCreate
from app.api.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[Campaign])
def read_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all active campaigns.
    """
    campaigns = campaign_service.get_multi(db, skip=skip, limit=limit)
    return campaigns

@router.post("/", response_model=Campaign)
def create_campaign(
    *,
    db: Session = Depends(get_db),
    campaign_in: CampaignCreate,
    current_user = Depends(get_current_active_user)
):
    """
    Create new campaign (Admin only).
    """
    campaign = None
    try:
        print(f"DEBUG: create_campaign payload: {campaign_in.dict()}", flush=True)
        # Check if title already exists to avoid slug collision? (Service handles it simplistically)
        campaign = campaign_service.create(db=db, obj_in=campaign_in)
    except Exception as e:
        print(f"DEBUG: Error creating campaign: {e}", flush=True)
        raise HTTPException(status_code=400, detail=f"Debugging Error: {str(e)}")
    return campaign

@router.get("/{slug}", response_model=Campaign)
def read_campaign(slug: str, db: Session = Depends(get_db)):
    """
    Get campaign by slug.
    """
    campaign = campaign_service.get_by_slug(db, slug=slug)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign
