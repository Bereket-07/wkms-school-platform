import sys
import os
from dotenv import load_dotenv
from sqlalchemy import text

# Load .env from backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
load_dotenv(env_path)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal

db = SessionLocal()

print("Checking database schema for is_superuser column...")
try:
    # Safely try to add the column. 
    # This raw SQL will add the column if it doesn't exist.
    db.execute(text('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE'))
    db.commit()
    print("Successfully ensured is_superuser column exists!")
except Exception as e:
    print(f"Error checking/adding column: {e}")
finally:
    db.close()
