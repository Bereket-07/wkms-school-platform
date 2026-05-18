import sys
import os
from dotenv import load_dotenv
from sqlalchemy import text

# Load .env from backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
load_dotenv(env_path)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.config import settings

db = SessionLocal()

print("Checking database schema for is_superuser column...")
try:
    db.execute(text('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE'))
    db.commit()
    print("Successfully ensured is_superuser column exists!")
except Exception as e:
    print(f"Error checking/adding column: {e}")

print("Updating existing users to super_admin status if they are in .env...")
try:
    # Get all users
    users = db.query(User).all()
    super_emails = [e.lower() for e in settings.SUPER_ADMIN_EMAILS]
    
    updated_count = 0
    for u in users:
        if u.email.lower() in super_emails and not u.is_superuser:
            u.is_superuser = True
            updated_count += 1
            print(f"Upgraded {u.email} to Super Admin!")
            
    if updated_count > 0:
        db.commit()
        print(f"Successfully upgraded {updated_count} users to Super Admin!")
    else:
        print("No users needed to be upgraded (either none exist, or they are already upgraded).")
except Exception as e:
    print(f"Error updating users: {e}")
finally:
    db.close()
