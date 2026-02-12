import sys
import os
from dotenv import load_dotenv

# Load .env from backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
load_dotenv(env_path)

# Add parent directory to path to import app modules
# We need to add the directory containing 'app', which is 'backend'
# __file__ = backend/scripts/seed_content.py
# dirname 1 = backend/scripts
# dirname 2 = backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.crud.crud_site_content import site_content
from app.schemas.site_content import SiteContentCreate

# Ensure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

defaults = [
    # HERO SECTION
    {"section": "HERO", "key": "hero_badge", "content": "Educating for Tomorrow", "label": "Top Badge Text"},
    {"section": "HERO", "key": "hero_title_1", "content": "Connecting Education,", "label": "Main Title Line 1"},
    {"section": "HERO", "key": "hero_title_accent", "content": "Opportunity & Impact.", "label": "Main Title Accent (Gradient)"},
    {"section": "HERO", "key": "hero_subtitle", "content": "Providing quality education to 500+ students in rural Ethiopia. We are the bridge between your generosity and their future.", "label": "Hero Subtitle"},
    {"section": "HERO", "key": "hero_video", "content": "/wkms-hero.mp4", "content_type": "VIDEO", "label": "Background Video URL"},

    # ABOUT SECTION ('Who We Are')
    {"section": "ABOUT", "key": "about_badge", "content": "Who We Are", "label": "Section Badge"},
    {"section": "ABOUT", "key": "about_title_1", "content": "More Than Just", "label": "Title Line 1"},
    {"section": "ABOUT", "key": "about_title_accent", "content": "A School.", "label": "Title Accent"},
    {"section": "ABOUT", "key": "about_text_1", "content": "Wakero Keleboro Memorial Pre-School (WKMS) was founded to honor the legacy of Wakero Keleboro, a visionary who believed in the transformative power of education.", "label": "Paragraph 1"},
    {"section": "ABOUT", "key": "about_text_2", "content": "We provide high-quality early childhood education, nutrition, and holistic care to children in rural Ethiopia, ensuring they have the foundation needed to succeed in life.", "label": "Paragraph 2"},
    {"section": "ABOUT", "key": "about_image_main", "content": "/assets/5776370369471122231.jpg", "content_type": "IMAGE", "label": "Main Image"},
    {"section": "ABOUT", "key": "about_image_accent", "content": "/assets/5776370369471122228.jpg", "content_type": "IMAGE", "label": "Floating Accent Image"},

    # IMPACT SECTION
    {"section": "IMPACT", "key": "impact_badge", "content": "Radical Transparency", "label": "Section Badge"},
    {"section": "IMPACT", "key": "impact_title", "content": "Every Cent Counted.", "label": "Main Title"},
    {"section": "IMPACT", "key": "impact_subtitle", "content": "We believe you deserve to know exactly where your money goes. We are committed to absolute financial transparency.", "label": "Subtitle"},
    {"section": "IMPACT", "key": "impact_stat_1_val", "content": "512", "label": "Stat 1 Value"},
    {"section": "IMPACT", "key": "impact_stat_1_label", "content": "Students Enrolled", "label": "Stat 1 Label"},
    {"section": "IMPACT", "key": "impact_stat_2_val", "content": "98%", "label": "Stat 2 Value"},
    {"section": "IMPACT", "key": "impact_stat_2_label", "content": "Pass Rate", "label": "Stat 2 Label"},
    {"section": "IMPACT", "key": "impact_stat_3_val", "content": "15+", "label": "Stat 3 Value"},
    {"section": "IMPACT", "key": "impact_stat_3_label", "content": "Community Projects", "label": "Stat 3 Label"},

    # FOOTER
    {"section": "FOOTER", "key": "footer_desc", "content": "Wakero Keleboro Memorial Pre-School. Empowering rural communities through education.", "label": "Footer Description"},

    # COMMUNITY SECTION
    # COMMUNITY SECTION
    {"section": "COMMUNITY", "key": "community_badge", "content": "Our Community", "label": "Section Badge"},
    {"section": "COMMUNITY", "key": "community_title", "content": "Understanding the Need", "label": "Main Title"},

    # Community: Column 1 (The Challenge)
    {"section": "COMMUNITY", "key": "community_col1_title", "content": "The Challenge", "label": "Left Column Title"},
    {"section": "COMMUNITY", "key": "community_challenge_1", "content": "Lack of nearby schools forces young children to walk long distances daily.", "label": "Challenge Point 1"},
    {"section": "COMMUNITY", "key": "community_challenge_2", "content": "Economic hardship means families often prioritize farm labor over early education.", "label": "Challenge Point 2"},
    {"section": "COMMUNITY", "key": "community_challenge_3", "content": "Malnutrition affects cognitive development and ability to focus in class.", "label": "Challenge Point 3"},

    # Community: Column 2 (The Solution)
    {"section": "COMMUNITY", "key": "community_col2_title", "content": "The WKMS Solution", "label": "Right Column Title"},
    
    {"section": "COMMUNITY", "key": "community_solution_1_label", "content": "Local Access:", "label": "Solution 1 Bold Label"},
    {"section": "COMMUNITY", "key": "community_solution_1_text", "content": "A safe, high-quality school right in the heart of the village.", "label": "Solution 1 Text"},

    {"section": "COMMUNITY", "key": "community_solution_2_label", "content": "Full Scholarships:", "label": "Solution 2 Bold Label"},
    {"section": "COMMUNITY", "key": "community_solution_2_text", "content": "Education is free for the most vulnerable families.", "label": "Solution 2 Text"},

    {"section": "COMMUNITY", "key": "community_solution_3_label", "content": "School Feeding:", "label": "Solution 3 Bold Label"},
    {"section": "COMMUNITY", "key": "community_solution_3_text", "content": "Two nutritious meals a day for every student.", "label": "Solution 3 Text"},

    # MEDIA SECTION (Text Content Only)
    {"section": "MEDIA", "key": "media_title", "content": "Stories from the Field.", "label": "Section Title"},
    {"section": "MEDIA", "key": "media_subtitle", "content": "Witness the daily moments of joy, learning, and growth at WKMS.", "label": "Section Subtitle"},
]

print("Seeding Site Content...")
for item in defaults:
    existing = site_content.get_by_key(db, key=item["key"])
    if not existing:
        print(f"Creating {item['key']}...")
        site_content.create(db, obj_in=SiteContentCreate(**item))
    else:
        print(f"Skipping {item['key']} (already exists)")

print("Done!")
