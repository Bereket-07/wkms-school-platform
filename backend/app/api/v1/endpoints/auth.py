from datetime import timedelta
from typing import Any
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

router = APIRouter()

@router.get("/login")
def login_with_google():
    """
    Redirects the user to the Google OAuth consent screen.
    """
    return RedirectResponse(
        url=f"{settings.GOOGLE_AUTH_URI}?response_type=code&client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={settings.GOOGLE_REDIRECT_URI}&scope=openid%20email%20profile"
    )

@router.get("/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    """
    Exchanges the authorization code for a token, verifies the user, 
    and returns a JWT access token if authorized.
    """
    # 1. Exchange Code for Token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            settings.GOOGLE_TOKEN_URI,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        token_json = token_response.json()
        
    if "error" in token_json:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=token_json.get("error_description")
        )

    access_token = token_json.get("access_token")

    # 2. Get User Info
    async with httpx.AsyncClient() as client:
        user_info = await client.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        profile = user_info.json()

    email = profile.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google authentication failed: No email provided.")

    # 3. Verify Whitelist
    if email not in settings.AUTHORIZED_EMAILS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access Denied: This email is not authorized for the Admin Panel."
        )

    # 4. Create or Update User in DB
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            full_name=profile.get("name"),
            hashed_password="oauth_user_no_password", # Placeholder
            is_active=True,
            is_superuser=(email in settings.SUPER_ADMIN_EMAILS)
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 5. Create Session JWT
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    # Redirect to Frontend with Token
    frontend_url = "http://localhost:3000/auth/callback"
    return RedirectResponse(f"{frontend_url}?token={token}")
