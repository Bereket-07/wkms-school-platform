from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
import uuid
import enum
from app.db.base_class import Base

class MediaType(str, enum.Enum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"
    YOUTUBE_URL = "YOUTUBE_URL"

class MediaCategory(str, enum.Enum):
    GALLERY = "GALLERY"
    CAMPAIGN_UPDATE = "CAMPAIGN_UPDATE"
    EVENT = "EVENT"

class Media(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    url = Column(String, nullable=False) # S3 Link or YouTube URL
    media_type = Column(String, default=MediaType.IMAGE) # IMAGE, VIDEO, YOUTUBE_URL
    
    title = Column(String, nullable=True) # Caption
    description = Column(String, nullable=True) # Alt text / longer desc
    
    category = Column(String, default=MediaCategory.GALLERY)
    is_featured = Column(Boolean, default=False) # For Homepage Slider

    created_at = Column(DateTime(timezone=True), server_default=func.now())
