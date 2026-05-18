from app.core.config import settings

print("SUPER_ADMIN_EMAILS:", settings.SUPER_ADMIN_EMAILS)
print("Type:", type(settings.SUPER_ADMIN_EMAILS))
if "bereket@eromoventures.com" in settings.SUPER_ADMIN_EMAILS:
    print("Found bereket@eromoventures.com!")
