from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class PledgeBase(BaseModel):
    donor_name: str
    donor_email: EmailStr
    amount: Optional[float] = None
    currency: Optional[str] = "USD"
    campaign_id: Optional[str] = None

class PledgeCreate(PledgeBase):
    pass

class Pledge(PledgeBase):
    id: str
    contacted: bool
    created_at: datetime
    campaign_title: Optional[str] = None

    class Config:
        from_attributes = True
