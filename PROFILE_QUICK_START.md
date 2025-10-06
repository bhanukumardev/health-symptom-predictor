# 🚀 QUICK START - Profile Edit Feature

## ✅ What's New
Users can now **edit their profile** (age, gender, weight) and changes are **saved to database**!

---

## 🏃 Start in 3 Steps

### Step 1: Start Backend
```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
**Wait for:** `Application startup complete`

---

### Step 2: Start Frontend
```powershell
cd frontend
npm run dev
```
**Wait for:** `Local: http://localhost:3002`

---

### Step 3: Test Profile Feature
Open: http://localhost:3002

---

## 🧪 Quick Test (2 minutes)

### Test 1: View Profile
1. **Login** (or register)
2. **Click** 👤 **Profile** in navigation
3. **See** your current information displayed

---

### Test 2: Edit Profile
1. **Click** "Edit Profile" button (✏️)
2. **Change** your age, gender, or weight
3. **Click** "Save Changes" (💾)
4. **See** success message: "✅ Profile updated successfully!"

---

### Test 3: Verify Changes
1. **Go to Predict** page
2. **Make a prediction**
3. **Check medicine recommendations**
4. **Verify** dosage is personalized based on your new info!

---

## 📍 Where to Find It

**Navigation Menu:**
```
Home | Predict | Chat | History | 👤 Profile | Sign Out
                                    ^^^^^^^^
                                     HERE!
```

**Profile Button:**
- Shows as: **👤 Profile**
- Only visible when logged in
- Located between "History" and "Sign Out"

---

## 🎨 What You'll See

### View Mode (Default):
```
╔═══════════════════════════════════════╗
║ 👤 My Profile      [Edit Profile] ✏️ ║
║                                       ║
║ 📧 Account Information                ║
║ Email: user@example.com (locked)     ║
║ Full Name: John Doe                  ║
║                                       ║
║ 🏥 Health Information                 ║
║ Age: 42 years                        ║
║ Gender: Male                         ║
║ Weight: 70 kg                        ║
╚═══════════════════════════════════════╝
```

### Edit Mode:
```
╔═══════════════════════════════════════╗
║ 👤 My Profile         [Cancel] ❌    ║
║                                       ║
║ [Editable white input fields]        ║
║                                       ║
║       [💾 Save Changes]              ║
╚═══════════════════════════════════════╝
```

---

## ✨ Key Features

### ✅ Editable Fields:
- **Full Name** - Your display name
- **Age** - Years (affects dosage)
- **Gender** - Male/Female/Other (affects warnings)
- **Weight** - In kg (affects dosage calculations)

### 🔒 Protected Field:
- **Email** - Cannot be changed (security)

### 🌍 Bilingual:
- **English** - All fields and messages
- **Hindi** - Complete translation available

### 💾 Auto-Save:
- Changes saved to database immediately
- Used in all future predictions
- Persists across sessions

---

## 🎯 Impact on Predictions

### Before Profile Update:
```
Medicine: Take paracetamol as needed
```

### After Profile Update (Age: 42, Weight: 70kg):
```
Medicine: Paracetamol 500mg
Dosage: 1 full tablet, 3 times daily
Duration: For 5 days
Instructions: After meals with water
```

**Your updated info is automatically used for:**
- ✅ Personalized medicine dosage
- ✅ Age-appropriate recommendations
- ✅ Gender-specific warnings
- ✅ Weight-based calculations

---

## 🔧 Test Backend API Directly

```bash
# Get profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/user/profile

# Update profile
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"age": 42, "gender": "M", "weight": 70.5}' \
  http://localhost:8000/api/user/profile
```

---

## 🧪 Run Automated Test

```powershell
cd backend
python test_profile_feature.py
```

**Tests:**
- ✓ Login
- ✓ GET profile
- ✓ PUT profile (update)
- ✓ Database persistence
- ✓ Input validation

---

## 📊 What Gets Validated

### Age:
- ✅ Allowed: 0-150 years
- ❌ Rejected: Negative, > 150

### Gender:
- ✅ Allowed: M (Male), F (Female), O (Other)
- ❌ Rejected: Any other value

### Weight:
- ✅ Allowed: 0.1-500 kg
- ❌ Rejected: 0, negative, > 500

---

## 🌐 Hindi Mode

**Switch to Hindi** (हिन्दी button) and see:
```
👤 मेरी प्रोफ़ाइल
✏️ प्रोफ़ाइल संपादित करें
💾 परिवर्तन सहेजें
✅ प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!
```

---

## 🎉 Success Checklist

After testing, confirm:
- [ ] Profile link visible in navigation (👤)
- [ ] Can view current profile info
- [ ] "Edit Profile" button works
- [ ] Can modify age, gender, weight
- [ ] "Save Changes" shows loading spinner
- [ ] Success message appears (green)
- [ ] Changes persist after page reload
- [ ] Medicine recommendations use new info
- [ ] Hindi mode works correctly
- [ ] Cancel button discards changes

---

## 🐛 Troubleshooting

### Profile link not showing:
- Make sure you're logged in
- Link only appears for authenticated users

### Can't save changes:
- Check backend is running (port 8000)
- Check browser console for errors (F12)
- Verify token is valid

### Changes not persisting:
- Check database connection
- Verify backend logs for errors
- Try logout and login again

---

## 📁 New Files Created

**Backend:**
- `backend/app/api/profile.py` - Profile API endpoints

**Frontend:**
- `frontend/src/pages/Profile.tsx` - Profile page component

**Tests:**
- `backend/test_profile_feature.py` - Automated test script

**Documentation:**
- `PROFILE_EDIT_FEATURE_COMPLETE.md` - Full documentation

---

## 🎯 Quick Demo Flow

1. **Start servers** (backend + frontend)
2. **Login** to app
3. **Click** 👤 Profile
4. **Click** Edit Profile
5. **Change** age to 8, weight to 25
6. **Save** changes
7. **Go to** Predict page
8. **Make** prediction for Common Cold
9. **See** child dosage (250mg instead of 500mg)!

---

## 💡 Why This Matters

**Before:** Fixed recommendations, no personalization  
**After:** Age/gender/weight-specific dosage & warnings

**Example:**
- **Child (8 years, 25kg):** Paracetamol 250mg, half tablet
- **Adult (42 years, 70kg):** Paracetamol 500mg, full tablet
- **Female:** Includes pregnancy warnings
- **Elderly (65+ years):** "Consult doctor" advice

---

## 🚀 Ready to Use!

**Everything is implemented and tested!**

Just:
1. Start both servers
2. Login
3. Click 👤 Profile
4. Edit and save!

**Your personalized healthcare experience starts now! 🎉💊**

---

## 📞 Need Help?

**Full Documentation:** `PROFILE_EDIT_FEATURE_COMPLETE.md`  
**Test Script:** `backend/test_profile_feature.py`  
**API Docs:** http://localhost:8000/docs (when backend running)

**Everything works perfectly - just test it! 💪**
