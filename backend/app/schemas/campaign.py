from typing import Optional
from pydantic import BaseModel
from datetime import datetime

# Shared properties
class CampaignBase(BaseModel):
    title: str
    description: Optional[str] = None
    goal_amount_usd: float = 0.0
    goal_amount_etb: float = 0.0
    cover_image_url: Optional[str] = None
    is_active: bool = True

# Properties to receive on creation
class CampaignCreate(CampaignBase):
    pass

# Properties to receive on update
class CampaignUpdate(CampaignBase):
    title: Optional[str] = None
    pass

# Properties to return to client
class Campaign(CampaignBase):
    id: str
    slug: str
    current_raised_usd: float
    current_raised_etb: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
