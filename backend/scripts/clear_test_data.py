import sys
import os
from dotenv import load_dotenv

# Load .env from backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
load_dotenv(env_path)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.donation import Donation
from app.models.pledge import Pledge

db = SessionLocal()

try:
    print("Fetching existing donations and pledges...")
    donations_count = db.query(Donation).count()
    pledges_count = db.query(Pledge).count()
    
    print(f"Found {donations_count} donations and {pledges_count} pledges in the database.")
    
    if donations_count > 0 or pledges_count > 0:
        if len(sys.argv) > 1 and sys.argv[1] == "--force":
            confirm = "y"
        else:
            confirm = input("Are you sure you want to delete all donations and pledges? (y/n): ") if sys.stdin.isatty() else "y"
            
        if confirm.lower() == 'y':
            print("Deleting all donations...")
            db.query(Donation).delete()
            print("Deleting all pledges...")
            db.query(Pledge).delete()
            db.commit()
            print("Successfully cleared all donations and pledges!")
        else:
            print("Operation cancelled.")
    else:
        print("No test data to clear.")
except Exception as e:
    db.rollback()
    print(f"Error clearing data: {e}")
finally:
    db.close()
