"""Test database connection with different Supabase URLs."""
import psycopg2
import sys

# Test different connection URLs
urls = [
    # Direct connection (works locally)
    "postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres",
    
    # Session Pooler with SSL
    "postgresql://postgres:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require",
    
    # Transaction Pooler
    "postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
]

print("Testing Supabase connection URLs...\n")

for i, url in enumerate(urls, 1):
    print(f"Test {i}: {url[:60]}...")
    try:
        conn = psycopg2.connect(url)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users;")
        count = cursor.fetchone()[0]
        print(f"✅ SUCCESS! Users count: {count}")
        cursor.close()
        conn.close()
        print(f"✅ This URL works! Use this for Render:\n{url}\n")
        sys.exit(0)
    except Exception as e:
        print(f"❌ FAILED: {str(e)}\n")

print("❌ All connection attempts failed!")
sys.exit(1)
