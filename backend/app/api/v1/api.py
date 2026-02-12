from fastapi import APIRouter
from app.api.v1.endpoints import auth, campaigns, media, donation, chapa

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["Campaigns"])
api_router.include_router(media.router, prefix="/media", tags=["Media"])
api_router.include_router(donation.router, prefix="/donate", tags=["Donation"])

api_router.include_router(chapa.router, prefix="/donate/chapa", tags=["Chapa"])

from app.api.v1.endpoints import dashboard
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])

from app.api.v1.endpoints import site_content
api_router.include_router(site_content.router, prefix="/site-content", tags=["Site Content"])

from app.api.v1.endpoints import contact
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
