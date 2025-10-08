from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, symptoms, predictions, admin, chat, profile
from app.routers import notifications
from app.core.config import settings
import re

app = FastAPI(
    title="Health Symptom Predictor API",
    description="AI-powered disease prediction system based on symptoms",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

"""
CORS configuration
We support both:
- Explicit allowlist via ALLOWED_ORIGINS (comma-separated)
- Optional regex via ALLOWED_ORIGIN_REGEX to match dynamic domains (e.g., *.vercel.app)
"""
allowed_origins = settings.ALLOWED_ORIGINS
origin_regex_pattern = settings.ALLOWED_ORIGIN_REGEX
compiled_origin_regex = re.compile(origin_regex_pattern) if origin_regex_pattern else None

print(
    "CORS: Allowing origins:", allowed_origins,
)
if origin_regex_pattern:
    print(f"CORS: Also allowing origins matching regex: {origin_regex_pattern}")

# Note: Starlette's CORSMiddleware does not accept regex directly.
# We therefore allow all origins in middleware but validate in a lightweight
# pre-processing step and strip CORS headers for disallowed origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not compiled_origin_regex else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"]
)

@app.middleware("http")
async def cors_regex_guard(request: Request, call_next):
    # If no regex configured, defer to default CORSMiddleware behavior
    if not compiled_origin_regex:
        return await call_next(request)

    origin = request.headers.get("origin") or request.headers.get("Origin")
    # Allow if origin in explicit list or matches regex
    is_allowed = False
    if origin:
        if origin in allowed_origins:
            is_allowed = True
        elif compiled_origin_regex.match(origin):
            is_allowed = True

    # For CORS preflight requests, do NOT short-circuit for allowed origins;
    # let CORSMiddleware generate proper headers. Only block disallowed.
    if request.method == "OPTIONS":
        if is_allowed:
            return await call_next(request)
        # Block disallowed origins explicitly so browser sees failure
        return Response("CORS origin not allowed", status_code=400)

    response = await call_next(request)
    if not is_allowed and origin:
        # Remove any CORS headers that may have been added by wildcard allowance
        for h in [
            "access-control-allow-origin",
            "access-control-allow-credentials",
            "access-control-expose-headers",
            "access-control-allow-methods",
            "access-control-allow-headers",
        ]:
            if h in response.headers:
                del response.headers[h]
    return response

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile.router, prefix="/api/user", tags=["User Profile"])
app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptoms"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(notifications.router, tags=["Notifications"])

@app.get("/")
async def root():
    return {
        "message": "Health Symptom Predictor API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
