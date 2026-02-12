from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.media import Media
from pydantic import BaseModel

# Schema for input (Pydantic)
class MediaCreate(BaseModel):
    url: str
    media_type: str = "IMAGE"
    title: Optional[str] = None
    description: Optional[str] = None
    category: str = "GALLERY"

def get_multi(db: Session, skip: int = 0, limit: int = 100, media_type: Optional[str] = None) -> List[Media]:
    query = db.query(Media)
    if media_type:
        query = query.filter(Media.media_type == media_type)
    return query.order_by(Media.created_at.desc()).offset(skip).limit(limit).all()

def create(db: Session, obj_in: MediaCreate) -> Media:
    db_obj = Media(
        url=obj_in.url,
        media_type=obj_in.media_type,
        title=obj_in.title,
        description=obj_in.description,
        category=obj_in.category,
        is_featured=True # Default to featured for now
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, id: str) -> Optional[Media]:
    obj = db.query(Media).get(id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj
