from passlib.context import CryptContext
import psycopg2

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
conn = psycopg2.connect('postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require')
cur = conn.cursor()
cur.execute('SELECT email, hashed_password FROM users WHERE email = %s', ('kumarbhanu818@gmail.com',))
user = cur.fetchone()

if user:
    print(f'✓ User found: {user[0]}')
    print(f'\nTesting passwords:')
    
    # Test different password combinations
    passwords = ['Bhanu@123', 'Bhanu123@', 'bhanu@123']
    
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
