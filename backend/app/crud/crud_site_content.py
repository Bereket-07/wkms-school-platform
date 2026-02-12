from app.models.site_content import SiteContent
from app.schemas.site_content import SiteContentCreate, SiteContentUpdate
from sqlalchemy.orm import Session
from typing import List, Optional, Any

class CRUDSiteContent:
    def get(self, db: Session, id: Any) -> Optional[SiteContent]:
        return db.query(SiteContent).filter(SiteContent.id == id).first()

    def get_by_key(self, db: Session, key: str) -> Optional[SiteContent]:
        return db.query(SiteContent).filter(SiteContent.key == key).first()

    def get_by_section(self, db: Session, section: str) -> List[SiteContent]:
        return db.query(SiteContent).filter(SiteContent.section == section).all()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[SiteContent]:
        return db.query(SiteContent).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: SiteContentCreate) -> SiteContent:
        db_obj = SiteContent(
            section=obj_in.section,
            key=obj_in.key,
            content=obj_in.content,
            content_type=obj_in.content_type,
            label=obj_in.label
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: SiteContent, obj_in: SiteContentUpdate | dict) -> SiteContent:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
            
        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])
                
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

site_content = CRUDSiteContent()

from typing import Any
