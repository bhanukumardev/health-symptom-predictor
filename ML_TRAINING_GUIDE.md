# 🎯 ML Model Training Guide - Detailed Improvement Plan

## Overview
This guide provides a comprehensive approach to improve your ML model accuracy for disease prediction, especially for Indian rural users.

## 📊 Current Model Status
- **Location**: `ml-model/src/train.py`
- **Model Type**: Basic classifier (needs upgrade)
- **Data**: Limited symptom-disease pairs

## 🚀 Step-by-Step Improvement Plan

### 1. Data Collection & Augmentation

#### A. Gather More Indian-Specific Data
```python
# Sources for Indian health data:
# 1. ICMR (Indian Council of Medical Research) datasets
# 2. Public health records from Indian hospitals
# 3. WHO India health statistics
# 4. Local health department data

# Recommended dataset size:
# - Minimum: 10,000 labeled symptom-disease pairs
# - Optimal: 50,000+ pairs
# - Include regional/seasonal variations
```

#### B. Include Vernacular Symptom Mapping
```python
# Create symptom mapping dictionary
SYMPTOM_HINDI_MAP = {
    "Fever": ["बुखार", "तापमान", "ज्वर", "bukhar"],
    "Cough": ["खांसी", "khansi", "खांसना"],
    "Headache": ["सिरदर्द", "sir dard", "सिर में दर्द"],
    # ... add all symptoms
}

# Normalize during preprocessing
def normalize_symptom(symptom_text):
    symptom_lower = symptom_text.lower().strip()
    for english, hindi_variants in SYMPTOM_HINDI_MAP.items():
        if symptom_lower in [v.lower() for v in hindi_variants]:
            return english
    return symptom_text
```

### 2. Feature Engineering

#### A. Add Demographic Features
```python
# train.py enhancement
def create_features(data):
    """
    Create rich feature set for better predictions
    """
    features = []
    
    # 1. Symptom one-hot encoding
    symptom_features = encode_symptoms(data['symptoms'])
    
    # 2. Add age group (important for disease prevalence)
    age_group = categorize_age(data['age'])  # Child, Adult, Senior
    
    # 3. Add gender (some diseases more common in specific gender)
    gender_encoded = encode_gender(data['gender'])
    
    # 4. Add season (malaria/dengue more common in monsoon)
    season = get_current_season()
    
    # 5. Add location (urban vs rural - different disease prevalence)
    location_type = data.get('location_type', 'rural')
    
    # Combine all features
    features = np.concatenate([
        symptom_features,
        age_group,
        gender_encoded,
        season,
        encode_location(location_type)
    ])
    
    return features

def categorize_age(age):
    """Age affects disease probability"""
    if age < 12:
        return [1, 0, 0, 0]  # Child
    elif age < 45:
        return [0, 1, 0, 0]  # Young adult
    elif age < 65:
        return [0, 0, 1, 0]  # Middle age
    else:
        return [0, 0, 0, 1]  # Senior
```

#### B. Symptom Severity Weighting
```python
# Weight symptoms by severity
SYMPTOM_WEIGHTS = {
    "Fever": 2.0,          # Common but important
    "Chest Pain": 3.5,     # Critical symptom
    "Shortness of Breath": 3.5,
    "Headache": 1.5,
    "Fatigue": 1.0,
    # ... define for all symptoms
}

def weighted_symptom_encoding(symptoms):
    """Apply weights to symptom importance"""
    encoded = np.zeros(NUM_SYMPTOMS)
    for symptom in symptoms:
        idx = SYMPTOM_INDEX[symptom]
        encoded[idx] = SYMPTOM_WEIGHTS.get(symptom, 1.0)
    return encoded
```

### 3. Model Selection & Ensemble

#### A. Replace Simple Classifier with Ensemble
```python
# train.py - updated model architecture
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.ensemble import VotingClassifier

def create_ensemble_model():
    """
    Create ensemble of multiple models for better accuracy
    """
    # Model 1: Random Forest
    rf_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    # Model 2: Gradient Boosting
    gb_model = GradientBoostingClassifier(
        n_estimators=150,
        max_depth=10,
        learning_rate=0.1,
        random_state=42
    )
    
    # Model 3: XGBoost (best for tabular data)
    xgb_model = XGBClassifier(
        n_estimators=200,
        max_depth=12,
        learning_rate=0.1,
        random_state=42,
        use_label_encoder=False,
        eval_metric='mlogloss'
    )
    
    # Ensemble: Vote between all models
    ensemble = VotingClassifier(
        estimators=[
            ('rf', rf_model),
            ('gb', gb_model),
            ('xgb', xgb_model)
        ],
        voting='soft',  # Use probability voting
        weights=[1, 1, 2]  # Give more weight to XGBoost
    )
    
    return ensemble

# Train ensemble
model = create_ensemble_model()
model.fit(X_train, y_train)
```

#### B. Add Neural Network (Optional for Large Data)
```python
# For datasets > 50,000 samples
import tensorflow as tf
from tensorflow import keras

def create_neural_model(input_dim, num_classes):
    """
    Deep learning model for complex patterns
    """
    model = keras.Sequential([
        keras.layers.Dense(256, activation='relu', input_shape=(input_dim,)),
        keras.layers.Dropout(0.3),
        keras.layers.BatchNormalization(),
        
        keras.layers.Dense(128, activation='relu'),
        keras.layers.Dropout(0.3),
        keras.layers.BatchNormalization(),
        
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dropout(0.2),
        
        keras.layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy', 'top_k_categorical_accuracy']
    )
    
    return model
```

### 4. Cross-Validation & Evaluation

```python
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix

def evaluate_model_thoroughly(model, X, y):
    """
    Comprehensive model evaluation
    """
    # 1. K-Fold Cross Validation (not just train/test split)
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X, y, cv=skf, scoring='accuracy')
    
    print(f"Cross-Validation Scores: {cv_scores}")
    print(f"Mean CV Accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
    
    # 2. Test set evaluation
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    # 3. Detailed metrics
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # 4. Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print("\nConfusion Matrix:")
    print(cm)
    
    # 5. Per-disease accuracy
    for disease in DISEASE_LIST:
        disease_indices = y_test == disease
        if disease_indices.sum() > 0:
            disease_accuracy = (y_pred[disease_indices] == disease).sum() / disease_indices.sum()
            print(f"{disease}: {disease_accuracy:.2%}")
    
    return model

# Use it
model = evaluate_model_thoroughly(ensemble, X, y)
```

### 5. Hyperparameter Tuning

```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV

def tune_hyperparameters(X_train, y_train):
    """
    Find best hyperparameters automatically
    """
    # Parameter grid for Random Forest
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [10, 15, 20, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'max_features': ['sqrt', 'log2']
    }
    
    rf = RandomForestClassifier(random_state=42)
    
    # Grid search with cross-validation
    grid_search = GridSearchCV(
        rf,
        param_grid,
        cv=5,
        scoring='accuracy',
        n_jobs=-1,
        verbose=2
    )
    
    grid_search.fit(X_train, y_train)
    
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best CV score: {grid_search.best_score_:.3f}")
    
    return grid_search.best_estimator_
```

### 6. Implement Feedback Loop

```python
# backend/app/services/ml_service.py

class MLModelWithFeedback:
    """
    ML model that learns from user feedback
    """
    def __init__(self):
        self.model = load_model()
        self.feedback_data = []
    
    def add_feedback(self, symptoms, predicted, actual, is_correct):
        """
        Store feedback for retraining
        """
        self.feedback_data.append({
            'symptoms': symptoms,
            'predicted': predicted,
            'actual': actual,
            'is_correct': is_correct,
            'timestamp': datetime.now()
        })
        
        # Retrain when enough feedback collected
        if len(self.feedback_data) >= 100:
            self.retrain_with_feedback()
    
    def retrain_with_feedback(self):
        """
        Incrementally improve model with feedback
        """
        # Convert feedback to training data
        X_new = [encode_symptoms(f['symptoms']) for f in self.feedback_data]
        y_new = [f['actual'] for f in self.feedback_data 
                 if f['actual'] is not None]
        
        if len(y_new) > 50:  # Minimum threshold
            # Partial fit or full retrain
            self.model.partial_fit(X_new, y_new)
            save_model(self.model)
            
            # Clear feedback data
            self.feedback_data = []
            
            logger.info(f"Model retrained with {len(y_new)} feedback samples")
```

### 7. Save & Version Models

```python
import joblib
import os
from datetime import datetime

def save_model_with_version(model, metrics):
    """
    Save model with version control
    """
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    version_dir = f"ml-model/models/v_{timestamp}"
    os.makedirs(version_dir, exist_ok=True)
    
    # Save model
    joblib.dump(model, f"{version_dir}/disease_predictor.pkl")
    
    # Save metadata
    metadata = {
        'timestamp': timestamp,
        'accuracy': metrics['accuracy'],
        'cv_score': metrics['cv_score'],
        'features': metrics['feature_names'],
        'diseases': metrics['disease_list']
    }
    
    with open(f"{version_dir}/metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Model saved to: {version_dir}")
    print(f"Accuracy: {metrics['accuracy']:.3f}")
```

## 📈 Expected Improvements

### Before Optimization:
- Accuracy: ~60-70%
- Simple symptoms only
- No demographic consideration
- Single model

### After Optimization:
- Accuracy: ~85-95%
- Rich feature set
- Ensemble models
- Feedback loop
- Versioning

## 🔄 Training Pipeline

```bash
# 1. Prepare data
python ml-model/src/prepare_data.py --source indian_health_data.csv

# 2. Train ensemble model
python ml-model/src/train.py --model ensemble --cv 5

# 3. Evaluate
python ml-model/src/evaluate.py --test-size 0.2

# 4. Deploy best model
python ml-model/src/deploy.py --version latest
```

## 📊 Monitoring

```python
# Track model performance in production
def log_prediction_metrics(prediction_id, actual_disease=None):
    """
    Track accuracy in real-time
    """
    if actual_disease:
        # Compare with prediction
        prediction = get_prediction_from_db(prediction_id)
        is_correct = (prediction.disease == actual_disease)
        
        # Log metrics
        log_to_monitoring({
            'prediction_id': prediction_id,
            'predicted': prediction.disease,
            'actual': actual_disease,
            'correct': is_correct,
            'confidence': prediction.confidence,
            'timestamp': datetime.now()
        })
```

## 🎯 Key Takeaways

1. **More Data = Better Model**
   - Collect at least 10,000 samples
   - Include Indian-specific diseases
   - Add regional variations

2. **Feature Engineering Matters**
   - Age, gender, season, location
   - Symptom severity weighting
   - Vernacular normalization

3. **Ensemble > Single Model**
   - Random Forest + XGBoost + Gradient Boosting
   - Voting or stacking

4. **Continuous Improvement**
   - Implement feedback loop
   - Retrain regularly
   - Monitor production metrics

5. **Proper Evaluation**
   - Use k-fold cross-validation
   - Test on holdout set
   - Per-disease accuracy

---

**Next Steps:**
1. Implement ensemble model (Start here!)
2. Add demographic features
3. Collect more Indian health data
4. Set up feedback loop
5. Monitor and retrain monthly

**Resources:**
- XGBoost: https://xgboost.readthedocs.io/
- Scikit-learn Ensemble: https://scikit-learn.org/stable/modules/ensemble.html
- Indian Health Data: ICMR, WHO India
