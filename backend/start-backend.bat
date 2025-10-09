@echo off
cd /d "%~dp0"
echo Starting Health Symptom Predictor Backend...
python -m uvicorn app.main:app --host 0.0.0.0 --port 8888 --reload
pause
