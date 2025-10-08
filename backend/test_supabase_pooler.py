"""
Test all Supabase connection methods to find the one that works on Render
"""
import psycopg2
import sys

# Test all possible Supabase connection strings
connection_strings = {
    "1. Transaction Pooler (Port 6543 with project username)":
        "postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require",

    "2. Session Pooler (Port 5432 with project username)":
        "postgresql://postgres.txhohvmugqptewlvuhfn:Bhanu123%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require",

    "3. Direct Connection (Port 5432)":
        "postgresql://postgres:Bhanu123%40@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require",
}

print("=" * 80)
print("TESTING ALL SUPABASE CONNECTION METHODS")
print("=" * 80)
print()

working_urls = []

for name, url in connection_strings.items():
    print(f"Testing: {name}")
    print(f"URL: {url[:70]}...")
    
    try:
        # Try to connect
        conn = psycopg2.connect(url)
        cursor = conn.cursor()
        
        # Test query
        cursor.execute("SELECT COUNT(*) FROM users;")
        user_count = cursor.fetchone()[0]
        
        # Test another query
        cursor.execute("SELECT COUNT(*) FROM predictions;")
        prediction_count = cursor.fetchone()[0]
        
        cursor.close()
        conn.close()
        
        print(f"✅ SUCCESS!")
        print(f"   → Users: {user_count}")
        print(f"   → Predictions: {prediction_count}")
        print()
        
        working_urls.append((name, url))
        
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        print()

print("=" * 80)
print("SUMMARY")
print("=" * 80)

if working_urls:
    print(f"\n✅ {len(working_urls)} connection method(s) working:\n")
    for i, (name, url) in enumerate(working_urls, 1):
        print(f"{i}. {name}")
        print(f"   Use this on Render:")
        print(f"   {url}")
        print()
    
    # Recommend the best one for Render
    print("=" * 80)
    print("RECOMMENDATION FOR RENDER")
    print("=" * 80)
    
    # Prefer transaction pooler (as suggested), then session pooler, then direct
    for name, url in working_urls:
        if "Transaction Pooler" in name and "6543" in name:
            print(f"\n🎯 BEST CHOICE (Transaction Pooler - Port 6543):")
            print(f"\n{url}")
            print("\nThis is ideal for Render because:")
            print("✅ Better for serverless/cloud platforms")
            print("✅ Handles connection limits better")
            print("✅ SSL enforced")
            sys.exit(0)
    
    for name, url in working_urls:
        if "Session Pooler" in name:
            print(f"\n🎯 RECOMMENDED (Session Pooler - Port 5432):")
            print(f"\n{url}")
            print("\nThis is good for Render because:")
            print("✅ Stable long-lived connections")
            print("✅ SSL enforced")
            sys.exit(0)
    
    # Fallback to direct if poolers don't work
    print(f"\n⚠️ FALLBACK (Direct Connection):")
    print(f"\n{working_urls[0][1]}")
    print("\nNote: May have IPv6 issues on Render")
    
else:
    print("\n❌ No working connection methods found!")
    print("\n🆘 Troubleshooting steps:")
    print("1. Verify Supabase project is active")
    print("2. Check password is correct: Bhanu123@")
    print("3. Verify project ID: txhohvmugqptewlvuhfn")
    print("4. Check Supabase dashboard for connection pooling settings")
    sys.exit(1)
