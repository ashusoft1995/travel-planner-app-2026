# EthioTravel API - Complete Postman Guide

## 🌐 Base URLs

### Local Development
```
http://localhost:5001
```

### Production (Render)
```
https://travel-planner-backend-f9gd.onrender.com
```

---

## 📋 Quick Setup in Postman

### Step 1: Create Environment Variables
1. Click **Environments** → **Create New**
2. Name it: `EthioTravel Local`
3. Add variables:
   ```
   base_url: http://localhost:5001
   token: (leave empty, will be filled after login)
   ```

4. Create another environment: `EthioTravel Production`
5. Add variables:
   ```
   base_url: https://travel-planner-backend-f9gd.onrender.com
   token: (leave empty, will be filled after login)
   ```

### Step 2: Set Authorization
For authenticated endpoints, go to **Authorization** tab:
- Type: **Bearer Token**
- Token: `{{token}}`

---

## 🔐 Authentication Endpoints

### 1. Login (Fast - Test User)
**Endpoint:** `POST {{base_url}}/api/login`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "1200",
      "username": "ashu",
      "email": "ashenafiabebe604@gmail.com",
      "name": "Ashenafi Abebe",
      "role": "admin",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Postman Script (Tests tab):**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
    pm.test("Login successful", function() {
        pm.expect(jsonData.success).to.be.true;
    });
}
```

---

### 2. Register New User
**Endpoint:** `POST {{base_url}}/api/users`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "role": "user",
  "phone": "+251911234567",
  "about": "Travel enthusiast"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "user_id_123",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Register as Travel Agent
**Endpoint:** `POST {{base_url}}/api/users`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "name": "Jane Travel Expert",
  "email": "jane@example.com",
  "username": "jane_agent",
  "password": "SecurePass123!",
  "role": "agent",
  "phone": "+251911234567",
  "expertise": ["Addis Ababa", "Lalibela", "Simien Mountains"],
  "about": "Professional travel guide with 10 years experience",
  "legal_paper_photo": "https://example.com/permit.jpg",
  "national_id_photo": "https://example.com/id.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account request sent to admin. Please wait for approval."
}
```

---

### 4. Get Current User Profile
**Endpoint:** `GET {{base_url}}/api/me`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1200",
    "email": "ashenafiabebe604@gmail.com",
    "name": "Ashenafi Abebe",
    "role": "admin",
    "status": "active",
    "username": "ashu",
    "phone": "+251911000000",
    "about": "System Administrator",
    "expertise": null
  }
}
```

---

### 5. Update User Profile
**Endpoint:** `PUT {{base_url}}/api/me`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (Raw JSON):**
```json
{
  "name": "Updated Name",
  "phone": "+251922345678",
  "about": "Updated bio"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1200",
    "email": "ashenafiabebe604@gmail.com",
    "name": "Updated Name",
    "role": "admin",
    "status": "active",
    "username": "ashu",
    "phone": "+251922345678",
    "about": "Updated bio",
    "expertise": null
  }
}
```

---

### 6. Delete Account
**Endpoint:** `DELETE {{base_url}}/api/me`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 👥 User Management (Admin Only)

### 7. Get All Users
**Endpoint:** `GET {{base_url}}/api/users`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1200",
      "username": "ashu",
      "email": "ashenafiabebe604@gmail.com",
      "name": "Ashenafi Abebe",
      "role": "admin",
      "status": "active",
      "phone": "+251911000000",
      "about": "System Administrator"
    }
  ]
}
```

---

### 8. Get Specific User
**Endpoint:** `GET {{base_url}}/api/users/:id`

**Example:** `GET {{base_url}}/api/users/1200`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1200",
    "username": "ashu",
    "email": "ashenafiabebe604@gmail.com",
    "name": "Ashenafi Abebe",
    "role": "admin",
    "status": "active"
  }
}
```

---

### 9. Update User (Admin)
**Endpoint:** `PUT {{base_url}}/api/users/:id`

**Example:** `PUT {{base_url}}/api/users/1201`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (Raw JSON):**
```json
{
  "name": "Updated Agent Name",
  "status": "active",
  "role": "agent",
  "rating": 4.8
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1201",
    "username": "agent_jane",
    "email": "jane@ethiotravel.com",
    "name": "Updated Agent Name",
    "role": "agent",
    "status": "active",
    "rating": 4.8
  }
}
```

---

### 10. Approve/Reject Agent (Admin)
**Endpoint:** `PATCH {{base_url}}/api/users/:id`

**Example:** `PATCH {{base_url}}/api/users/1201`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (Raw JSON):**
```json
{
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1201",
    "status": "active"
  }
}
```

---

### 11. Delete User (Admin)
**Endpoint:** `DELETE {{base_url}}/api/users/:id`

**Example:** `DELETE {{base_url}}/api/users/1203`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted"
}
```

---

## 🏖️ Destinations API

### 12. Get All Destinations
**Endpoint:** `GET {{base_url}}/api/destinations`

**Headers:**
```
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Lalibela",
      "description": "Famous for its rock-hewn churches",
      "country": "Ethiopia",
      "region": "Amhara",
      "price": "35,000 ETB",
      "rating": 4.8,
      "image": "https://images.unsplash.com/...",
      "travel_volume_index": 95
    }
  ]
}
```

---

### 13. Create Destination (Admin)
**Endpoint:** `POST {{base_url}}/api/destinations`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (Raw JSON):**
```json
{
  "name": "Danakil Depression",
  "description": "One of the hottest places on Earth",
  "country": "Ethiopia",
  "region": "Afar",
  "price": "45,000 ETB",
  "rating": 4.6,
  "image": "https://images.unsplash.com/...",
  "travel_volume_index": 75,
  "best_months": ["October", "November", "December"],
  "avg_temp_dry": 45,
  "distance_km": 600,
  "lat": 13.1939,
  "lng": 40.3006
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Danakil Depression",
    "description": "One of the hottest places on Earth",
    "country": "Ethiopia",
    "region": "Afar",
    "price": "45,000 ETB",
    "rating": 4.6,
    "travel_volume_index": 75
  }
}
```

---

### 14. Update Destination (Admin)
**Endpoint:** `PUT {{base_url}}/api/destinations/:id`

**Example:** `PUT {{base_url}}/api/destinations/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (Raw JSON):**
```json
{
  "price": "40,000 ETB",
  "rating": 4.9
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Lalibela",
    "price": "40,000 ETB",
    "rating": 4.9
  }
}
```

---

### 15. Delete Destination (Admin)
**Endpoint:** `DELETE {{base_url}}/api/destinations/:id`

**Example:** `DELETE {{base_url}}/api/destinations/5`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true
}
```

---

## ✈️ Trips API

### 16. Get All Trips
**Endpoint:** `GET {{base_url}}/api/trips`

**Headers:**
```
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "owner_email": "john@example.com",
      "destination": "Lalibela",
      "start_date": "2026-06-01",
      "end_date": "2026-06-07",
      "budget": 50000,
      "activities": ["Church visits", "Photography"],
      "accommodation": "Hotel",
      "approval_status": "approved"
    }
  ]
}
```

---

### 17. Get Specific Trip
**Endpoint:** `GET {{base_url}}/api/trips/:id`

**Example:** `GET {{base_url}}/api/trips/1`

**Headers:**
```
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "owner_email": "john@example.com",
    "destination": "Lalibela",
    "start_date": "2026-06-01",
    "end_date": "2026-06-07",
    "budget": 50000,
    "activities": ["Church visits", "Photography"],
    "accommodation": "Hotel",
    "approval_status": "approved"
  }
}
```

---

### 18. Create Trip
**Endpoint:** `POST {{base_url}}/api/trips`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (Raw JSON):**
```json
{
  "destination": "Simien Mountains",
  "startDate": "2026-07-01",
  "endDate": "2026-07-10",
  "budget": 75000,
  "activities": ["Hiking", "Wildlife viewing", "Photography"],
  "accommodation": "Mountain lodge",
  "notes": "Looking for experienced guide",
  "costBreakdown": {
    "accommodation": 30000,
    "food": 20000,
    "transport": 15000,
    "activities": 10000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "owner_email": "john@example.com",
    "destination": "Simien Mountains",
    "start_date": "2026-07-01",
    "end_date": "2026-07-10",
    "budget": 75000,
    "approval_status": "pending"
  }
}
```

---

### 19. Update Trip
**Endpoint:** `PUT {{base_url}}/api/trips/:id`

**Example:** `PUT {{base_url}}/api/trips/2`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (Raw JSON):**
```json
{
  "budget": 80000,
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "budget": 80000,
    "notes": "Updated notes"
  }
}
```

---

### 20. Approve/Reject Trip (Admin)
**Endpoint:** `PATCH {{base_url}}/api/trips/:id/approval`

**Example:** `PATCH {{base_url}}/api/trips/2/approval`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

**Body (Raw JSON):**
```json
{
  "approval_status": "approved",
  "notes": "Approved by admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "approval_status": "approved",
    "notes": "Approved by admin"
  }
}
```

---

### 21. Delete Trip
**Endpoint:** `DELETE {{base_url}}/api/trips/:id`

**Example:** `DELETE {{base_url}}/api/trips/2`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "message": "Trip deleted"
}
```

---

## 📝 Travel Requests API

### 22. Get All Travel Requests (Admin)
**Endpoint:** `GET {{base_url}}/api/travel-requests`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "full_name": "Ahmed Hassan",
      "email": "ahmed@example.com",
      "phone": "+251911234567",
      "nationality": "Ethiopian",
      "age": 35,
      "gender": "Male",
      "desired_destination": "Lalibela",
      "preferred_start_date": "2026-06-01",
      "preferred_end_date": "2026-06-07",
      "budget_hint": "50000-100000 ETB",
      "accommodation_preference": "Hotel",
      "special_requests": "Vegetarian meals"
    }
  ]
}
```

---

### 23. Submit Travel Request
**Endpoint:** `POST {{base_url}}/api/travel-requests`

**Headers:**
```
Content-Type: application/json
```

**Body (Raw JSON):**
```json
{
  "fullName": "Ahmed Hassan",
  "email": "ahmed@example.com",
  "phone": "+251911234567",
  "nationality": "Ethiopian",
  "age": 35,
  "gender": "Male",
  "desiredDestination": "Lalibela",
  "preferredStartDate": "2026-06-01",
  "preferredEndDate": "2026-06-07",
  "budgetHint": "50000-100000 ETB",
  "accommodationPreference": "Hotel",
  "specialRequests": "Vegetarian meals",
  "travelHistory": "First time to Ethiopia"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Travel request submitted successfully"
}
```

---

## 🔔 Health & Stats

### 24. Health Check
**Endpoint:** `GET {{base_url}}/api/health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-03T10:30:00.000Z"
}
```

---

### 25. Get Stats
**Endpoint:** `GET {{base_url}}/api/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "travelers": 150,
    "destinations": 25,
    "trips": 45
  }
}
```

---

## 🧪 Test Users for Quick Testing

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

## 📊 Postman Collection Import

### Option 1: Manual Setup
Follow the endpoints above and create requests manually.

### Option 2: Import JSON Collection
Create a new file `EthioTravel_API.postman_collection.json` with all endpoints.

---

## 🚀 Deployment URLs

### Local Testing
```
Base URL: http://localhost:5001
Frontend: http://localhost:3000
```

### Production (Render)
```
Base URL: https://travel-planner-backend-f9gd.onrender.com
Frontend: https://travel-planner-app-2026.vercel.app
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Invalid API key"
**Solution:** Use test users (ashu/Ashu19951?) for quick testing

### Issue: "Network Error"
**Solution:** Ensure backend is running on port 5001

### Issue: "Unauthorized"
**Solution:** Make sure token is set in Authorization header

### Issue: "Token expired"
**Solution:** Login again to get a new token

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Tokens expire in 7 days
- Admin endpoints require `role: "admin"`
- Agent endpoints require `role: "agent"`
- All responses follow the same format: `{ success, message, data }`

---

**Last Updated:** May 3, 2026
**API Version:** 1.0.0
