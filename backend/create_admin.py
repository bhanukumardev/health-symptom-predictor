from app.core.database import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash
import os

db = SessionLocal()

# Use environment variables for admin credentials
admin_email = os.getenv('ADMIN_EMAIL', 'admin@example.com')
admin_password = os.getenv('ADMIN_PASSWORD', 'defaultpassword')
admin_name = os.getenv('ADMIN_NAME', 'Admin User')

# Check if user exists
existing_user = db.query(User).filter(User.email == admin_email).first()

if existing_user:
    # Update to admin
    existing_user.is_admin = True
    existing_user.is_active = True
    db.commit()
    print('✅ User already exists. Updated to admin status.')
else:
    # Create new admin user
    admin_user = User(
        email=admin_email,
        hashed_password=get_password_hash(admin_password),
        full_name=admin_name,
        is_active=True,
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
    print('✅ Admin user created successfully!')
    print(f'   Email: {admin_email}')
    print(f'   Password: Check ADMIN_PASSWORD environment variable')

db.close()
