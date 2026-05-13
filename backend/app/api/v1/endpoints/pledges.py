from typing import Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.pledge import Pledge
from app.models.user import User
from app.schemas.pledge import PledgeCreate, Pledge as PledgeSchema

router = APIRouter()

@router.post("/", response_model=PledgeSchema)
def create_pledge(
    *,
    db: Session = Depends(deps.get_db),
    pledge_in: PledgeCreate,
) -> Any:
    """
    Create a new pledge.
    """
    db_pledge = Pledge(
        donor_name=pledge_in.donor_name,
        donor_email=pledge_in.donor_email,
        amount=pledge_in.amount,
        currency=pledge_in.currency or "USD",
        campaign_id=pledge_in.campaign_id
    )
    db.add(db_pledge)
    db.commit()
    db.refresh(db_pledge)
    return db_pledge

@router.get("/", response_model=List[PledgeSchema])
def read_pledges(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    campaign_id: Optional[str] = None,
    contacted: Optional[bool] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve pledges (Admin only - protected by get_current_active_user).
    """
    query = db.query(Pledge)
    if campaign_id:
        query = query.filter(Pledge.campaign_id == campaign_id)
    if contacted is not None:
        query = query.filter(Pledge.contacted == contacted)
    if start_date:
        query = query.filter(Pledge.created_at >= start_date)
    if end_date:
        query = query.filter(Pledge.created_at <= end_date)
        
    pledges = query.order_by(Pledge.created_at.desc()).offset(skip).limit(limit).all()
    return pledges

@router.put("/{pledge_id}/contacted", response_model=PledgeSchema)
def toggle_pledge_contacted(
    *,
    db: Session = Depends(deps.get_db),
    pledge_id: str,
    contacted: bool,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Toggle contacted status for a pledge (Admin only).
    """
    pledge = db.query(Pledge).filter(Pledge.id == pledge_id).first()
    if not pledge:
        raise HTTPException(status_code=404, detail="Pledge not found")
    
    pledge.contacted = contacted
    db.commit()
    db.refresh(pledge)
    return pledge
