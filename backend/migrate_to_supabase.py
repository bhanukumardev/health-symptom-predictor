"""
Database Migration Script: Render PostgreSQL → Supabase PostgreSQL
Migrates all tables, schema, and data from Render to Supabase
"""

import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import sys
from datetime import datetime
import json

# Source: Render PostgreSQL
RENDER_CONFIG = {
    'host': 'dpg-d3hu2c1gv73c73e0l170-a.oregon-postgres.render.com',
    'port': 5432,
    'database': 'health_predictor',
    'user': 'health_predictor_user',
    'password': 'WtIo4HLKi9AEveEmlMFYONE3dxWJhfOd',
    'sslmode': 'require'
}

# Target: Supabase PostgreSQL
# Password configured for migration
SUPABASE_CONFIG = {
    'host': 'db.txhohvmugqptewlvuhfn.supabase.co',
    'port': 5432,  # Using direct connection for migration (not pooler)
    'database': 'postgres',
    'user': 'postgres',
    'password': 'Bhanu123@',
    'sslmode': 'require'
}

# Tables to migrate (in order to respect foreign key constraints)
TABLES_ORDER = [
    'users',
    'symptoms',
    'diseases',
    'predictions',
    'feedback',
    'notifications'
]

class DatabaseMigrator:
    def __init__(self):
        self.source_conn = None
        self.target_conn = None
        self.migration_log = []
        
    def log(self, message, level="INFO"):
        """Log migration progress"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level}] {message}"
        print(log_entry)
        self.migration_log.append(log_entry)
        
    def connect_source(self):
        """Connect to Render PostgreSQL"""
        try:
            self.log("Connecting to Render PostgreSQL...")
            self.source_conn = psycopg2.connect(**RENDER_CONFIG)
            self.log("✅ Connected to Render PostgreSQL", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"❌ Failed to connect to Render: {str(e)}", "ERROR")
            return False
            
    def connect_target(self):
        """Connect to Supabase PostgreSQL"""
        try:
            self.log("Connecting to Supabase PostgreSQL...")
            self.target_conn = psycopg2.connect(**SUPABASE_CONFIG)
            self.log("✅ Connected to Supabase PostgreSQL", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"❌ Failed to connect to Supabase: {str(e)}", "ERROR")
            return False
            
    def get_table_schema(self, table_name):
        """Get CREATE TABLE statement from Render"""
        try:
            cursor = self.source_conn.cursor()
            
            # Get table structure
            query = """
                SELECT 
                    column_name,
                    data_type,
                    character_maximum_length,
                    is_nullable,
                    column_default
                FROM information_schema.columns
                WHERE table_name = %s
                ORDER BY ordinal_position;
            """
            cursor.execute(query, (table_name,))
            columns = cursor.fetchall()
            
            if not columns:
                self.log(f"⚠️ Table '{table_name}' not found in source database", "WARNING")
                return None
                
            # Get primary key
            pk_query = """
                SELECT a.attname
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = %s::regclass AND i.indisprimary;
            """
            cursor.execute(pk_query, (table_name,))
            pk_columns = [row[0] for row in cursor.fetchall()]
            
            cursor.close()
            return {
                'columns': columns,
                'primary_keys': pk_columns
            }
        except Exception as e:
            self.log(f"❌ Error getting schema for {table_name}: {str(e)}", "ERROR")
            return None
            
    def create_table_in_target(self, table_name):
        """Create table in Supabase if it doesn't exist"""
        try:
            schema = self.get_table_schema(table_name)
            if not schema:
                return False
                
            cursor = self.target_conn.cursor()
            
            # Check if table already exists
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = %s
                );
            """, (table_name,))
            
            exists = cursor.fetchone()[0]
            
            if exists:
                self.log(f"Table '{table_name}' already exists in Supabase", "INFO")
                # Optionally truncate
                cursor.execute(f"TRUNCATE TABLE {table_name} CASCADE;")
                self.target_conn.commit()
                self.log(f"Truncated existing table '{table_name}'", "INFO")
            else:
                # Build CREATE TABLE statement
                columns_def = []
                for col in schema['columns']:
                    col_name = col[0]
                    data_type = col[1]
                    max_length = col[2]
                    is_nullable = col[3]
                    default_val = col[4]
                    
                    col_def = f"{col_name} "
                    
                    # Handle data types
                    if data_type == 'character varying' and max_length:
                        col_def += f"VARCHAR({max_length})"
                    else:
                        col_def += data_type.upper()
                    
                    # Nullable
                    if is_nullable == 'NO':
                        col_def += " NOT NULL"
                    
                    # Default value
                    if default_val:
                        col_def += f" DEFAULT {default_val}"
                    
                    columns_def.append(col_def)
                
                # Add primary key
                if schema['primary_keys']:
                    pk_def = f"PRIMARY KEY ({', '.join(schema['primary_keys'])})"
                    columns_def.append(pk_def)
                
                create_sql = f"CREATE TABLE {table_name} ({', '.join(columns_def)});"
                cursor.execute(create_sql)
                self.target_conn.commit()
                self.log(f"✅ Created table '{table_name}' in Supabase", "SUCCESS")
            
            cursor.close()
            return True
            
        except Exception as e:
            self.log(f"❌ Error creating table {table_name}: {str(e)}", "ERROR")
            self.target_conn.rollback()
            return False
            
    def migrate_table_data(self, table_name):
        """Migrate data from Render to Supabase"""
        try:
            # Fetch data from Render
            source_cursor = self.source_conn.cursor(cursor_factory=RealDictCursor)
            source_cursor.execute(f"SELECT * FROM {table_name};")
            rows = source_cursor.fetchall()
            
            if not rows:
                self.log(f"No data to migrate for table '{table_name}'", "INFO")
                source_cursor.close()
                return True
            
            self.log(f"Migrating {len(rows)} rows from '{table_name}'...", "INFO")
            
            # Insert into Supabase
            target_cursor = self.target_conn.cursor()
            
            for row in rows:
                columns = list(row.keys())
                values = [row[col] for col in columns]
                
                placeholders = ', '.join(['%s'] * len(values))
                columns_str = ', '.join(columns)
                
                insert_sql = f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders});"
                target_cursor.execute(insert_sql, values)
            
            self.target_conn.commit()
            self.log(f"✅ Migrated {len(rows)} rows to '{table_name}'", "SUCCESS")
            
            source_cursor.close()
            target_cursor.close()
            return True
            
        except Exception as e:
            self.log(f"❌ Error migrating data for {table_name}: {str(e)}", "ERROR")
            self.target_conn.rollback()
            return False
            
    def verify_migration(self, table_name):
        """Verify row counts match between source and target"""
        try:
            source_cursor = self.source_conn.cursor()
            target_cursor = self.target_conn.cursor()
            
            source_cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            source_count = source_cursor.fetchone()[0]
            
            target_cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            target_count = target_cursor.fetchone()[0]
            
            source_cursor.close()
            target_cursor.close()
            
            if source_count == target_count:
                self.log(f"✅ Verification passed for '{table_name}': {source_count} rows", "SUCCESS")
                return True
            else:
                self.log(f"⚠️ Row count mismatch for '{table_name}': Source={source_count}, Target={target_count}", "WARNING")
                return False
                
        except Exception as e:
            self.log(f"❌ Error verifying {table_name}: {str(e)}", "ERROR")
            return False
            
    def migrate_all(self):
        """Run complete migration"""
        self.log("="*60)
        self.log("DATABASE MIGRATION: Render → Supabase")
        self.log("="*60)
        
        # Connect to both databases
        if not self.connect_source():
            return False
        if not self.connect_target():
            return False
        
        # Migrate each table
        success_count = 0
        failed_tables = []
        
        for table_name in TABLES_ORDER:
            self.log(f"\n--- Processing table: {table_name} ---")
            
            # Create table in target
            if not self.create_table_in_target(table_name):
                failed_tables.append(table_name)
                continue
            
            # Migrate data
            if not self.migrate_table_data(table_name):
                failed_tables.append(table_name)
                continue
            
            # Verify migration
            if self.verify_migration(table_name):
                success_count += 1
        
        # Summary
        self.log("\n" + "="*60)
        self.log("MIGRATION SUMMARY")
        self.log("="*60)
        self.log(f"✅ Successfully migrated: {success_count}/{len(TABLES_ORDER)} tables")
        
        if failed_tables:
            self.log(f"❌ Failed tables: {', '.join(failed_tables)}", "ERROR")
        else:
            self.log("🎉 All tables migrated successfully!", "SUCCESS")
        
        # Save migration log
        self.save_migration_log()
        
        # Close connections
        if self.source_conn:
            self.source_conn.close()
        if self.target_conn:
            self.target_conn.close()
        
        return len(failed_tables) == 0
        
    def save_migration_log(self):
        """Save migration log to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = f"migration_log_{timestamp}.txt"
        
        with open(log_file, 'w') as f:
            f.write('\n'.join(self.migration_log))
        
        self.log(f"📝 Migration log saved to: {log_file}", "INFO")


if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     DATABASE MIGRATION: Render → Supabase                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

⚠️  IMPORTANT: Before running this script:

1. Get your Supabase database password:
   - Go to: https://supabase.com/dashboard/project/txhohvmugqptewlvuhfn
   - Click: Project Settings → Database
   - Find: Database Password (or Connection String)
   - Copy the password

2. Update SUPABASE_CONFIG['password'] in this script (line 32)

3. Ensure both databases are accessible

Press Enter to continue or Ctrl+C to cancel...
""")
    
    input()
    
    # Check if Supabase password is set
    if SUPABASE_CONFIG['password'] == 'YOUR_SUPABASE_PASSWORD_HERE':
        print("\n❌ ERROR: Please set your Supabase password in the script first!")
        print("   Update line 32: SUPABASE_CONFIG['password'] = 'your_actual_password'")
        sys.exit(1)
    
    # Run migration
    migrator = DatabaseMigrator()
    success = migrator.migrate_all()
    
    if success:
        print("\n" + "="*60)
        print("✅ MIGRATION COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("\nNext steps:")
        print("1. Update backend .env file with new DATABASE_URL")
        print("2. Update Render environment variables")
        print("3. Test the application")
        sys.exit(0)
    else:
        print("\n" + "="*60)
        print("❌ MIGRATION FAILED!")
        print("="*60)
        print("\nCheck the migration log for details.")
        sys.exit(1)
