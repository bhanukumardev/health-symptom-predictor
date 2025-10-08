"""
Improved Database Migration Script: Render PostgreSQL → Supabase PostgreSQL
Handles sequences, serial types, and Supabase specifics
"""

import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import sys
from datetime import datetime

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
SUPABASE_CONFIG = {
    'host': 'db.txhohvmugqptewlvuhfn.supabase.co',
    'port': 5432,
    'database': 'postgres',
    'user': 'postgres',
    'password': 'Bhanu123@',
    'sslmode': 'require'
}

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
            self.log("Connected to Render PostgreSQL", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"Failed to connect to Render: {str(e)}", "ERROR")
            return False
            
    def connect_target(self):
        """Connect to Supabase PostgreSQL"""
        try:
            self.log("Connecting to Supabase PostgreSQL...")
            self.target_conn = psycopg2.connect(**SUPABASE_CONFIG)
            self.log("Connected to Supabase PostgreSQL", "SUCCESS")
            return True
        except Exception as e:
            self.log(f"Failed to connect to Supabase: {str(e)}", "ERROR")
            return False
            
    def migrate_table(self, table_name):
        """Migrate a single table using SQL dump approach"""
        try:
            self.log(f"Processing table: {table_name}")
            
            source_cur = self.source_conn.cursor(cursor_factory=RealDictCursor)
            target_cur = self.target_conn.cursor()
            
            # Get table structure from Render
            source_cur.execute(f"SELECT * FROM {table_name} LIMIT 0")
            columns = [desc[0] for desc in source_cur.description]
            
            # Fetch all data from source
            source_cur.execute(f"SELECT * FROM {table_name}")
            rows = source_cur.fetchall()
            
            if not rows:
                self.log(f"No data in table '{table_name}'", "INFO")
                source_cur.close()
                target_cur.close()
                return True
            
            self.log(f"Found {len(rows)} rows in '{table_name}'")
            
            # Create table in Supabase with proper SERIAL type
            self.log(f"Creating table '{table_name}' in Supabase...")
            
            if table_name == 'users':
                create_sql = """
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    full_name VARCHAR(100) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    role VARCHAR(50) DEFAULT 'user',
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            elif table_name == 'symptoms':
                create_sql = """
                CREATE TABLE IF NOT EXISTS symptoms (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL UNIQUE,
                    description TEXT,
                    severity_weight FLOAT DEFAULT 1.0,
                    category VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            elif table_name == 'diseases':
                create_sql = """
                CREATE TABLE IF NOT EXISTS diseases (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL UNIQUE,
                    description TEXT,
                    severity VARCHAR(50),
                    treatment_info TEXT,
                    precautions TEXT,
                    specialist_type VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            elif table_name == 'predictions':
                create_sql = """
                CREATE TABLE IF NOT EXISTS predictions (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    symptoms TEXT NOT NULL,
                    predicted_disease VARCHAR(100),
                    confidence_score FLOAT,
                    severity VARCHAR(50),
                    recommendations TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            elif table_name == 'feedback':
                create_sql = """
                CREATE TABLE IF NOT EXISTS feedback (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    prediction_id INTEGER REFERENCES predictions(id) ON DELETE CASCADE,
                    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                    comments TEXT,
                    is_accurate BOOLEAN,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            elif table_name == 'notifications':
                create_sql = """
                CREATE TABLE IF NOT EXISTS notifications (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    title VARCHAR(200) NOT NULL,
                    message TEXT NOT NULL,
                    type VARCHAR(50) DEFAULT 'info',
                    is_read BOOLEAN DEFAULT false,
                    language VARCHAR(10) DEFAULT 'en',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            else:
                self.log(f"Unknown table: {table_name}", "ERROR")
                return False
            
            target_cur.execute(create_sql)
            self.target_conn.commit()
            self.log(f"Table '{table_name}' created successfully")
            
            # Insert data
            self.log(f"Inserting {len(rows)} rows into '{table_name}'...")
            inserted = 0
            
            for row in rows:
                try:
                    values = [row[col] for col in columns]
                    placeholders = ','.join(['%s'] * len(values))
                    columns_str = ','.join(columns)
                    
                    insert_sql = f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})"
                    target_cur.execute(insert_sql, values)
                    inserted += 1
                except Exception as e:
                    self.log(f"Error inserting row: {str(e)}", "WARNING")
                    continue
            
            self.target_conn.commit()
            self.log(f"Inserted {inserted}/{len(rows)} rows into '{table_name}'", "SUCCESS")
            
            # Reset sequence
            target_cur.execute(f"""
                SELECT setval(pg_get_serial_sequence('{table_name}', 'id'), 
                    COALESCE((SELECT MAX(id) FROM {table_name}), 1), true);
            """)
            self.target_conn.commit()
            
            source_cur.close()
            target_cur.close()
            return True
            
        except Exception as e:
            self.log(f"Error migrating {table_name}: {str(e)}", "ERROR")
            self.target_conn.rollback()
            return False
            
    def migrate_all(self):
        """Run complete migration"""
        print("\n" + "="*60)
        print("DATABASE MIGRATION: Render -> Supabase")
        print("="*60 + "\n")
        
        if not self.connect_source():
            return False
        if not self.connect_target():
            return False
        
        tables = ['users', 'symptoms', 'diseases', 'predictions', 'feedback', 'notifications']
        success_count = 0
        
        for table in tables:
            print(f"\n--- {table.upper()} ---")
            if self.migrate_table(table):
                success_count += 1
        
        print("\n" + "="*60)
        print("MIGRATION SUMMARY")
        print("="*60)
        print(f"Successfully migrated: {success_count}/{len(tables)} tables")
        
        if success_count == len(tables):
            print("\nALL TABLES MIGRATED SUCCESSFULLY!")
        else:
            print(f"\nSome tables failed. Check logs above.")
        
        # Save log
        try:
            with open("migration_log.txt", 'w', encoding='utf-8') as f:
                f.write('\n'.join(self.migration_log))
            print("\nMigration log saved to: migration_log.txt")
        except:
            pass
        
        if self.source_conn:
            self.source_conn.close()
        if self.target_conn:
            self.target_conn.close()
        
        return success_count == len(tables)


if __name__ == "__main__":
    print("\nStarting database migration...")
    print("Source: Render PostgreSQL")
    print("Target: Supabase PostgreSQL\n")
    
    migrator = DatabaseMigrator()
    success = migrator.migrate_all()
    
    print("\n" + "="*60)
    if success:
        print("MIGRATION COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("\nNext steps:")
        print("1. Verify tables in Supabase dashboard")
        print("2. Update backend .env with Supabase connection")
        print("3. Update Render environment variables")
        print("4. Test the application")
        sys.exit(0)
    else:
        print("MIGRATION COMPLETED WITH SOME ERRORS")
        print("="*60)
        print("\nCheck migration_log.txt for details")
        sys.exit(1)
