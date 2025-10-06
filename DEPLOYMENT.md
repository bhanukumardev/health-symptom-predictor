# 🚀 Deployment Guide - Health Symptom Predictor

This guide covers deployment options for the Health Symptom Predictor application.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables](#environment-variables)
3. [Platform-Specific Guides](#platform-specific-guides)
   - [Railway](#option-1-railway-recommended)
   - [Render](#option-2-render)
   - [Heroku](#option-3-heroku)
   - [Digital Ocean](#option-4-digital-ocean)
   - [AWS](#option-5-aws-ec2)
4. [Docker Deployment](#docker-deployment)
5. [Production Considerations](#production-considerations)

---

## ✅ Pre-Deployment Checklist

- [ ] **Database**: PostgreSQL instance ready
- [ ] **API Keys**: Groq API key obtained
- [ ] **Environment Variables**: All variables configured
- [ ] **Dependencies**: Verified and up to date
- [ ] **Tests**: All tests passing
- [ ] **Security**: Secrets not committed to Git
- [ ] **CORS**: Frontend domain added to backend ALLOWED_ORIGINS

---

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-strong-secret-key-here
GROQ_API_KEY=your-groq-api-key
ENVIRONMENT=production
DEBUG=False
ALLOWED_ORIGINS=["https://your-frontend-domain.com"]
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## 🌐 Platform-Specific Guides

### Option 1: Railway (Recommended)

**Why Railway?**
- ✅ PostgreSQL database included
- ✅ Automatic deployments from GitHub
- ✅ Free tier available
- ✅ Easy environment variable management

#### Backend Deployment

1. **Create Railway Account**: Visit [railway.app](https://railway.app)

2. **Create New Project**:
   ```
   Dashboard → New Project → Deploy from GitHub repo
   ```

3. **Add PostgreSQL**:
   ```
   Add Service → Database → PostgreSQL
   ```
   Railway will automatically create `DATABASE_URL`

4. **Configure Backend Service**:
   - Root Directory: `/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables**:
   ```
   GROQ_API_KEY=your-key
   SECRET_KEY=generate-strong-key
   ENVIRONMENT=production
   DEBUG=False
   ```

6. **Generate Domain**: Railway will provide a domain like `app-name.up.railway.app`

#### Frontend Deployment

1. **Create Frontend Service** in same project

2. **Configure**:
   - Root Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview -- --port $PORT --host 0.0.0.0`

3. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-backend-railway-domain.up.railway.app
   ```

4. **Update Backend CORS**: Add frontend domain to `ALLOWED_ORIGINS`

---

### Option 2: Render

**Why Render?**
- ✅ Free PostgreSQL database (90 days)
- ✅ Free static site hosting
- ✅ Auto-deploy from GitHub

#### Backend (Web Service)

1. **Create Account**: [render.com](https://render.com)

2. **New Web Service**:
   - Connect GitHub repository
   - Root Directory: `backend`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL**:
   - Dashboard → New → PostgreSQL
   - Copy the Internal Database URL

4. **Environment Variables**:
   ```
   DATABASE_URL=<your-postgres-url>
   GROQ_API_KEY=<your-key>
   SECRET_KEY=<generate-strong-key>
   ENVIRONMENT=production
   PYTHON_VERSION=3.9.16
   ```

#### Frontend (Static Site)

1. **New Static Site**:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Environment Variable**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

---

### Option 3: Heroku

#### Backend

1. **Install Heroku CLI**: [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

2. **Create App**:
   ```bash
   cd backend
   heroku create your-app-name-backend
   heroku addons:create heroku-postgresql:mini
   ```

3. **Add Procfile** in backend/:
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set GROQ_API_KEY=your-key
   heroku config:set SECRET_KEY=your-secret
   heroku config:set ENVIRONMENT=production
   ```

5. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

#### Frontend (Netlify/Vercel)

Deploy to [Netlify](https://netlify.com) or [Vercel](https://vercel.com):

1. Connect GitHub repository
2. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Add environment variable: `VITE_API_URL=https://your-backend-heroku.herokuapp.com`

---

### Option 4: Digital Ocean

#### Using App Platform

1. **Create App**: [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)

2. **Add Backend Component**:
   - Type: Web Service
   - Source Directory: `/backend`
   - Run Command: `uvicorn app.main:app --host 0.0.0.0 --port 8080`

3. **Add PostgreSQL Database**:
   - Add Component → Database → PostgreSQL

4. **Add Frontend Component**:
   - Type: Static Site
   - Source Directory: `/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

### Option 5: AWS EC2

#### Setup EC2 Instance

1. **Launch EC2 Instance**: Ubuntu 22.04 LTS

2. **Install Dependencies**:
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nodejs npm postgresql-client nginx
   ```

3. **Clone Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/health-symptom-predictor.git
   cd health-symptom-predictor
   ```

4. **Setup Backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Create .env with production values
   nano .env
   ```

5. **Setup Systemd Service** (`/etc/systemd/system/health-backend.service`):
   ```ini
   [Unit]
   Description=Health Predictor Backend
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/health-symptom-predictor/backend
   Environment="PATH=/home/ubuntu/health-symptom-predictor/backend/venv/bin"
   ExecStart=/home/ubuntu/health-symptom-predictor/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

   [Install]
   WantedBy=multi-user.target
   ```

6. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

7. **Configure Nginx** (`/etc/nginx/sites-available/health-predictor`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /home/ubuntu/health-symptom-predictor/frontend/dist;
           try_files $uri /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

8. **Start Services**:
   ```bash
   sudo systemctl enable health-backend
   sudo systemctl start health-backend
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 🐳 Docker Deployment

### Using Docker Compose

1. **Ensure docker-compose.yml is configured**

2. **Create .env files**:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit with production values
   ```

3. **Deploy**:
   ```bash
   docker-compose up -d --build
   ```

4. **Check Status**:
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

---

## 🔒 Production Considerations

### Security

1. **Use Strong Secrets**:
   ```bash
   # Generate strong SECRET_KEY
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **HTTPS Only**:
   - Use Let's Encrypt for SSL certificates
   - Redirect HTTP to HTTPS

3. **Environment Variables**:
   - Never commit `.env` files
   - Use platform-specific secret management

4. **Database Security**:
   - Use strong passwords
   - Restrict database access to backend only
   - Enable SSL connections

### Performance

1. **Database**:
   - Enable connection pooling
   - Add database indexes
   - Regular backups

2. **Caching**:
   - Consider Redis for session storage
   - Cache prediction results

3. **CDN**:
   - Use CDN for frontend static assets
   - CloudFlare, AWS CloudFront, or similar

### Monitoring

1. **Application Monitoring**:
   - Sentry for error tracking
   - New Relic or DataDog for APM

2. **Logging**:
   - Centralized logging (Loggly, Papertrail)
   - Log rotation

3. **Health Checks**:
   - `/api/health` endpoint
   - Uptime monitoring (UptimeRobot, Pingdom)

### Backup Strategy

1. **Database Backups**:
   - Daily automated backups
   - Point-in-time recovery enabled
   - Test restore procedure

2. **Code Backups**:
   - Git repository
   - Tagged releases

---

## 📝 Post-Deployment Checklist

- [ ] Application accessible via HTTPS
- [ ] Database connected and migrations run
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend domain
- [ ] Health check endpoint responding
- [ ] Error tracking enabled
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate active

---

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Add frontend domain to `ALLOWED_ORIGINS` in backend
   - Rebuild and redeploy

2. **Database Connection**:
   - Verify `DATABASE_URL` format
   - Check firewall rules
   - Ensure database is running

3. **Environment Variables Not Loading**:
   - Restart application after changes
   - Verify variable names match exactly

4. **Build Failures**:
   - Check Python/Node versions
   - Verify all dependencies in requirements.txt/package.json

---

## 📞 Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Open GitHub issue with details

---

**Ready to deploy? Choose your platform and follow the guide above!** 🚀
