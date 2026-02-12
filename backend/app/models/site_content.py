from sqlalchemy import Column, String, Text, Enum
import uuid
import enum
from app.db.base_class import Base

class ContentType(str, enum.Enum):
    TEXT = "TEXT"
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"

class SiteContent(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    section = Column(String, index=True, nullable=False) # e.g. "HERO", "ABOUT", "IMPACT"
    key = Column(String, index=True, nullable=False, unique=True) # e.g. "hero_title", "about_mission"
    content = Column(Text, nullable=True)
    content_type = Column(String, default=ContentType.TEXT)
    
    # Description for the admin to know what this field is for
    label = Column(String, nullable=True) 
