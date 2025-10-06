#!/bin/bash
# Simple startup script for Render deployment

echo "Starting Health Symptom Predictor API..."
echo "Environment variables check:"
echo "DATABASE_URL is set: $([ -n "$DATABASE_URL" ] && echo "YES" || echo "NO")"
echo "GROQ_API_KEY is set: $([ -n "$GROQ_API_KEY" ] && echo "YES" || echo "NO")"
echo "SECRET_KEY is set: $([ -n "$SECRET_KEY" ] && echo "YES" || echo "NO")"
echo "ALLOWED_ORIGINS is set: $([ -n "$ALLOWED_ORIGINS" ] && echo "YES" || echo "NO")"

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}