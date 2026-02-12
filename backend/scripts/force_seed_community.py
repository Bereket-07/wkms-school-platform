
import sys
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
load_dotenv(env_path)

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.crud.crud_site_content import site_content
from app.schemas.site_content import SiteContentCreate, SiteContentUpdate

db = SessionLocal()

community_data = [
    # Header
    {"section": "COMMUNITY", "key": "community_badge", "content": "Our Community", "label": "Section Badge"},
    {"section": "COMMUNITY", "key": "community_title", "content": "Understanding the Need", "label": "Main Title"},

    # Challenge
    {"section": "COMMUNITY", "key": "community_col1_title", "content": "The Challenge", "label": "Left Column Title"},
    {"section": "COMMUNITY", "key": "community_challenge_1", "content": "Lack of nearby schools forces young children to walk long distances daily.", "label": "Challenge Point 1"},
    {"section": "COMMUNITY", "key": "community_challenge_2", "content": "Economic hardship means families often prioritize farm labor over early education.", "label": "Challenge Point 2"},
    {"section": "COMMUNITY", "key": "community_challenge_3", "content": "Malnutrition affects cognitive development and ability to focus in class.", "label": "Challenge Point 3"},

    # Solution
    {"section": "COMMUNITY", "key": "community_col2_title", "content": "The WKMS Solution", "label": "Right Column Title"},
    
    {"section": "COMMUNITY", "key": "community_solution_1_label", "content": "Local Access:", "label": "Solution 1 Bold Label"},
    {"section": "COMMUNITY", "key": "community_solution_1_text", "content": "A safe, high-quality school right in the heart of the village.", "label": "Solution 1 Text"},

    {"section": "COMMUNITY", "key": "community_solution_2_label", "content": "Full Scholarships:", "label": "Solution 2 Bold Label"},
    {"section": "COMMUNITY", "key": "community_solution_2_text", "content": "Education is free for the most vulnerable families.", "label": "Solution 2 Text"},

    {"section": "COMMUNITY", "key": "community_solution_3_label", "content": "School Feeding:", "label": "Solution 3 Bold Label"},
    {"section": "COMMUNITY", "key": "community_solution_3_text", "content": "Two nutritious meals a day for every student.", "label": "Solution 3 Text"},
]

print("Force Seeding Community Content...")

for item in community_data:
    existing = site_content.get_by_key(db, key=item["key"])
    if not existing:
        print(f"CREATING: {item['key']}")
        site_content.create(db, obj_in=SiteContentCreate(**item))
    else:
        print(f"UPDATING: {item['key']}")
        # Force update content to ensure it's not empty
        site_content.update(db, db_obj=existing, obj_in=SiteContentUpdate(content=item["content"], label=item["label"]))

print("Community content population complete.")
