# Multi-stage Dockerfile for Health Symptom Predictor
# This Dockerfile is placed in the root to satisfy Render's expectations
# but builds and runs the FastAPI backend from the backend/ directory

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ ./

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

# Expose port (Render will override with $PORT)
EXPOSE 8888

# Run the FastAPI application via startup script
CMD ["./start.sh"]