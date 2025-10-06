-- Health Symptom Predictor Database Schema

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create Symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Diseases table
CREATE TABLE IF NOT EXISTS diseases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    precautions JSONB,
    severity VARCHAR(50),
    common_symptoms JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symptoms JSONB NOT NULL,
    predicted_disease_id INTEGER REFERENCES diseases(id),
    predicted_disease_name VARCHAR(255),
    confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_info JSONB
);

-- Create Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    prediction_id INTEGER NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    is_accurate BOOLEAN,
    actual_diagnosis VARCHAR(255),
    comments TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_symptoms_name ON symptoms(name);
CREATE INDEX IF NOT EXISTS idx_diseases_name ON diseases(name);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_timestamp ON predictions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_prediction_id ON feedback(prediction_id);
