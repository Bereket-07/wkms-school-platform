
import httpx
from typing import Optional, Dict, Any
from app.core.config import settings

class ChapaService:
    BASE_URL = "https://api.chapa.co/v1"

    def __init__(self):
        # Ensure your env vars are loaded. 
        # If settings.CHAPA_SECRET_KEY is empty, this might fail or cause auth errors.
        self.headers = {
            "Authorization": f"Bearer {settings.CHAPA_SECRET_KEY}",
            "Content-Type": "application/json"
        }

    async def initialize_transaction(
        self, 
        amount: float, 
        email: str, 
        first_name: str, 
        last_name: str, 
        tx_ref: str, 
        callback_url: Optional[str] = None, 
        return_url: Optional[str] = None,
        customization: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/transaction/initialize"
        payload = {
            "amount": str(amount),
            "currency": "ETB",
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "tx_ref": tx_ref,
            "callback_url": callback_url,
            "return_url": return_url,
            "customization": customization
        }
        
        # Remove None values
        payload = {k: v for k, v in payload.items() if v is not None}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, headers=self.headers)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                print(f"Chapa API Error: {e.response.text}")
                raise e

    async def verify_transaction(self, tx_ref: str) -> Dict[str, Any]:
        url = f"{self.BASE_URL}/transaction/verify/{tx_ref}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()

chapa_service = ChapaService()
