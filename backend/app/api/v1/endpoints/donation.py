from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.core.config import settings
import stripe
from pydantic import BaseModel

from typing import List
from app.schemas.donation import Donation
from app.models.donation import Donation as DonationModel

router = APIRouter()

stripe.api_key = settings.STRIPE_SECRET_KEY

from sqlalchemy.orm import joinedload

@router.get("/", response_model=List[Donation])
def read_donations(
    skip: int = 0,
    limit: int = 100,
    campaign_id: str | None = None,
    db: Session = Depends(deps.get_db),
    # current_user = Depends(deps.get_current_active_user) # Uncomment to secure
):
    """
    Retrieve donations.
    """
    query = db.query(DonationModel).options(joinedload(DonationModel.campaign))
    
    if campaign_id:
        if campaign_id == "general":
            query = query.filter(DonationModel.campaign_id == None)
        else:
            query = query.filter(DonationModel.campaign_id == campaign_id)
            
    donations = query.order_by(DonationModel.created_at.desc()).offset(skip).limit(limit).all()
    return donations

class PaymentIntentCreate(BaseModel):
    amount: float
    currency: str = "usd" # Default to USD
    email: str | None = None

@router.post("/create-payment-intent")
def create_payment_intent(
    payment_in: PaymentIntentCreate,
):
    """
    Create a Stripe Payment Intent.
    """
    try:
        # Amount in cents
        amount_cents = int(payment_in.amount * 100)
        
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment_in.currency,
            automatic_payment_methods={
                'enabled': True,
            },
            receipt_email=payment_in.email,
             metadata={
                'integration_check': 'accept_a_payment',
            },
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class StripeVerifyRequest(BaseModel):
    payment_intent_id: str
    campaign_title: str | None = None
    amount: float | None = None # Optional fallback
    donor_email: str | None = None

@router.post("/stripe/verify", response_model=Donation)
def verify_stripe_donation(
    verify_in: StripeVerifyRequest,
    db: Session = Depends(deps.get_db)
):
    """
    Verify Stripe PaymentIntent status and record donation in DB.
    """
    try:
        # 1. Retrieve the intent from Stripe to ensure it's valid and successful
        intent = stripe.PaymentIntent.retrieve(verify_in.payment_intent_id)
        
        if intent.status != 'succeeded':
             raise HTTPException(status_code=400, detail=f"Payment not successful. Status: {intent.status}")

        # 2. Check if transaction already recorded to prevent duplicates
        existing = db.query(DonationModel).filter(DonationModel.transaction_id == intent.id).first()
        if existing:
            return existing

        # 3. Create Donation Record
        # Stripe amount is in cents, convert back to dollars
        amount_usd = intent.amount / 100.0
        
        # Try to resolve campaign_id from title if possible, or just store title in metadata if model supported it.
        # For now, we just record the donation globally if campaign_id lookup is complex, 
        # but let's try to lookup campaign by title if provided.
        campaign_id = None
        if verify_in.campaign_title:
             # Basic lookup - import needed
             from app.models.campaign import Campaign as CampaignModel
             campaign = db.query(CampaignModel).filter(CampaignModel.title == verify_in.campaign_title).first()
             if campaign:
                 campaign_id = campaign.id

        new_donation = DonationModel(
            amount=amount_usd,
            currency=intent.currency.upper(),
            payment_gateway="STRIPE",
            transaction_id=intent.id,
            status="SUCCESS",
            donor_email=verify_in.donor_email or intent.receipt_email, # prioritizing passed email (though stripe doesn't always have it)
            campaign_id=campaign_id,
            donor_name="Guest Donor" # Placeholder
        )
        
        db.add(new_donation)
        db.commit()
        db.refresh(new_donation)
        
        # 4. Update Campaign Context (Total Raised)
        if campaign_id:
             # Re-calculate or increment campaign totals
             # Ideally this should be a utility function but doing inline for now
             # We need to query all successful donations for this campaign to be safe/accurate
             total_usd = db.query(func.sum(DonationModel.amount)).filter(
                 DonationModel.campaign_id == campaign_id,
                 DonationModel.currency == 'USD',
                 DonationModel.status == 'SUCCESS'
             ).scalar() or 0.0
             
             # Assuming ETB logic is handled separately or we just update USD here
             campaign.current_raised_usd = total_usd
             db.add(campaign)
             db.commit()

        return new_donation

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error verifying donation: {e}")
        raise HTTPException(status_code=500, detail="Internal Verification Error")
