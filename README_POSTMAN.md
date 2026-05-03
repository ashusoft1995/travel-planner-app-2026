# 📮 EthioTravel API - Postman Complete Guide

## 📚 Documentation Files

This repository includes comprehensive Postman documentation:

1. **POSTMAN_API_GUIDE.md** - Complete API reference with all 25+ endpoints
2. **POSTMAN_SETUP_STEPS.md** - Step-by-step setup instructions
3. **API_QUICK_REFERENCE.md** - Quick reference card for developers
4. **EthioTravel_Complete_API.postman_collection.json** - Ready-to-import collection

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Download Postman
- Go to https://www.postman.com/downloads/
- Install for your OS

### Step 2: Import Collection
1. Open Postman
2. Click **File** → **Import**
3. Select `EthioTravel_Complete_API.postman_collection.json`
4. Click **Import**

### Step 3: Create Environment
1. Click **Environments** (left sidebar)
2. Click **Create New**
3. Name: `EthioTravel Local`
4. Add variables:
   ```
   base_url: http://localhost:5001
   token: (leave empty)
   ```
5. Click **Save**

### Step 4: Select Environment
- Top right corner → Select `EthioTravel Local`

### Step 5: Test Login
1. Go to **Authentication** → **Login**
2. Click **Send**
3. Token auto-saves to environment

✅ **Done! You're ready to test the API**

---

## 🌐 Environment URLs

### Local Development
```
Base URL: http://localhost:5001
Frontend: http://localhost:3000
```

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

### Production (Render)
```
Base URL: https://travel-planner-backend-f9gd.onrender.com
Frontend: https://travel-planner-app-2026.vercel.app
```

---

## 🧪 Test Users

Use these credentials for quick testing:

### Admin Account
```
Username: ashu
Email: ashenafiabebe604@gmail.com
Password: Ashu19951?
Role: Admin
```

### Travel Agent Account
```
Username: agent_jane
Email: jane@ethiotravel.com
Password: Ashu19951?
Role: Agent
```

### Regular User Account
```
Username: traveler_bob
Email: bob@gmail.com
Password: Ashu19951?
Role: User
```

---

## 📋 API Endpoints Overview

### 🔐 Authentication (6 endpoints)
- Login
- Register User
- Register Agent
- Get Current User
- Update Profile
- Delete Account

### 👥 User Management (5 endpoints)
- Get All Users
- Get User by ID
- Update User
- Approve/Reject Agent
- Delete User

### 🏖️ Destinations (4 endpoints)
- Get All Destinations
- Create Destination
- Update Destination
- Delete Destination

### ✈️ Trips (6 endpoints)
- Get All Trips
- Get Trip by ID
- Create Trip
- Update Trip
- Approve Trip
- Delete Trip

### 📝 Travel Requests (2 endpoints)
- Get All Travel Requests
- Submit Travel Request

### 🔔 Health & Stats (2 endpoints)
- Health Check
- Get Statistics

**Total: 25+ Endpoints**

---

## 🔑 Authentication Flow

### Step 1: Login
```
POST /api/login
Body: {
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```

### Step 2: Get Token
Response includes:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 3: Use Token
Add to Authorization header:
```
Authorization: Bearer {{token}}
```

### Step 4: Token Auto-Save
The Postman collection automatically saves the token to the environment variable `{{token}}` via test scripts.

---

## 📊 Common Workflows

### Workflow 1: Admin Testing
```
1. Login as admin (ashu)
   POST /api/login
   
2. View all users
   GET /api/users
   
3. Approve pending agent
   PATCH /api/users/:id
   Body: { "status": "active" }
   
4. View all travel requests
   GET /api/travel-requests
   
5. Approve trip
   PATCH /api/trips/:id/approval
   Body: { "approval_status": "approved" }
```

### Workflow 2: User Registration & Trip Creation
```
1. Register new user
   POST /api/users
   Body: { name, email, username, password, role: "user" }
   
2. Login with new credentials
   POST /api/login
   
3. Create trip
   POST /api/trips
   Body: { destination, startDate, endDate, budget, ... }
   
4. View my trips
   GET /api/trips
   
5. Update profile
   PUT /api/me
   Body: { name, phone, about }
```

### Workflow 3: Agent Registration & Approval
```
1. Register as agent
   POST /api/users
   Body: { name, email, username, password, role: "agent", ... }
   
2. Wait for admin approval
   (Admin approves via PATCH /api/users/:id)
   
3. Login as agent
   POST /api/login
   
4. View travel requests
   GET /api/travel-requests
   
5. Update profile
   PUT /api/me
```

---

## 🔧 Postman Features Used

### 1. Environment Variables
- `{{base_url}}` - API base URL
- `{{token}}` - Authentication token

### 2. Pre-request Scripts
- Automatically set headers
- Generate timestamps

### 3. Test Scripts
- Validate responses
- Auto-save tokens
- Check status codes

### 4. Collections Organization
- Grouped by feature
- Descriptive names
- Example requests

---

## 📝 Request Examples

### Example 1: Login
```
POST {{base_url}}/api/login
Content-Type: application/json

{
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```

### Example 2: Create Trip
```
POST {{base_url}}/api/trips
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "destination": "Lalibela",
  "startDate": "2026-06-01",
  "endDate": "2026-06-07",
  "budget": 50000,
  "activities": ["Church visits", "Photography"],
  "accommodation": "Hotel",
  "notes": "Looking for experienced guide"
}
```

### Example 3: Update User (Admin)
```
PUT {{base_url}}/api/users/1201
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Updated Name",
  "status": "active",
  "rating": 4.8
}
```

---

## ⚠️ Troubleshooting

### Issue: "Cannot GET /api/login"
**Cause:** Backend not running
**Solution:** 
```bash
cd backend
npm start
```

### Issue: "Invalid API key"
**Cause:** Supabase not configured
**Solution:** Use test users for quick testing

### Issue: "Unauthorized"
**Cause:** Missing or invalid token
**Solution:** 
1. Run login request first
2. Check token is saved in environment
3. Verify Authorization header format

### Issue: "Token not found"
**Cause:** Login request failed
**Solution:**
1. Check credentials are correct
2. Verify backend is running
3. Check network connectivity

### Issue: "CORS Error"
**Cause:** Frontend and backend on different origins
**Solution:** Backend CORS is configured for localhost:3000

---

## 🔐 Security Best Practices

1. **Never commit tokens** to git
2. **Use environment variables** for sensitive data
3. **Rotate tokens** regularly (expires in 7 days)
4. **Use HTTPS** for production
5. **Validate inputs** on both client and server
6. **Use Bearer tokens** in Authorization header

---

## 📊 Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🌐 Deployment

### Local Development
- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`

### Production (Render)
- Backend: `https://travel-planner-backend-f9gd.onrender.com`
- Frontend: `https://travel-planner-app-2026.vercel.app`

### Switch Environments in Postman
1. Top right corner
2. Select environment dropdown
3. Choose `EthioTravel Local` or `EthioTravel Production`

---

## 📚 Additional Resources

- **API Documentation**: `POSTMAN_API_GUIDE.md`
- **Setup Instructions**: `POSTMAN_SETUP_STEPS.md`
- **Quick Reference**: `API_QUICK_REFERENCE.md`
- **GitHub Repository**: https://github.com/ashusoft1995/travel-planner-app-2026

---

## 💡 Pro Tips

1. **Save Responses as Examples**
   - Right-click response → Save as Example
   - Useful for documentation

2. **Use Collections for Testing**
   - Run entire collection
   - Generate test reports

3. **Export Results**
   - Click **...** → **Export**
   - Share with team

4. **Use Variables**
   - Reduce repetition
   - Easy to switch environments

5. **Add Descriptions**
   - Document each request
   - Help team members

---

## 🎯 Next Steps

1. ✅ Import collection
2. ✅ Create environment
3. ✅ Test login endpoint
4. ✅ Explore other endpoints
5. ✅ Create your own requests
6. ✅ Share with team

---

## 📞 Support

If you encounter issues:

1. Check backend is running
2. Verify environment variables
3. Check network connectivity
4. Review error messages
5. Check documentation files

---

## 📝 Version History

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | May 3, 2026 | Initial release with 25+ endpoints |

---

**Happy Testing! 🚀**

For questions or issues, refer to the documentation files or check the GitHub repository.
