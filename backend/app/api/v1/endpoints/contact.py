from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactResponse, ContactUpdate

router = APIRouter()

@router.post("/", response_model=ContactResponse)
def create_contact_message(
    *,
    db: Session = Depends(deps.get_db),
    contact_in: ContactCreate,
) -> Any:
    """
    Create a new contact message (Public).
    """
    contact_message = ContactMessage(
        name=contact_in.name,
        email=contact_in.email,
        subject=contact_in.subject,
        message=contact_in.message,
    )
    db.add(contact_message)
    db.commit()
    db.refresh(contact_message)
    return contact_message

@router.get("/", response_model=List[ContactResponse])
def read_contact_messages(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user = Depends(deps.get_current_active_superuser), # TODO: Enable auth in production
) -> Any:
    """
    Retrieve contact messages (Admin only).
    """
    # if not current_user.is_superuser:
    #     raise HTTPException(status_code=400, detail="Not enough permissions")
    
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit).all()
    return messages

@router.put("/{id}", response_model=ContactResponse)
def update_contact_message(
    *,
    db: Session = Depends(deps.get_db),
    id: str,
    contact_in: ContactUpdate,
    # current_user = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a contact message (e.g. mark as read).
    """
    message = db.query(ContactMessage).filter(ContactMessage.id == id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = contact_in.is_read
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
