"""
Final Migration Script - Matches exact Render schema
"""
import psycopg2
from psycopg2.extras import RealDictCursor, Json
import json
from datetime import datetime
import os

RENDER = {
    'host': os.getenv('SOURCE_DB_HOST', 'source-host.com'),
    'port': int(os.getenv('SOURCE_DB_PORT', 5432)),
    'database': os.getenv('SOURCE_DB_NAME', 'health_predictor'),
    'user': os.getenv('SOURCE_DB_USER', 'health_predictor_user'),
    'password': os.getenv('SOURCE_DB_PASSWORD', 'your-password'),
    'sslmode': 'require'
}

SUPABASE = {
    'host': os.getenv('TARGET_DB_HOST', 'target-host.com'),
    'port': int(os.getenv('TARGET_DB_PORT', 5432)),
    'database': os.getenv('TARGET_DB_NAME', 'postgres'),
    'user': os.getenv('TARGET_DB_USER', 'postgres'),
    'password': os.getenv('TARGET_DB_PASSWORD', 'your-password'),
    'sslmode': 'require'
}

def migrate():
    print("\n🚀 Starting migration: Render -> Supabase\n")
    
    # Connect
    print("Connecting to Render...")
    src = psycopg2.connect(**RENDER)
    print("✅ Connected to Render")
    
    print("Connecting to Supabase...")
    dst = psycopg2.connect(**SUPABASE)
    print("✅ Connected to Supabase\n")
    
    src_cur = src.cursor(cursor_factory=RealDictCursor)
    dst_cur = dst.cursor()
    
    # Drop existing tables (clean start)
    print("Cleaning Supabase...")
    dst_cur.execute("DROP TABLE IF EXISTS feedback CASCADE")
    dst_cur.execute("DROP TABLE IF EXISTS predictions CASCADE")
    dst_cur.execute("DROP TABLE IF EXISTS notifications CASCADE")
    dst_cur.execute("DROP TABLE IF EXISTS diseases CASCADE")
    dst_cur.execute("DROP TABLE IF EXISTS symptoms CASCADE")
    dst_cur.execute("DROP TABLE IF EXISTS users CASCADE")
    dst.commit()
    print("✅ Cleaned\n")
    
    # Create users table
    print("Creating users table...")
    dst_cur.execute("""
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            age INTEGER,
            gender VARCHAR(10),
            weight FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT true,
            is_admin BOOLEAN DEFAULT false
        )
    """)
    dst.commit()
    
    # Migrate users
    src_cur.execute("SELECT * FROM users")
    users = src_cur.fetchall()
    print(f"Migrating {len(users)} users...")
    for u in users:
        dst_cur.execute("""
            INSERT INTO users (id, email, hashed_password, full_name, age, gender, weight,
                             created_at, updated_at, is_active, is_admin)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (u['id'], u['email'], u['hashed_password'], u['full_name'], u['age'],
              u['gender'], u['weight'], u['created_at'], u['updated_at'],
              u['is_active'], u['is_admin']))
    dst.commit()
    dst_cur.execute("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
    dst.commit()
    print(f"✅ Migrated {len(users)} users\n")
    
    # Create symptoms table
    print("Creating symptoms table...")
    dst_cur.execute("""
        CREATE TABLE symptoms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            severity_level INTEGER,
            category VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    dst.commit()
    
    # Migrate symptoms
    src_cur.execute("SELECT * FROM symptoms")
    symptoms = src_cur.fetchall()
    if symptoms:
        print(f"Migrating {len(symptoms)} symptoms...")
        for s in symptoms:
            dst_cur.execute("""
                INSERT INTO symptoms (id, name, description, severity_level, category, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (s['id'], s['name'], s['description'], s['severity_level'],
                  s['category'], s['created_at']))
        dst.commit()
        dst_cur.execute("SELECT setval('symptoms_id_seq', (SELECT MAX(id) FROM symptoms))")
        dst.commit()
        print(f"✅ Migrated {len(symptoms)} symptoms\n")
    else:
        print("✅ No symptoms data\n")
    
    # Create diseases table
    print("Creating diseases table...")
    dst_cur.execute("""
        CREATE TABLE diseases (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            precautions JSONB,
            severity VARCHAR(50),
            common_symptoms JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    dst.commit()
    
    # Migrate diseases
    src_cur.execute("SELECT * FROM diseases")
    diseases = src_cur.fetchall()
    if diseases:
        print(f"Migrating {len(diseases)} diseases...")
        for d in diseases:
            dst_cur.execute("""
                INSERT INTO diseases (id, name, description, precautions, severity, common_symptoms, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (d['id'], d['name'], d['description'],
                  Json(d['precautions']) if d['precautions'] else None,
                  d['severity'],
                  Json(d['common_symptoms']) if d['common_symptoms'] else None,
                  d['created_at']))
        dst.commit()
        dst_cur.execute("SELECT setval('diseases_id_seq', (SELECT MAX(id) FROM diseases))")
        dst.commit()
        print(f"✅ Migrated {len(diseases)} diseases\n")
    else:
        print("✅ No diseases data\n")
    
    # Create predictions table
    print("Creating predictions table...")
    dst_cur.execute("""
        CREATE TABLE predictions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            symptoms JSONB NOT NULL,
            symptoms_text TEXT,
            predicted_disease_id INTEGER REFERENCES diseases(id),
            predicted_disease_name VARCHAR(100),
            confidence_score FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            additional_info JSONB
        )
    """)
    dst.commit()
    
    # Migrate predictions
    src_cur.execute("SELECT * FROM predictions")
    predictions = src_cur.fetchall()
    if predictions:
        print(f"Migrating {len(predictions)} predictions...")
        for p in predictions:
            dst_cur.execute("""
                INSERT INTO predictions (id, user_id, symptoms, symptoms_text, predicted_disease_id,
                                       predicted_disease_name, confidence_score, created_at, timestamp, additional_info)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (p['id'], p['user_id'],
                  Json(p['symptoms']) if p['symptoms'] else None,
                  p['symptoms_text'], p['predicted_disease_id'], p['predicted_disease_name'],
                  p['confidence_score'], p['created_at'], p['timestamp'],
                  Json(p['additional_info']) if p['additional_info'] else None))
        dst.commit()
        dst_cur.execute("SELECT setval('predictions_id_seq', (SELECT MAX(id) FROM predictions))")
        dst.commit()
        print(f"✅ Migrated {len(predictions)} predictions\n")
    else:
        print("✅ No predictions data\n")
    
    # Create feedback table
    print("Creating feedback table...")
    dst_cur.execute("""
        CREATE TABLE feedback (
            id SERIAL PRIMARY KEY,
            prediction_id INTEGER REFERENCES predictions(id) ON DELETE CASCADE,
            is_accurate BOOLEAN,
            actual_diagnosis TEXT,
            comments TEXT,
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    dst.commit()
    
    # Migrate feedback
    src_cur.execute("SELECT * FROM feedback")
    feedbacks = src_cur.fetchall()
    if feedbacks:
        print(f"Migrating {len(feedbacks)} feedbacks...")
        for f in feedbacks:
            dst_cur.execute("""
                INSERT INTO feedback (id, prediction_id, is_accurate, actual_diagnosis, comments, rating, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (f['id'], f['prediction_id'], f['is_accurate'], f['actual_diagnosis'],
                  f['comments'], f['rating'], f['created_at']))
        dst.commit()
        dst_cur.execute("SELECT setval('feedback_id_seq', (SELECT MAX(id) FROM feedback))")
        dst.commit()
        print(f"✅ Migrated {len(feedbacks)} feedbacks\n")
    else:
        print("✅ No feedback data\n")
    
    # Create notifications table
    print("Creating notifications table...")
    dst_cur.execute("""
        CREATE TABLE notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) DEFAULT 'info',
            is_read BOOLEAN DEFAULT false,
            language VARCHAR(10) DEFAULT 'en',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    dst.commit()
    
    # Migrate notifications
    src_cur.execute("SELECT * FROM notifications")
    notifications = src_cur.fetchall()
    if notifications:
        print(f"Migrating {len(notifications)} notifications...")
        for n in notifications:
            # Check if language column exists
            lang = n.get('language', 'en')
            dst_cur.execute("""
                INSERT INTO notifications (id, user_id, title, message, type, is_read, language, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (n['id'], n['user_id'], n['title'], n['message'], n['type'],
                  n['is_read'], lang, n['created_at']))
        dst.commit()
        dst_cur.execute("SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications))")
        dst.commit()
        print(f"✅ Migrated {len(notifications)} notifications\n")
    else:
        print("✅ No notifications data\n")
    
    # Verify
    print("\n📊 Verification:")
    dst_cur.execute("SELECT COUNT(*) FROM users")
    print(f"  Users: {dst_cur.fetchone()[0]}")
    dst_cur.execute("SELECT COUNT(*) FROM diseases")
    print(f"  Diseases: {dst_cur.fetchone()[0]}")
    dst_cur.execute("SELECT COUNT(*) FROM predictions")
    print(f"  Predictions: {dst_cur.fetchone()[0]}")
    dst_cur.execute("SELECT COUNT(*) FROM feedback")
    print(f"  Feedback: {dst_cur.fetchone()[0]}")
    dst_cur.execute("SELECT COUNT(*) FROM notifications")
    print(f"  Notifications: {dst_cur.fetchone()[0]}")
    
    src.close()
    dst.close()
    
    print("\n🎉 MIGRATION COMPLETE!\n")

if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
        import traceback
        traceback.print_exc()
