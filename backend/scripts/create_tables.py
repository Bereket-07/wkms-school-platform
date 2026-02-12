import logging
import sys
import os

# Add the parent directory to sys.path to allow importing app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import engine
from app.db.base import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created successfully!")

if __name__ == "__main__":
    init_db()
