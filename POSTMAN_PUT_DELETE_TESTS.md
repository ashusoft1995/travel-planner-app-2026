# 🧪 Postman PUT & DELETE API Tests - 10 Essential Tests

## 🌐 Base URLs
- **Local**: `http://localhost:5001`
- **Render**: `https://travel-planner-backend-f9gd.onrender.com`

---

## 🔑 Authentication Setup

### Step 1: Get JWT Token
```
POST {{base_url}}/api/login
Content-Type: application/json

{
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```
**Copy the token from response.data.token**

### Step 2: Set Environment Variables in Postman
- `local_url`: `http://localhost:5001`
- `render_url`: `https://travel-planner-backend-f9gd.onrender.com`
- `token`: `YOUR_JWT_TOKEN_HERE`

---

## 🧪 10 POSTMAN TEST CASES

### 1️⃣ **PUT - Update User Profile (Own)**
```
PUT {{base_url}}/api/me
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Updated Profile Name",
  "phone": "+251911777888",
  "about": "Updated profile description for testing"
}
```
**Expected**: 200 OK with updated user data

---

### 2️⃣ **PUT - Update User (Admin Only)**
```
PUT {{base_url}}/api/users/1201
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Updated Agent Name",
  "role": "agent",
  "status": "active",
  "phone": "+251911999888"
}
```
**Expected**: 200 OK with updated user data
**Note**: Use admin token (ashu)

---

### 3️⃣ **PUT - Update Destination (Admin Only)**
```
PUT {{base_url}}/api/destinations/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Updated Lalibela",
  "description": "Updated description with new attractions and facilities",
  "price": "45,000 ETB",
  "rating": 4.9,
  "travel_volume_index": 90
}
```
**Expected**: 200 OK with updated destination
**Note**: Use admin token

---

### 4️⃣ **PUT - Update Trip**
```
PUT {{base_url}}/api/trips/{{trip_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "destination": "Updated Gondar",
  "startDate": "2026-08-15",
  "endDate": "2026-08-25",
  "budget": 55000,
  "accommodation": "Luxury Heritage Hotel",
  "notes": "Updated preferences for luxury experience"
}
```
**Expected**: 200 OK with updated trip
**Note**: Replace {{trip_id}} with actual trip ID

---

### 5️⃣ **PUT - Update Travel Request (Admin Only)**
```
PUT {{base_url}}/api/travel-requests/{{request_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "reviewed",
  "admin_notes": "Customer contacted. Tour package prepared for requested destination.",
  "assigned_agent": "agent_jane"
}
```
**Expected**: 200 OK with updated request
**Note**: Use admin token, replace {{request_id}}

---

### 6️⃣ **DELETE - Delete User (Admin Only)**
```
DELETE {{base_url}}/api/users/1202
Authorization: Bearer {{token}}
```
**Expected**: 200 OK with success message
**Note**: Use admin token, creates test user first if needed

---

### 7️⃣ **DELETE - Delete Trip**
```
DELETE {{base_url}}/api/trips/{{trip_id}}
Authorization: Bearer {{token}}
```
**Expected**: 200 OK with success message
**Note**: Users can delete own trips, admins can delete any

---

### 8️⃣ **DELETE - Delete Destination (Admin Only)**
```
DELETE {{base_url}}/api/destinations/5
Authorization: Bearer {{token}}
```
**Expected**: 200 OK with success message
**Note**: Use admin token

---

### 9️⃣ **DELETE - Delete Travel Request (Admin Only)**
```
DELETE {{base_url}}/api/travel-requests/{{request_id}}
Authorization: Bearer {{token}}
```
**Expected**: 200 OK with success message
**Note**: Use admin token

---

### 🔟 **DELETE - Delete My Account**
```
DELETE {{base_url}}/api/me
Authorization: Bearer {{token}}
```
**Expected**: 200 OK with success message
**Warning**: This permanently deletes the account

---

## 📋 POSTMAN COLLECTION SETUP

### Environment Variables
Create two environments in Postman:

#### **Local Environment**
```json
{
  "base_url": "http://localhost:5001",
  "token": ""
}
```

#### **Render Environment**
```json
{
  "base_url": "https://travel-planner-backend-f9gd.onrender.com",
  "token": ""
}
```

### Pre-request Script (Collection Level)
```javascript
// Auto-set authorization header
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("token")
    });
}
```

### Test Script for Login Request
```javascript
// Save token from login response
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("token", response.data.token);
        console.log("Token saved:", response.data.token);
    }
}
```

---

## 🔄 TESTING WORKFLOW

### Step 1: Setup
1. Import collection into Postman
2. Create Local and Render environments
3. Set base_url for each environment

### Step 2: Authentication
1. Run login request with admin credentials
2. Token will be automatically saved
3. All subsequent requests will use the token

### Step 3: Test Sequence
1. **Login** → Get token
2. **GET requests** → Get IDs for testing
3. **PUT requests** → Update resources
4. **DELETE requests** → Remove resources

### Step 4: Switch Environments
- Test on **Local** first: `http://localhost:5001`
- Then test on **Render**: `https://travel-planner-backend-f9gd.onrender.com`

---

## 🔐 TEST CREDENTIALS

### Admin (Full Access)
```json
{
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```

### Agent (Limited Access)
```json
{
  "identifier": "agent_jane", 
  "password": "Ashu19951?"
}
```

### User (Own Resources Only)
```json
{
  "identifier": "traveler_bob",
  "password": "Ashu19951?"
}
```

---

## 📊 EXPECTED RESPONSES

### Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Updated/deleted resource data
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 🚨 IMPORTANT NOTES

### For PUT Operations:
- ✅ Always include `Content-Type: application/json`
- ✅ Use proper authorization token
- ✅ Include required fields in request body
- ✅ Admin token required for admin-only endpoints

### For DELETE Operations:
- ⚠️ **WARNING**: DELETE operations are permanent
- ⚠️ Test with non-critical data first
- ⚠️ Admin permissions required for most deletions
- ⚠️ Some deletions may cascade (user → trips)

### Testing Tips:
1. **Always test locally first** before production
2. **Get real IDs** from GET requests before PUT/DELETE
3. **Use different tokens** to test permission levels
4. **Backup important data** before DELETE operations

---

## 🎯 QUICK TEST CHECKLIST

- [ ] Login with admin credentials
- [ ] Token automatically saved
- [ ] PUT /api/me (update own profile)
- [ ] PUT /api/users/ID (admin update user)
- [ ] PUT /api/destinations/ID (admin update destination)
- [ ] PUT /api/trips/ID (update trip)
- [ ] DELETE /api/users/ID (admin delete user)
- [ ] DELETE /api/trips/ID (delete trip)
- [ ] DELETE /api/destinations/ID (admin delete destination)
- [ ] Test on both Local and Render environments

**All 10 tests ready for Postman! 🚀**