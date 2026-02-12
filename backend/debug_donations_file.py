from app.db.session import SessionLocal
from app.models.donation import Donation
import json

db = SessionLocal()
donations = db.query(Donation).all()

output = []
for d in donations:
    output.append({
        "id": d.id,
        "amount": d.amount,
        "currency": d.currency,
        "status": d.status,
        "gateway": d.payment_gateway
    })

with open("debug_output.txt", "w") as f:
    json.dump(output, f, indent=2)

db.close()
