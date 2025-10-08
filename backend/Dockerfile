FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8888

# Run the application with PORT environment variable support
# Render injects $PORT, but we default to 8888 for local development
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8888}
