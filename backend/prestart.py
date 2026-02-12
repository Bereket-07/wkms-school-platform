import logging
from sqlalchemy import create_engine, text
from app.core.config import settings
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1

def create_db_if_missing():
    # Connect to default 'postgres' db to create the target db
    default_db_url = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}/postgres"
    engine = create_engine(default_db_url, isolation_level="AUTOCOMMIT")
    
    try:
        with engine.connect() as conn:
            # Check if db exists
            result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{settings.POSTGRES_DB}'"))
            exists = result.scalar()
            
            if not exists:
                logger.info(f"Database {settings.POSTGRES_DB} does not exist. Creating...")
                conn.execute(text(f"CREATE DATABASE {settings.POSTGRES_DB}"))
                logger.info(f"Database {settings.POSTGRES_DB} created successfully.")
            else:
                logger.info(f"Database {settings.POSTGRES_DB} already exists.")
    except Exception as e:
        logger.error(f"Error creating database: {e}")
        raise e

if __name__ == "__main__":
    logger.info("Initializing database...")
    create_db_if_missing()
    logger.info("Database initialization finished.")
