# Gemini Chatbot Troubleshooting Guide

## Current Status
The chatbot is showing an error: "Sorry, I encountered an error. Please try again."

## Debugging Steps

### 1. Check Browser Console
Open the browser developer tools (F12) and check the Console tab for detailed error messages. Look for:
- 🔑 API Key status messages
- 📤 Request sending logs
- ❌ Error details

### 2. Test API Key Directly
I've created a test page to verify your API key works:
- **URL**: `http://localhost:3000/test-gemini.html`
- Click "Test API" button
- Check if the API responds successfully

### 3. Common Issues & Solutions

#### Issue: API Key Not Found
**Symptoms**: Console shows "API Key present: false" or "API key is not configured"
**Solution**:
1. Verify `.env` file exists in `frontend/` directory
2. Check it contains: `VITE_GEMINI_API_KEY=AIzaSyBDKvY1G7VCiIWjqEQKx0lvKdHtXmoibvE`
3. Restart the frontend server: Kill and restart the "Frontend" job

#### Issue: Invalid API Key
**Symptoms**: Error 400 or "API key not valid"
**Solution**:
1. Verify the API key is correct
2. Check if the key has been restricted to specific IPs/domains
3. Ensure the key hasn't expired or been revoked
4. Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to verify

#### Issue: API Quota Exceeded
**Symptoms**: Error 429 or "Quota exceeded"
**Solution**:
1. Check your quota at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Wait for quota reset (usually daily)
3. Consider upgrading to a paid tier if needed

#### Issue: CORS Error
**Symptoms**: "CORS policy" or "blocked by CORS" in console
**Solution**:
- Gemini API should work from browser directly
- If issue persists, consider moving API calls to backend

#### Issue: Network Error
**Symptoms**: "Failed to fetch" or "Network error"
**Solution**:
1. Check internet connection
2. Verify no firewall blocking Google APIs
3. Try using a VPN if in restricted region

### 4. Enhanced Error Logging

The code has been updated with detailed logging:

```typescript
// In gemini.ts
console.log('🔑 API Key present:', !!apiKey);
console.log('🔑 API Key length:', apiKey?.length || 0);
console.log('📤 Sending request to Gemini API...');
console.log('📥 Received response from Gemini API');
console.log('✅ Response text length:', text.length);
console.error('❌ Gemini API Error:', error);
```

### 5. Test Commands

#### PowerShell - Restart Frontend
```powershell
# Stop frontend
Get-Job | Where-Object { $_.Name -eq "Frontend" } | Stop-Job
Get-Job | Where-Object { $_.Name -eq "Frontend" } | Remove-Job

# Start frontend
Start-Job -Name "Frontend" -ScriptBlock { 
    Set-Location "c:\Projects\AI Project\health-symptom-predictor\frontend"
    npm run dev 
}

# Check status
Start-Sleep -Seconds 5
Get-Job -Name "Frontend" | Receive-Job
```

#### Check Environment Variables
```powershell
# In frontend directory
Get-Content .env
```

### 6. Verify API Key

Visit the test page and click "Test API":
- **URL**: http://localhost:3000/test-gemini.html
- If test succeeds → Issue is with app integration
- If test fails → Issue is with API key or quota

### 7. Check Network Tab

1. Open Browser DevTools (F12)
2. Go to Network tab
3. Try sending a chat message
4. Look for request to `generativelanguage.googleapis.com`
5. Check the status code:
   - **200**: Success (shouldn't see error)
   - **400**: Bad request (check API key format)
   - **401**: Unauthorized (invalid API key)
   - **403**: Forbidden (API not enabled or quota)
   - **429**: Too many requests (quota exceeded)

### 8. Alternative: Use Backend Proxy

For production, it's better to call the API from backend:

1. Add endpoint in FastAPI backend:
```python
@app.post("/api/chat")
async def chat(message: str):
    # Call Gemini API from backend
    # Return response
```

2. Update frontend to call backend instead:
```typescript
const response = await fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput })
});
```

## Next Steps

1. ✅ Frontend restarted with enhanced logging
2. ✅ Error messages now show actual error details
3. ✅ Test page created for direct API testing
4. ⏳ **Try sending a message again** and check console logs
5. ⏳ If still failing, test the API key at http://localhost:3000/test-gemini.html

## Expected Console Output

When working correctly, you should see:
```
🔑 API Key present: true
🔑 API Key length: 39
📤 Sending request to Gemini API...
📥 Received response from Gemini API
✅ Response text length: 456
```

## Current Code Changes

1. **gemini.ts**: Added detailed logging and API key validation
2. **ChatBot.tsx**: Shows actual error message instead of generic message
3. **test-gemini.html**: Standalone test page for API verification

## Support Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [API Key Management](https://makersuite.google.com/app/apikey)
- [Gemini API Status](https://status.cloud.google.com/)
- [Pricing & Quotas](https://ai.google.dev/pricing)

---

**Refresh the page at http://localhost:3000/chat and try again!**
The enhanced error messages will now show exactly what's wrong.
