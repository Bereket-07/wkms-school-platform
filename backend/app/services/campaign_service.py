from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate
import re

import uuid

def create_slug(title: str) -> str:
    # Basic slugify: lowercase, remove non-alphanumeric, replace spaces with -
    s = title.lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s).strip('-')
    return s

def get_multi(db: Session, skip: int = 0, limit: int = 100) -> List[Campaign]:
    return db.query(Campaign).filter(Campaign.is_active == True).offset(skip).limit(limit).all()

def create(db: Session, obj_in: CampaignCreate) -> Campaign:
    base_slug = create_slug(obj_in.title)
    slug = base_slug
    
    # Check for slug collision
    existing = db.query(Campaign).filter(Campaign.slug == slug).first()
    if existing:
        # Append short random suffix if collision
        suffix = str(uuid.uuid4())[:4]
        slug = f"{base_slug}-{suffix}"

    db_obj = Campaign(
        title=obj_in.title,
        slug=slug, 
        description=obj_in.description,
        goal_amount_usd=obj_in.goal_amount_usd,
        goal_amount_etb=obj_in.goal_amount_etb,
        cover_image_url=obj_in.cover_image_url
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_by_slug(db: Session, slug: str) -> Optional[Campaign]:
    return db.query(Campaign).filter(Campaign.slug == slug).first()
