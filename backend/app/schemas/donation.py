from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class DonationBase(BaseModel):
    amount: float
    currency: str
    donor_name: Optional[str] = None
    donor_email: Optional[str] = None
    payment_gateway: str
    status: str
    campaign_id: Optional[str] = None

class DonationCreate(DonationBase):
    transaction_id: str

    class Config:
        from_attributes = True

    campaign_title: Optional[str] = None

    @staticmethod
    def resolve_campaign_title(title: Optional[str], info) -> Optional[str]:
        # Pydantic v2 logic might differ, but for v1/compat, we might need a root validator or computed field.
        # Simplest: use a property on the model? No, schema constrained.
        # Let's try adding it as a field and relying on the ORM to populate it if we add a property to the model, OR just map it in the endpoint.
        pass

# Better approach for Pydantic V2 or V1 compat:
class Donation(DonationBase):
    id: str
    transaction_id: str
    created_at: datetime
    campaign_title: Optional[str] = None

    class Config:
        from_attributes = True

    @property
    def campaign_name(self):
        # This hook doesn't work in Pydantic models directly for ORM mapping unless using getters.
        return None
