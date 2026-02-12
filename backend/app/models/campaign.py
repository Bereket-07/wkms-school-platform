from sqlalchemy import Boolean, Column, String, Float, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship # prepared for future relations
import uuid
from app.db.base_class import Base

class Campaign(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False) # e.g. "new-library"
    description = Column(Text, nullable=True) # Markdown/HTML content
    cover_image_url = Column(String, nullable=True)

    # Financial Goals (Dual Currency)
    goal_amount_usd = Column(Float, default=0.0)
    goal_amount_etb = Column(Float, default=0.0)

    # Real-time Tracking
    current_raised_usd = Column(Float, default=0.0)
    current_raised_etb = Column(Float, default=0.0)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    donations = relationship("Donation", back_populates="campaign")
