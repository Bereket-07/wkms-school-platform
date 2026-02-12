import logging
import sys

# Suppress SQLAlchemy logs
logging.basicConfig(level=logging.ERROR)
logging.getLogger('sqlalchemy.engine').setLevel(logging.ERROR)

from app.db.session import SessionLocal
from app.models.donation import Donation

db = SessionLocal()
donations = db.query(Donation).all()

print(f"Total Donations: {len(donations)}")
for d in donations:
    print(f"ID: {d.id}, Amount: {d.amount}, Currency: '{d.currency}', Status: '{d.status}', Gateway: {d.payment_gateway}")

db.close()
