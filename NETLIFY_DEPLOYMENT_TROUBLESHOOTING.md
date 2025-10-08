# 🔧 Netlify Deployment Troubleshooting Guide

## ✅ Recently Fixed Issues (October 8, 2025)

### Problem: npm ENOENT Error During Dependency Installation
```
npm error code ENOENT
npm error syscall open
npm error path /opt/buildhome/.nvm/versions/node/v18.20.4/bin/npm/package.json
npm error errno -2
```

### Root Cause:
- Node.js version mismatch between local and Netlify
- npm path configuration issues
- Problematic `npm ci` command with corrupted npm installation

### Solution Applied:
1. **Fixed Node.js Version:**
   - Added `.nvmrc` files with exact version: `18.20.8`
   - Updated `netlify.toml` NODE_VERSION to match

2. **Simplified Build Configuration:**
   ```toml
   [build]
     base = "frontend"
     command = "npm install && npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "18.20.8"
     VITE_API_URL = "https://health-symptom-predictor.onrender.com"
   ```

3. **Removed Problematic Settings:**
   - Removed `NPM_FLAGS` environment variable
   - Changed `npm ci` to `npm install` (more reliable on Netlify)

## 📋 Current Working Configuration

### netlify.toml
```toml
[build]
  base = "frontend"
  command = "npm install && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18.20.8"
  VITE_API_URL = "https://health-symptom-predictor.onrender.com"
```

### .nvmrc (both root and frontend/)
```
18.20.8
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "vite --port 3000",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 3000"
  }
}
```

## 🚀 Deployment Process

1. **Local Build Test:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

3. **Netlify Auto-Deploy:**
   - Triggered by GitHub push
   - Takes 2-3 minutes
   - Deploys to: https://health-symptom-predictor.netlify.app

## 🔍 Build Verification

### Expected Output:
```
✓ 2141 modules transformed.
dist/index.html                   0.42 kB │ gzip:   0.28 kB
dist/assets/index-3M8WyxbS.css   44.43 kB │ gzip:   8.14 kB
dist/assets/index-GG1Z5hNc.js   544.20 kB │ gzip: 170.02 kB
✓ built in ~5-7s
```

### Build Success Indicators:
- ✅ Node.js 18.20.8 detected
- ✅ npm packages installed successfully
- ✅ TypeScript compilation passes
- ✅ Vite build completes
- ✅ Assets optimized and gzipped

## 🆘 Common Issues & Solutions

### Issue: Build fails with "Cannot find module"
**Solution:** 
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Vite environment variables not working
**Solution:** Ensure variables start with `VITE_` prefix in netlify.toml

### Issue: React Router 404 errors
**Solution:** Verify redirects rule in netlify.toml:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Issue: Backend API calls failing
**Solution:** Check VITE_API_URL in netlify.toml matches backend URL

## 📊 Performance Optimizations

### Current Build Stats:
- **CSS:** 44.43 kB (gzipped: 8.14 kB)
- **JavaScript:** 544.20 kB (gzipped: 170.02 kB)
- **Build Time:** ~5-7 seconds
- **Total Assets:** ~45MB uncompressed

### Optimization Opportunities:
1. Code splitting with dynamic imports
2. Lazy loading of routes
3. Tree shaking unused dependencies
4. Image optimization

## 🎯 Success Criteria

### Frontend Deployment Successful When:
- ✅ Build completes without errors
- ✅ Site loads at https://health-symptom-predictor.netlify.app
- ✅ All pages navigate correctly
- ✅ API calls to backend work
- ✅ Admin dashboard displays properly
- ✅ Authentication functions correctly

---

**Last Updated:** October 8, 2025  
**Status:** ✅ All issues resolved, deployment working  
**Next Review:** As needed for future updates