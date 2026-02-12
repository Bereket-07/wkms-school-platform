from app.db.session import SessionLocal
from app.models.donation import Donation
from sqlalchemy import func

db = SessionLocal()

total_raised_usd = db.query(func.sum(Donation.amount)).filter(
    Donation.status == "SUCCESS",
    Donation.currency == "USD"
).scalar()

total_raised_etb = db.query(func.sum(Donation.amount)).filter(
    Donation.status == "SUCCESS",
    Donation.currency == "ETB"
).scalar()

print(f"DEBUG AGGREGATION RESULT:")
print(f"USD: {total_raised_usd}")
print(f"ETB: {total_raised_etb}")

db.close()
