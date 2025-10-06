# 🧪 Admin Dashboard Testing Guide

## Quick Test Checklist

### ✅ Backend Server Status
```powershell
# Backend should be running on port 8000
# Check terminal for: "Application startup complete"
```

### ✅ Frontend Server Status
```powershell
# Frontend should be running on port 3001 or 3000
# Check terminal for: "Local: http://localhost:3001/"
```

---

## 🔐 Admin Login

**URL**: http://localhost:3001/login

**Admin Credentials**:
- **Email**: kumarbhanu818@gmail.com
- **Password**: Bhanu123@

**Expected**: Successful login → Redirect to home page with admin menu visible

---

## 📊 Test 1: Admin Dashboard

**Steps**:
1. Login as admin
2. Navigate to: http://localhost:3001/admin

**Expected Results**:
- ✅ Statistics cards showing:
  - Total Users count
  - Total Predictions count
  - Total Feedback count
  - Accuracy Rate percentage
- ✅ Bar chart with "Top Predicted Diseases"
- ✅ Three action buttons:
  - "View All Users"
  - "View All Predictions"
  - "View All Feedback"

**Success Criteria**: All numbers display correctly (no errors in console)

---

## 👥 Test 2: Users Management Page

**Steps**:
1. From admin dashboard, click **"View All Users"**
2. OR navigate to: http://localhost:3001/admin/users

**Expected Results**:
- ✅ Page title: "All Users (X)" with count
- ✅ "← Back to Dashboard" link
- ✅ Table with columns:
  - Email
  - Full Name
  - Predictions (badge with count)
  - Admin (Yes/No badge)
  - Active (Active/Inactive badge)
  - Joined (date)
  - Actions (👑 and 🔒/🔓 buttons)
- ✅ Current admin user visible in list

**Interaction Tests**:
- Click 👑 on another user → Admin status should toggle
- Click 🔒 on another user → Active status should toggle
- Table should refresh automatically after each action

**Security Tests**:
- Try toggling own admin status → Should see error message
- Try deactivating own account → Should see error message

---

## 🔮 Test 3: Predictions Overview Page

**Steps**:
1. From admin dashboard, click **"View All Predictions"**
2. OR navigate to: http://localhost:3001/admin/predictions

**Expected Results**:
- ✅ Page title: "All Predictions (X)" with count
- ✅ "← Back to Dashboard" link
- ✅ Prediction cards showing:
  - Predicted disease name (cyan color)
  - User email (small text)
  - Symptoms list
  - Confidence score (progress bar + percentage)
  - Timestamp
  - Feedback status badge:
    - "✓ Accurate" (green)
    - "✗ Inaccurate" (red)
    - "No feedback" (gray)
  - Rating stars (⭐ if available)

**Success Criteria**:
- All predictions sorted by most recent first
- Confidence bars display correctly (0-100%)
- Feedback badges show correct colors

---

## 💬 Test 4: Feedback Review Page

**Steps**:
1. From admin dashboard, click **"View All Feedback"**
2. OR navigate to: http://localhost:3001/admin/feedback

**Expected Results**:
- ✅ Page title: "All Feedback (X)" with count
- ✅ "← Back to Dashboard" link
- ✅ Summary statistics (3 cards):
  - Accurate Predictions (green)
  - Inaccurate Predictions (red)
  - Average Rating (yellow with stars)
- ✅ Feedback cards showing:
  - Predicted disease
  - Accuracy badge (✓/✗)
  - User email
  - Timestamp
  - Rating (⭐ stars)
  - Actual Diagnosis box (if provided)
  - Comments box (if provided)

**Success Criteria**:
- Statistics calculate correctly
- All feedback sorted by most recent
- Actual diagnosis and comments display when available
- Empty state shows "No feedback found" if none exist

---

## 🔧 Test 5: API Endpoints (Manual)

### Check Backend Directly:

**1. Get Statistics**:
```powershell
# Replace YOUR_TOKEN with actual JWT token from localStorage
curl http://localhost:8000/api/admin/stats `
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: JSON with total_users, total_predictions, accuracy_rate, etc.

**2. Get All Users**:
```powershell
curl http://localhost:8000/api/admin/users `
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Array of user objects with prediction_count

**3. Get All Predictions**:
```powershell
curl http://localhost:8000/api/admin/predictions `
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Array of predictions with user_email, symptoms, confidence_score

**4. Get All Feedback**:
```powershell
curl http://localhost:8000/api/admin/feedback `
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected**: Array of feedback with is_accurate, rating, comments

---

## 🛡️ Test 6: Security & Access Control

### Non-Admin User Test:
1. Create a new user (non-admin)
2. Login with new user
3. Try to access: http://localhost:3001/admin

**Expected**: 
- ✅ Error message: "Admin access required"
- ✅ Redirect to home or show error

### Unauthenticated Access Test:
1. Logout (clear token)
2. Try to access: http://localhost:3001/admin/users

**Expected**:
- ✅ Automatic redirect to login page

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" error
**Solution**: 
- Check backend is running on port 8000
- Check browser console for CORS errors
- Verify token exists in localStorage

### Issue: Empty data tables
**Solution**:
- Check database has data: `python backend/verify_db.py`
- Run seed scripts if needed: `python backend/seed_data.py`
- Verify PostgreSQL is running

### Issue: "Admin access required"
**Solution**:
- Verify user is admin: Check database `SELECT email, is_admin FROM users;`
- Re-run admin creation: `python backend/create_admin.py`

### Issue: 401 Unauthorized
**Solution**:
- Token expired → Login again
- Check token in localStorage: `localStorage.getItem('token')`

### Issue: Attribute errors in backend
**Solution**:
- Verify SQLAlchemy version: `pip show sqlalchemy` (should be 2.0.43+)
- Check model attributes match in `backend/app/models/models.py`

---

## 📋 Test Results Template

```
Date: __________
Tester: __________

[ ] Backend running on port 8000
[ ] Frontend running on port 3001
[ ] Admin login successful
[ ] Dashboard displays statistics
[ ] Users page shows all users
[ ] Can toggle admin status
[ ] Can toggle active status
[ ] Predictions page shows all predictions
[ ] Confidence bars display correctly
[ ] Feedback page shows all feedback
[ ] Summary stats calculate correctly
[ ] Non-admin cannot access admin pages
[ ] Unauthenticated users redirected to login

Notes:
_______________________________________
_______________________________________
_______________________________________
```

---

## ✅ Success Indicators

If all tests pass, you should see:
1. ✅ No console errors in browser
2. ✅ All data loads without "Failed to fetch"
3. ✅ Admin actions work (toggle admin/active)
4. ✅ Security restrictions enforced
5. ✅ All pages navigate correctly
6. ✅ Statistics calculate accurately

**Testing Complete!** 🎉
