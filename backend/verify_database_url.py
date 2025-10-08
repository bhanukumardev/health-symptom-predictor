"""
Verify the exact DATABASE_URL format for Render
"""

import urllib.parse

# The working local connection
local_url = "postgresql://postgres:Bhanu123@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres"

# URL encoded version for Render
password_raw = "Bhanu123@"
password_encoded = urllib.parse.quote(password_raw, safe='')

print("=" * 80)
print("DATABASE_URL FORMAT VERIFICATION")
print("=" * 80)
print()

print("Raw Password:", password_raw)
print("URL Encoded Password:", password_encoded)
print()

# Build the correct URL
correct_url = f"postgresql://postgres:{password_encoded}@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require"

print("CORRECT DATABASE_URL for Render:")
print(correct_url)
print()

print("=" * 80)
print("COPY THIS EXACT STRING TO RENDER:")
print("=" * 80)
print(correct_url)
print()

# Also try with double encoding
double_encoded = urllib.parse.quote(password_encoded, safe='')
print("If single encoding doesn't work, try double encoding:")
url_double = f"postgresql://postgres:{double_encoded}@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres?sslmode=require"
print(url_double)
print()

# Try without sslmode
url_no_ssl = f"postgresql://postgres:{password_encoded}@db.txhohvmugqptewlvuhfn.supabase.co:5432/postgres"
print("Alternative (without sslmode parameter):")
print(url_no_ssl)
print()

print("=" * 80)
print("IMPORTANT NOTES:")
print("=" * 80)
print("1. Make sure there are NO spaces before or after the URL in Render")
print("2. The @ symbol MUST be encoded as %40")
print("3. Use the ?sslmode=require parameter for SSL")
print("4. The format is: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?OPTIONS")
