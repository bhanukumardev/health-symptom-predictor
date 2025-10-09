# Environment Variables Setup Guide

This document explains how to properly set up environment variables for the Health Symptom Predictor application.

## 🔒 Security Best Practices

**IMPORTANT**: Never commit actual credentials to version control. This repository has been cleaned to remove all hardcoded credentials. All sensitive information must now be provided via environment variables.

## 📋 Required Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys
GROQ_API_KEY=your-groq-api-key-here

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend.app,http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=True

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_NAME=Admin User
ADMIN_AGE=30
ADMIN_GENDER=other
ADMIN_WEIGHT=70.0
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

```env
VITE_API_URL=http://localhost:8888
```

## 🚀 Deployment Platforms

### Render.com

1. Go to your Render dashboard
2. Select your service
3. Click on "Environment" tab
4. Add each environment variable listed above
5. Click "Save Changes"
6. Wait for automatic redeploy

### Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each environment variable listed above
5. Redeploy your application

### Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to Site settings → Environment variables
4. Add each environment variable listed above
5. Redeploy your application

## 🔑 Generating Secure Credentials

### SECRET_KEY

Generate a strong random key:

```bash
# Using OpenSSL
openssl rand -hex 32

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### ADMIN_PASSWORD

Use a strong password with:
- At least 12 characters
- Mix of uppercase and lowercase letters
- Numbers and special characters
- No common words or patterns

## 📝 Example .env Files

### Backend .env (Development)

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/health_predictor
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=gsk_your_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
ENVIRONMENT=development
DEBUG=True
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password_123
ADMIN_NAME=Dev Admin
```

### Backend .env (Production)

```env
DATABASE_URL=postgresql://user:strong_password@production-host:5432/database?sslmode=require
SECRET_KEY=<generate-using-openssl-rand-hex-32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=<your-production-groq-api-key>
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-backend.onrender.com
ENVIRONMENT=production
DEBUG=False
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<very-strong-secure-password>
ADMIN_NAME=Production Admin
```

## 🧪 Testing Environment Variables

Run these scripts to test your environment variable setup:

### Test Backend Connection

```bash
cd backend
python -c "from app.core.config import settings; print(f'Database: {settings.DATABASE_URL[:30]}...')"
```

### Test Admin Credentials

```bash
cd backend
python -c "import os; print(f'Admin Email: {os.getenv(\"ADMIN_EMAIL\", \"NOT SET\")}')"
```

## ⚠️ Important Notes

1. **Never share your `.env` files**: These contain sensitive credentials
2. **Use different credentials for different environments**: Development, staging, and production should have separate credentials
3. **Rotate credentials regularly**: Change passwords and API keys periodically
4. **Backup your credentials securely**: Use a password manager or secure vault
5. **Check `.gitignore`**: Ensure `.env` files are listed and won't be committed

## 🔍 Troubleshooting

### Issue: Scripts still reference hardcoded credentials

**Solution**: All scripts have been updated to use environment variables. If you see a hardcoded credential, it's likely in a test or migration script that you need to configure.

### Issue: Application can't connect to database

**Solution**: Verify your `DATABASE_URL` is correctly formatted:
- Format: `postgresql://user:password@host:port/database?sslmode=require`
- Ensure special characters in password are URL-encoded (e.g., `@` becomes `%40`)

### Issue: Admin login not working

**Solution**: 
1. Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set correctly
2. Run `backend/create_admin.py` to create/update the admin user
3. Verify the environment variables are loaded in your application

## 📚 Additional Resources

- [How to use environment variables](https://12factor.net/config)
- [Render environment variables documentation](https://render.com/docs/environment-variables)
- [Vercel environment variables documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Security best practices](https://owasp.org/www-project-top-ten/)

---

For more information, see the main [README.md](README.md) file.
