# 🚀 Postman Setup - Step by Step Guide

## Step 1: Download & Install Postman
1. Go to https://www.postman.com/downloads/
2. Download for your OS (Windows, Mac, Linux)
3. Install and open Postman

---

## Step 2: Import Collection

### Method A: Import JSON File (Recommended)
1. Click **File** → **Import**
2. Select **EthioTravel_Complete_API.postman_collection.json**
3. Click **Import**

### Method B: Import from Link
1. Click **File** → **Import**
2. Paste this URL: (if hosted)
3. Click **Import**

---

## Step 3: Create Environments

### Create Local Environment
1. Click **Environments** (left sidebar)
2. Click **Create New**
3. Name: `EthioTravel Local`
4. Add variables:
   ```
   base_url: http://localhost:5001
   token: (leave empty)
   ```
5. Click **Save**

### Create Production Environment
1. Click **Create New**
2. Name: `EthioTravel Production`
3. Add variables:
   ```
   base_url: https://travel-planner-backend-f9gd.onrender.com
   token: (leave empty)
   ```
4. Click **Save**

---

## Step 4: Select Environment

1. Top right corner, click environment dropdown
2. Select **EthioTravel Local** (for local testing)
3. Or select **EthioTravel Production** (for production)

---

## Step 5: Test Login Endpoint

### First Request: Login
1. Go to **Authentication** folder
2. Click **Login** request
3. Click **Send**
4. You should see response:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "user": {...},
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ```

### Token Auto-Save
The token is automatically saved to your environment variable `{{token}}` via the test script.

---

## Step 6: Test Protected Endpoints

### Get Current User
1. Go to **Authentication** folder
2. Click **Get Current User**
3. Click **Send**
4. You should see your user profile

---

## Step 7: Test Other Endpoints

### Get All Destinations
1. Go to **Destinations** folder
2. Click **Get All Destinations**
3. Click **Send**

### Create Trip
1. Go to **Trips** folder
2. Click **Create Trip**
3. Modify body if needed
4. Click **Send**

---

## 📋 Quick Reference

### Test Users (for quick login)

**Admin:**
```
Username: ashu
Password: Ashu19951?
```

**Agent:**
```
Username: agent_jane
Password: Ashu19951?
```

**User:**
```
Username: traveler_bob
Password: Ashu19951?
```

---

## 🔧 Troubleshooting

### Issue: "Cannot GET /api/login"
**Solution:** 
- Make sure backend is running: `npm start` in backend folder
- Check base_url is correct: `http://localhost:5001`

### Issue: "Invalid API key"
**Solution:**
- This is expected if Supabase is not configured
- Use test users for quick testing
- Register new users will work with fallback

### Issue: "Unauthorized"
**Solution:**
- Make sure you logged in first
- Token should be auto-saved in environment
- Check Authorization header has "Bearer {{token}}"

### Issue: "Token not found"
**Solution:**
- Run Login request first
- Check Tests tab shows token was saved
- Refresh environment variables

---

## 📊 Common Workflows

### Workflow 1: Admin Testing
1. Login as admin (ashu)
2. Get all users
3. Update user status
4. Approve agent requests
5. View all trips

### Workflow 2: User Testing
1. Register new user
2. Login with new credentials
3. Create trip
4. View my trips
5. Update profile

### Workflow 3: Agent Testing
1. Register as agent
2. Wait for admin approval
3. Login as agent
4. View travel requests
5. Update profile

---

## 🌐 Environment Variables

### Local
```
base_url: http://localhost:5001
token: (auto-filled after login)
```

### Production
```
base_url: https://travel-planner-backend-f9gd.onrender.com
token: (auto-filled after login)
```

---

## 📝 Tips & Tricks

### Tip 1: Save Responses
- Right-click response → **Save as Example**
- Useful for documentation

### Tip 2: Use Pre-request Scripts
- Add custom logic before sending request
- Example: Generate timestamps

### Tip 3: Use Tests
- Validate responses automatically
- Check status codes, response times
- Auto-save tokens

### Tip 4: Collections Organization
- Group related endpoints
- Use folders for better organization
- Add descriptions to requests

### Tip 5: Export Results
- Click **...** → **Export**
- Share test results with team

---

## 🔐 Security Notes

- Never commit tokens to git
- Use environment variables for sensitive data
- Rotate tokens regularly
- Use HTTPS for production

---

## 📞 Support

If you encounter issues:
1. Check backend is running
2. Verify environment variables
3. Check network connectivity
4. Review error messages in response

---

**Happy Testing! 🎉**
