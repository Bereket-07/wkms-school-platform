# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.campaign import Campaign  # noqa
from app.models.donation import Donation  # noqa
from app.models.media import Media  # noqa
from app.models.site_content import SiteContent  # noqa
from app.models.contact import ContactMessage  # noqa
