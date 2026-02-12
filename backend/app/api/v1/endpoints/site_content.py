from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_site_content import site_content as crud_content
from app.schemas.site_content import SiteContent, SiteContentCreate, SiteContentUpdate
from app.models.site_content import SiteContent as SiteContentModel

router = APIRouter()

@router.get("/", response_model=List[SiteContent])
def read_site_content(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    section: str | None = None
) -> Any:
    """
    Retrieve site content.
    """
    if section:
        return crud_content.get_by_section(db, section=section)
    return crud_content.get_multi(db, skip=skip, limit=limit)

@router.post("/bulk-update", response_model=List[SiteContent])
def bulk_update_site_content(
    updates: Dict[str, str], # Key: Content
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update multiple content fields at once.
    Keys must already exist (or will be created if mapped properly).
    """
    updated_items = []
    for key, value in updates.items():
        # Check if exists
        item = crud_content.get_by_key(db, key=key)
        if item:
            item = crud_content.update(db, db_obj=item, obj_in=SiteContentUpdate(content=value))
            updated_items.append(item)
        else:
             # If it doesn't exist, we can't update it blindly without knowing the section.
             # Ideally, we should seed content first. 
             pass 
    return updated_items

@router.post("/initialize", response_model=Dict[str, int])
def initialize_defaults(
    defaults: List[SiteContentCreate],
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user)
):
    """
    Seed default content if it doesn't exist.
    """
    count = 0
    for item in defaults:
        if not crud_content.get_by_key(db, key=item.key):
            crud_content.create(db, obj_in=item)
            count += 1
    return {"created": count}
