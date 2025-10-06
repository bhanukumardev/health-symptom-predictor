# 🔐 Admin Credentials

## Your Admin Account

**Email:** `kumarbhanu818@gmail.com`  
**Password:** `Bhanu123@`  

## Admin Dashboard Access

Once logged in with these credentials, you will have full access to:

### 📊 Statistics Dashboard
- Total users count
- Total predictions made
- Total feedback received
- Average confidence score
- Accuracy rate
- Top 10 predicted diseases

### 👥 User Management
- View all registered users
- See user details (email, name, join date)
- View prediction count per user
- Toggle admin status for users
- Activate/deactivate user accounts

### 🦠 Disease Management
- View all diseases in the system
- Add new diseases
- Manage disease information
- See disease descriptions

### 📈 Prediction History
- View all predictions made by all users
- See prediction details (symptoms, disease, confidence)
- View associated user information
- Check prediction timestamps
- See additional prediction info

### 💬 Feedback Management
- View all user feedback
- See accuracy ratings
- Read user comments
- View actual diagnoses reported by users
- Track feedback timestamps

## Important Notes

✅ **Admin Status**: Your account has `is_admin: true` flag  
✅ **Active Status**: Your account is active and can log in  
✅ **Full Access**: You can access all admin endpoints  

### Security Features
- Admin cannot remove their own admin status
- Admin cannot deactivate their own account
- All admin actions are logged
- Protected by JWT authentication

## How to Access Admin Dashboard

1. **Go to:** http://localhost:3000 (or your deployed URL)
2. **Click:** "Sign In" button
3. **Enter:**
   - Email: `kumarbhanu818@gmail.com`
   - Password: `Bhanu123@`
4. **Access:** Admin dashboard from the navigation menu

## Admin API Endpoints

All admin endpoints require authentication with JWT token:

```
GET  /api/admin/stats          - System statistics
GET  /api/admin/users          - List all users
GET  /api/admin/diseases       - List all diseases
POST /api/admin/diseases       - Create new disease
GET  /api/admin/predictions    - View all predictions
GET  /api/admin/feedback       - View all feedback
PATCH /api/admin/users/{id}/toggle-admin  - Toggle admin status
PATCH /api/admin/users/{id}/toggle-active - Toggle user active status
```

## Testing Admin Access

To verify admin access works:

```powershell
# Login and get token
$body = "username=kumarbhanu818@gmail.com&password=Bhanu123@"
$response = Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/api/auth/login" -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
$token = $response.access_token

# Get admin statistics
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/api/admin/stats" -Headers $headers
```

## Troubleshooting

### If Login Fails
Run this command to reset admin credentials:
```powershell
Invoke-RestMethod -Uri "https://health-symptom-predictor.onrender.com/api/admin/init-database" -Method Post
```

### If CORS Errors Appear
Make sure `ALLOWED_ORIGINS` includes your frontend URL in Render environment variables.

---

**Keep these credentials secure!** 🔒
