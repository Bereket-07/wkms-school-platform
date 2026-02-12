from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services import media_service
from app.api.deps import get_current_active_user

router = APIRouter()

# Schema for Response (reuse logic slightly)
from pydantic import BaseModel
class MediaSchema(BaseModel):
    id: str
    url: str
    title: str | None
    description: str | None
    media_type: str
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[MediaSchema])
def read_media(
    skip: int = 0, 
    limit: int = 100, 
    media_type: str | None = None,
    db: Session = Depends(get_db)
):
    """
    Get all gallery items.
    """
    return media_service.get_multi(db, skip=skip, limit=limit, media_type=media_type)

@router.post("/", response_model=MediaSchema)
def create_media(
    *,
    db: Session = Depends(get_db),
    media_in: media_service.MediaCreate,
    current_user = Depends(get_current_active_user)
):
    """
    Upload new media (Admin only).
    """
    return media_service.create(db=db, obj_in=media_in)

@router.delete("/{id}", response_model=Any)
def delete_media(
    *,
    db: Session = Depends(get_db),
    id: str,
    current_user = Depends(get_current_active_user)
):
    """
    Delete media item.
    """
    media = media_service.delete(db=db, id=id)
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
        
    return {"status": "success", "id": id}

@router.get("/test")
def test_media_router():
    """
    Test endpoint to verify media router is mounted.
    """
    return {"message": "Media router is working!"}

from fastapi import UploadFile, File
import aiofiles
import os
import uuid
import logging

logger = logging.getLogger(__name__)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user)
):
    """
    Upload a file and return its URL.
    Stores in 'static/uploads'.
    """
    logger.info(f"Received upload request for file: {file.filename}")
    
    try:
        UPLOAD_DIR = "/app/static/uploads" # Use absolute path inside container
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        # Generate unique filename
        ext = file.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()  # async read
            await out_file.write(content)  # async write
            
        logger.info(f"File saved successfully to: {file_path}")
        return {"url": f"/static/uploads/{filename}"}
        
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
