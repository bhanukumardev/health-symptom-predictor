from app.core.database import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash

db = SessionLocal()

# Check if user exists
existing_user = db.query(User).filter(User.email == 'kumarbhanu818@gmail.com').first()

if existing_user:
    # Update to admin
    existing_user.is_admin = True
    existing_user.is_active = True
    db.commit()
    print('✅ User already exists. Updated to admin status.')
else:
    # Create new admin user
    admin_user = User(
        email='kumarbhanu818@gmail.com',
        hashed_password=get_password_hash('Bhanu123@'),
        full_name='Bhanu Kumar Dev',
        is_active=True,
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
    print('✅ Admin user created successfully!')
    print(f'   Email: kumarbhanu818@gmail.com')
    print(f'   Password: Bhanu123@')

db.close()
