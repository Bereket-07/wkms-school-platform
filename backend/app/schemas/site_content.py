from pydantic import BaseModel
from typing import Optional

class SiteContentBase(BaseModel):
    section: str
    key: str
    content: Optional[str] = None
    content_type: str = "TEXT"
    label: Optional[str] = None

class SiteContentCreate(SiteContentBase):
    pass

class SiteContentUpdate(BaseModel):
    content: str

class SiteContent(SiteContentBase):
    id: str

    class Config:
        from_attributes = True
