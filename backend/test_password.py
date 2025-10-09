from passlib.context import CryptContext
import psycopg2
import os

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Use environment variable for database connection
db_url = os.getenv('DATABASE_URL', 'postgresql://user:password@host:port/database?sslmode=require')
conn = psycopg2.connect(db_url)
cur = conn.cursor()

# Use environment variable for admin email
admin_email = os.getenv('ADMIN_EMAIL', 'admin@example.com')
cur.execute('SELECT email, hashed_password FROM users WHERE email = %s', (admin_email,))
user = cur.fetchone()

if user:
    print(f'✓ User found: {user[0]}')
    print(f'\nTesting passwords:')
    
    # Test different password combinations
    passwords = os.getenv('TEST_PASSWORDS', 'password1,password2,password3').split(',')
    
    for pwd in passwords:
        is_valid = pwd_context.verify(pwd, user[1])
        status = '✅ VALID' if is_valid else '❌ Invalid'
        print(f'  {pwd}: {status}')
        if is_valid:
            print(f'\n🎉 Correct password: {pwd}')
            break
else:
    print('❌ User not found')

conn.close()
