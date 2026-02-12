from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Shared properties
class ContactBase(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

# Properties to receive on creation
class ContactCreate(ContactBase):
    pass

# Properties to receive on update
class ContactUpdate(BaseModel):
    is_read: bool

# Properties to return to client
class ContactResponse(ContactBase):
    id: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
