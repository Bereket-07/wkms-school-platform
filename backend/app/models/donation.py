from sqlalchemy import Column, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from app.db.base_class import Base

class PaymentGateway(str, enum.Enum):
    STRIPE = "STRIPE"
    CHAPA = "CHAPA"

class DonationStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"

class Donation(Base):
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Link to Campaign
    campaign_id = Column(String, ForeignKey("campaign.id"), nullable=True)
    campaign = relationship("Campaign", back_populates="donations")
    
    # Donor Info
    donor_name = Column(String, nullable=True) # Optional (Anonymous)
    donor_email = Column(String, nullable=True) # For receipt

    # Transaction Details
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False) # "USD", "ETB"
    
    # Gateway Info
    payment_gateway = Column(String, nullable=False) # Enforced via Enum in logic
    transaction_id = Column(String, unique=True, index=True) # Stripe/Chapa Transaction ID
    status = Column(String, default=DonationStatus.PENDING)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    @property
    def campaign_title(self):
        return self.campaign.title if self.campaign else "General Donation"
