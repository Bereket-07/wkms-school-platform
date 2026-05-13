from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from app.db.base_class import Base

class Pledge(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Link to Campaign (Optional)
    campaign_id = Column(String, ForeignKey("campaign.id"), nullable=True)
    campaign = relationship("Campaign")
    
    # Donor Info
    donor_name = Column(String, nullable=False)
    donor_email = Column(String, nullable=False)

    # Pledge Details
    amount = Column(Float, nullable=True) # Optional pledge amount
    currency = Column(String, default="USD") # USD or ETB
    
    # Admin Tracking
    contacted = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    @property
    def campaign_title(self):
        return self.campaign.title if self.campaign else "General Support"
