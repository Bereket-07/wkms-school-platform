
from fastapi import APIRouter, HTTPException, Depends, Request, Header, BackgroundTasks
from sqlalchemy.orm import Session
from app.services.chapa import chapa_service
from app.api import deps
from app.core.config import settings
from pydantic import BaseModel, EmailStr
import uuid
import hmac
import hashlib
import json
from app.models.donation import Donation, DonationStatus, PaymentGateway
from app.models.campaign import Campaign

router = APIRouter()

class ChapaPaymentRequest(BaseModel):
    amount: float
    email: EmailStr
    first_name: str
    last_name: str
    campaign_title: str | None = None

@router.post("/initialize")
async def initialize_chapa_payment(
    payment: ChapaPaymentRequest,
    db: Session = Depends(deps.get_db)
):
    """
    Initialize a payment with Chapa and create PENDING donation record.
    Returns a checkout_url.
    """
    # Generate a unique transaction reference
    tx_ref = f"tx-wkms-{uuid.uuid4()}"
    
    try:
        # 1. Lookup Campaign (optional but recommended for tracking)
        campaign_id = None
        if payment.campaign_title:
             campaign = db.query(Campaign).filter(Campaign.title == payment.campaign_title).first()
             if campaign:
                 campaign_id = campaign.id

        # 2. Create PENDING Donation Record
        donation = Donation(
            amount=payment.amount,
            currency="ETB",
            payment_gateway=PaymentGateway.CHAPA,
            status=DonationStatus.PENDING,
            transaction_id=tx_ref,
            donor_email=payment.email,
            donor_name=f"{payment.first_name} {payment.last_name}",
            campaign_id=campaign_id
        )
        db.add(donation)
        db.commit()
        
        # 3. Call Chapa API
        from urllib.parse import urlencode
        
        # Use configured frontend URL
        base_return_url = f"{settings.FRONTEND_URL}/donate"
        params = {
            "redirect_status": "succeeded",
            "tx_ref": tx_ref,
            "campaign": payment.campaign_title or ""
        }
        return_url = f"{base_return_url}?{urlencode(params)}"
        
        # Webhook URL (This should be your public backend URL in production)
        # e.g. https://api.yoursite.com/api/v1/donate/chapa/webhook
        # For localhost, this won't work without a tunnel (ngrok).
        # We'll set it anyway for production readiness.
        # Assuming we might have a BACKEND_URL setting or similar, or construct it.
        # For now, let's rely on standard Chapa configuration in their dashboard if not passed,
        # or pass a placeholder if in dev.
        # callback_url = f"{settings.API_V1_STR}/donate/chapa/webhook" 
        
        response = await chapa_service.initialize_transaction(
            amount=payment.amount,
            email=payment.email,
            first_name=payment.first_name,
            last_name=payment.last_name,
            tx_ref=tx_ref,
            return_url=return_url,
            # callback_url=callback_url, # Pass if you have a public URL
            customization={
                "title": "WKMS Donation",
                "description": "Donation for Education"
            }
        )
        
        if response.get("status") != "success":
             # Mark as failed if API fails? Or just leave pending/delete.
             donation.status = DonationStatus.FAILED
             db.commit()
             raise HTTPException(status_code=400, detail=response.get("message", "Failed to initialize payment"))

        return {
            "checkout_url": response["data"]["checkout_url"], 
            "tx_ref": tx_ref
        }
    except Exception as e:
        print(f"Chapa Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/verify/{tx_ref}")
async def verify_chapa_payment(
    tx_ref: str,
    db: Session = Depends(deps.get_db)
):
    """
    Verify payment status via API (called by frontend redirect).
    """
    return await process_verification(tx_ref, db)

@router.post("/webhook")
async def chapa_webhook(
    request: Request,
    x_chapa_signature: str | None = Header(None),
    db: Session = Depends(deps.get_db)
):
    """
    Handle Chapa Webhook for asynchronous payment verification.
    """
    secret = settings.CHAPA_WEBHOOK_SECRET
    body = await request.body()
    
    # 1. Verify Signature
    if secret:
        expected_signature = hmac.new(
            secret.encode(), 
            body, 
            hashlib.sha256
        ).hexdigest()
        
        if x_chapa_signature != expected_signature:
            raise HTTPException(status_code=403, detail="Invalid signature")
            
    # 2. Parse Event
    try:
        data = json.loads(body)
        tx_ref = data.get("tx_ref")
        status = data.get("status")
        
        if status == "success" and tx_ref:
            await process_verification(tx_ref, db)
            
        return {"status": "ok"}
    except Exception as e:
        print(f"Webhook Error: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")

async def process_verification(tx_ref: str, db: Session):
    try:
        # 1. Check Chapa Status via API to be double sure (or rely on webhook data)
        # It's safer to verify against the API even in webhook to avoid spoofing if sig check failed/skipped.
        response = await chapa_service.verify_transaction(tx_ref)
        
        if response.get("status") == "success":
            # 2. Update Donation Record
            donation = db.query(Donation).filter(Donation.transaction_id == tx_ref).first()
            if donation and donation.status != DonationStatus.SUCCESS:
                donation.status = DonationStatus.SUCCESS
                
                # 3. Update Campaign Funds
                if donation.campaign_id:
                    campaign = db.query(Campaign).filter(Campaign.id == donation.campaign_id).first()
                    if campaign:
                        # Assuming amount is in ETB
                        campaign.current_raised_etb += donation.amount
                
                db.commit()
                db.refresh(donation)
                
        return response
    except Exception as e:
         print(f"Verification Logic Error: {e}")
         # Don't raise in webhook to avoid 500 retry loops if it's a logic error, but verify endpoint should raise.
         # Since this function is shared, we might want to let it raise and handle in caller.
         raise e
