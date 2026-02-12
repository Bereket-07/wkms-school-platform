from sqlalchemy import create_engine, text
from app.core.config import settings
import os
import sys

# Add parent directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Create engine directly
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

def inspect_media():
    print("Connecting to database...")
    with engine.connect() as connection:
        result = connection.execute(text("SELECT id, url, media_type, title FROM media ORDER BY created_at DESC"))
        print("\n--- Media Items ---")
        for row in result:
            print(f"ID: {row.id}")
            print(f"Title: {row.title}")
            print(f"URL: {row.url}")
            print(f"Media Type: '{row.media_type}' (Type: {type(row.media_type)})")
            print("-" * 30)

if __name__ == "__main__":
    inspect_media()
