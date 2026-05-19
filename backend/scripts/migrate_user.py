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

print("Updating users to match .env super_admin status...")
try:
    # Get all users
    users = db.query(User).all()
    super_emails = [e.lower() for e in settings.SUPER_ADMIN_EMAILS]
    
    upgraded_count = 0
    demoted_count = 0
    
    for u in users:
        is_in_env = u.email.lower() in super_emails
        
        if is_in_env and not u.is_superuser:
            u.is_superuser = True
            upgraded_count += 1
            print(f"Upgraded {u.email} to Super Admin!")
        elif not is_in_env and u.is_superuser:
            u.is_superuser = False
            demoted_count += 1
            print(f"Demoted {u.email} from Super Admin!")
            
    if upgraded_count > 0 or demoted_count > 0:
        db.commit()
        print(f"Successfully upgraded {upgraded_count} and demoted {demoted_count} users!")
    else:
        print("All users are perfectly synced with .env! No changes needed.")
except Exception as e:
    print(f"Error updating users: {e}")
finally:
    db.close()
