import sys
import psycopg2

try:
    # Connect to PostgreSQL
    conn = psycopg2.connect(
        host="127.0.0.1",
        port=5432,
        database="health_db",
        user="health_user",
        password="health_password"
    )
    cursor = conn.cursor()
    
    # Update admin status
    cursor.execute("""
        UPDATE users 
        SET is_admin = TRUE, is_active = TRUE
        WHERE email = 'kumarbhanu818@gmail.com'
    """)
    
    rows_affected = cursor.rowcount
    conn.commit()
    
    if rows_affected > 0:
        print(f"✅ SUCCESS! Updated {rows_affected} user(s)")
        
        # Verify
        cursor.execute("""
            SELECT email, is_admin, is_active 
            FROM users 
            WHERE email = 'kumarbhanu818@gmail.com'
        """)
        user = cursor.fetchone()
        print(f"\n📋 User Status:")
        print(f"   Email: {user[0]}")
        print(f"   Is Admin: {user[1]}")
        print(f"   Is Active: {user[2]}")
        
        if user[1]:
            print(f"\n🎉 You are now an ADMIN!")
            print(f"\n📝 Next steps:")
            print(f"   1. Go to your browser")
            print(f"   2. Press F12 → Console tab")
            print(f"   3. Type: location.reload()")
            print(f"   4. Press Enter")
            print(f"   5. Look for cyan 'Admin' link in navigation!")
        else:
            print("\n❌ ERROR: is_admin is still FALSE!")
            sys.exit(1)
    else:
        print("❌ ERROR: User not found!")
        sys.exit(1)
        
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ ERROR: {e}")
    sys.exit(1)
