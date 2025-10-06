"""
Disease Prediction Model Training Script

This script trains a machine learning model to predict diseases based on symptoms.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os
import json


def create_sample_dataset():
    """
    Create a sample dataset for demonstration.
    In production, replace this with actual medical data.
    """
    # Sample data structure
    data = {
        'fever': [1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
        'cough': [1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
        'fatigue': [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1],
        'headache': [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0],
        'sore_throat': [1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0],
        'runny_nose': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        'body_ache': [1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
        'difficulty_breathing': [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
        'chest_pain': [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        'nausea': [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
        'vomiting': [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
        'diarrhea': [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        'loss_of_taste': [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
        'loss_of_smell': [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
        'chills': [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
        'disease': ['Common Cold', 'Common Cold', 'Flu', 'Common Cold', 'Gastroenteritis',
                    'Flu', 'COVID-19', 'Common Cold', 'COVID-19', 'Gastroenteritis',
                    'Flu', 'COVID-19', 'Migraine', 'Migraine', 'Flu']
    }
    
    return pd.DataFrame(data)


def train_model(data_path=None):
    """
    Train the disease prediction model.
    
    Args:
        data_path: Path to training data CSV file (optional)
    """
    print("Loading dataset...")
    
    if data_path and os.path.exists(data_path):
        df = pd.read_csv(data_path)
    else:
        print("Using sample dataset for demonstration...")
        df = create_sample_dataset()
    
    print(f"Dataset shape: {df.shape}")
    print(f"Diseases: {df['disease'].unique()}")
    
    # Prepare features and target
    X = df.drop('disease', axis=1)
    y = df['disease']
    
    # Encode target labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )
    
    print(f"\nTraining set size: {len(X_train)}")
    print(f"Testing set size: {len(X_test)}")
    
    # Train Random Forest model
    print("\nTraining Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Evaluate model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.2%}")
    
    # Print classification report
    print("\nClassification Report:")
    try:
        print(classification_report(
            y_test, y_pred,
            target_names=label_encoder.classes_,
            zero_division=0
        ))
    except ValueError:
        print(classification_report(y_test, y_pred, zero_division=0))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 5 Most Important Features:")
    print(feature_importance.head())
    
    # Save model and encoders
    model_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, 'disease_predictor.pkl')
    encoder_path = os.path.join(model_dir, 'label_encoder.pkl')
    feature_names_path = os.path.join(model_dir, 'feature_names.json')
    
    print(f"\nSaving model to {model_path}...")
    joblib.dump(model, model_path)
    joblib.dump(label_encoder, encoder_path)
    
    # Save feature names
    with open(feature_names_path, 'w') as f:
        json.dump(list(X.columns), f)
    
    print("Model training complete!")
    
    return model, label_encoder, list(X.columns)


if __name__ == '__main__':
    # Train the model
    model, encoder, features = train_model()
    
    print("\n" + "="*50)
    print("Model is ready for deployment!")
    print("="*50)
