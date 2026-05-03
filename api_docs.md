# 🚀 EthioTravel API Documentation - Complete Testing Guide

## 🌐 Base URLs
- **Local Development**: `http://localhost:5001`
- **Production (Render)**: `https://travel-planner-backend-f9gd.onrender.com`

---

## 🔑 AUTHENTICATION

### 1. Login (Get JWT Token)
**Local URL**: `http://localhost:5001/api/login`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/login`  
**Method**: `POST`  
**Body** (JSON):
```json
{
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "user": { "id": "1200", "username": "ashu", "role": "admin" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Authorization Header (For Protected Endpoints)
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 👤 USER ENDPOINTS

### 1. Register New User
**Local URL**: `http://localhost:5001/api/users`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/users`  
**Method**: `POST`  
**Body** (JSON):
```json
{
  "username": "testuser123",
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

### 2. Get All Users (Admin Only)
**Local URL**: `http://localhost:5001/api/users`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/users`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 3. Get User by ID
**Local URL**: `http://localhost:5001/api/users/1200`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/users/1200`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 4. Update User (Admin Only)
**Local URL**: `http://localhost:5001/api/users/1201`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/users/1201`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "name": "Updated Name",
  "role": "agent",
  "status": "active"
}
```

### 5. Partial Update User (Admin Only)
**Local URL**: `http://localhost:5001/api/users/1201`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/users/1201`  
**Method**: `PATCH`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "status": "blocked"
}
```

### 6. Delete User (Admin Only)
**Local URL**: `http://localhost:5001/api/users/1202`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/users/1202`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 7. Get My Profile
**Local URL**: `http://localhost:5001/api/me`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/me`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 8. Update My Profile
**Local URL**: `http://localhost:5001/api/me`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/me`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "name": "My Updated Name",
  "phone": "+251911555444",
  "about": "Travel enthusiast from Ethiopia"
}
```

### 9. Delete My Account
**Local URL**: `http://localhost:5001/api/me`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/me`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 🏞️ DESTINATIONS ENDPOINTS

### 1. Get All Destinations
**Local URL**: `http://localhost:5001/api/destinations`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/destinations`  
**Method**: `GET`

### 2. Create Destination (Admin Only)
**Local URL**: `http://localhost:5001/api/destinations`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/destinations`  
**Method**: `POST`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "name": "Bale Mountains",
  "description": "Beautiful mountain wilderness with endemic wildlife",
  "country": "Ethiopia",
  "region": "Oromia",
  "price": "35,000 ETB",
  "rating": 4.7,
  "imageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "lat": 6.8333,
  "lng": 39.75,
  "travelVolumeIndex": 65,
  "hotels": {
    "Bale Mountain Lodge": {"rating": 4.4, "price": "$$"}
  },
  "activities": {
    "Wolf Tracking": {"price": "$120"},
    "Mountain Hiking": {"price": "$80"}
  }
}
```

### 3. Get Destination by ID
**Local URL**: `http://localhost:5001/api/destinations/1`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/destinations/1`  
**Method**: `GET`

### 4. Update Destination (Admin Only)
**Local URL**: `http://localhost:5001/api/destinations/1`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/destinations/1`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "name": "Updated Destination Name",
  "price": "40,000 ETB",
  "rating": 4.9,
  "travel_volume_index": 85,
  "description": "Updated description with new features",
  "best_months": ["October", "November", "December"],
  "avg_temp_dry": "25°C",
  "distance_km": 450
}
```

### 5. Delete Destination (Admin Only)
**Local URL**: `http://localhost:5001/api/destinations/1`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/destinations/1`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## ✈️ TRIPS ENDPOINTS

### 1. Get All Trips
**Local URL**: `http://localhost:5001/api/trips`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips`  
**Method**: `GET`

### 2. Get Trip by ID
**Local URL**: `http://localhost:5001/api/trips/TRIP_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips/TRIP_ID_HERE`  
**Method**: `GET`

### 3. Create Trip
**Local URL**: `http://localhost:5001/api/trips`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips`  
**Method**: `POST`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "destination": "Lalibela",
  "startDate": "2026-07-15",
  "endDate": "2026-07-22",
  "budget": 45000,
  "activities": ["Church Tour", "Cultural Experience", "Photography"],
  "accommodation": "Heritage Hotel",
  "notes": "Interested in historical sites and local culture",
  "costBreakdown": {
    "accommodation": 20000,
    "transport": 15000,
    "activities": 10000
  }
}
```

### 4. Update Trip
**Local URL**: `http://localhost:5001/api/trips/TRIP_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips/TRIP_ID_HERE`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "destination": "Gondar",
  "budget": 50000,
  "accommodation": "Luxury Resort",
  "notes": "Updated preferences for luxury experience"
}
```

### 5. Approve/Reject Trip (Admin Only)
**Local URL**: `http://localhost:5001/api/trips/TRIP_ID_HERE/approval`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips/TRIP_ID_HERE/approval`  
**Method**: `PATCH`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "approval_status": "approved",
  "notes": "Trip approved with recommended itinerary. Agent assigned."
}
```

### 6. Delete Trip
**Local URL**: `http://localhost:5001/api/trips/TRIP_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips/TRIP_ID_HERE`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 📋 TRAVEL REQUESTS ENDPOINTS

### 1. Get All Travel Requests (Admin Only)
**Local URL**: `http://localhost:5001/api/travel-requests`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/travel-requests`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 2. Submit Travel Request
**Local URL**: `http://localhost:5001/api/travel-requests`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/travel-requests`  
**Method**: `POST`  
**Body** (JSON):
```json
{
  "fullName": "John Traveler",
  "email": "john@example.com",
  "phone": "+251911123456",
  "nationality": "American",
  "age": 35,
  "gender": "Male",
  "desiredDestination": "Danakil Depression",
  "preferredStartDate": "2026-08-01",
  "preferredEndDate": "2026-08-10",
  "budgetHint": "50,000 - 80,000 ETB",
  "accommodationPreference": "Mid-range",
  "specialRequests": "Photography focused tour with professional guide",
  "travelHistory": "Visited Kenya, Tanzania, Morocco"
}
```

### 3. Update Travel Request (Admin Only)
**Local URL**: `http://localhost:5001/api/travel-requests/REQUEST_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/REQUEST_ID_HERE`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "status": "reviewed",
  "admin_notes": "Contacted customer, tour arranged for August dates"
}
```

### 4. Update Travel Request Status (Admin Only)
**Local URL**: `http://localhost:5001/api/travel-requests/REQUEST_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/REQUEST_ID_HERE`  
**Method**: `PATCH`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "status": "completed"
}
```

### 5. Delete Travel Request (Admin Only)
**Local URL**: `http://localhost:5001/api/travel-requests/REQUEST_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/REQUEST_ID_HERE`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 💬 CONTACT MESSAGES ENDPOINTS

### 1. Get All Contact Messages (Admin Only)
**Local URL**: `http://localhost:5001/api/contact-messages`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/contact-messages`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 2. Submit Contact Message
**Local URL**: `http://localhost:5001/api/contact-messages`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/contact-messages`  
**Method**: `POST`  
**Body** (JSON):
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "subject": "Booking Inquiry",
  "message": "I need help with my booking for Lalibela tour. Can you provide more details about the itinerary?",
  "adminTarget": "support"
}
```

### 3. Update Contact Message (Admin Only)
**Local URL**: `http://localhost:5001/api/contact-messages/MESSAGE_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/contact-messages/MESSAGE_ID_HERE`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "status": "in_progress",
  "admin_notes": "Customer contacted, working on resolution"
}
```

### 4. Reply to Contact Message (Admin Only)
**Local URL**: `http://localhost:5001/api/contact-messages/MESSAGE_ID_HERE/reply`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/contact-messages/MESSAGE_ID_HERE/reply`  
**Method**: `POST`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "replyText": "Thank you for your inquiry. We will contact you within 24 hours with detailed itinerary and pricing information."
}
```

### 5. Delete Contact Message (Admin Only)
**Local URL**: `http://localhost:5001/api/contact-messages/MESSAGE_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/contact-messages/MESSAGE_ID_HERE`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 🔔 NOTIFICATIONS ENDPOINTS

### 1. Get My Notifications
**Local URL**: `http://localhost:5001/api/notifications`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/notifications`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 2. Get Notifications with Filter
**Local URL**: `http://localhost:5001/api/notifications?audience=admin`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/notifications?audience=admin`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 3. Create Notification (Admin Only)
**Local URL**: `http://localhost:5001/api/notifications`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/notifications`  
**Method**: `POST`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "userEmail": "user@example.com",
  "message": "Your trip to Lalibela has been approved and agent assigned",
  "audience": "user",
  "type": "trip_approval",
  "targetId": "trip-123"
}
```

### 4. Update Notification (Admin Only)
**Local URL**: `http://localhost:5001/api/notifications/NOTIFICATION_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/notifications/NOTIFICATION_ID_HERE`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "message": "Updated notification message",
  "type": "urgent",
  "audience": "all"
}
```

### 5. Mark Notification as Read
**Local URL**: `http://localhost:5001/api/notifications/NOTIFICATION_ID_HERE/read`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/notifications/NOTIFICATION_ID_HERE/read`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 6. Delete Notification (Admin Only)
**Local URL**: `http://localhost:5001/api/notifications/NOTIFICATION_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/notifications/NOTIFICATION_ID_HERE`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 📢 ANNOUNCEMENTS ENDPOINTS

### 1. Get All Announcements
**Local URL**: `http://localhost:5001/api/announcements`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/announcements`  
**Method**: `GET`

### 2. Create Announcement (Admin Only)
**Local URL**: `http://localhost:5001/api/announcements`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/announcements`  
**Method**: `POST`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "title": "New Destination Added",
  "body": "We're excited to announce tours to the Bale Mountains National Park with wildlife viewing and mountain trekking experiences.",
  "type": "info",
  "image_url": "https://images.unsplash.com/photo-1519681393784-d120267933ba"
}
```

### 3. Update Announcement (Admin Only)
**Local URL**: `http://localhost:5001/api/announcements/ANNOUNCEMENT_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/announcements/ANNOUNCEMENT_ID_HERE`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "title": "Updated Announcement Title",
  "body": "Updated announcement content with new information.",
  "type": "warning",
  "is_active": true
}
```

### 4. Delete Announcement (Admin Only)
**Local URL**: `http://localhost:5001/api/announcements/ANNOUNCEMENT_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/announcements/ANNOUNCEMENT_ID_HERE`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 💬 INTERNAL MESSAGES ENDPOINTS

### 1. Get My Messages
**Local URL**: `http://localhost:5001/api/internal-messages`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/internal-messages`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 2. Send Internal Message
**Local URL**: `http://localhost:5001/api/internal-messages`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/internal-messages`  
**Method**: `POST`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`  
**Body** (JSON):
```json
{
  "receiverId": "1201",
  "body": "Please review the new trip request for Danakil Depression tour. Customer has specific photography requirements."
}
```

### 3. Update Internal Message (Mark as Read)
**Local URL**: `http://localhost:5001/api/internal-messages/MESSAGE_ID_HERE/read`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/internal-messages/MESSAGE_ID_HERE/read`  
**Method**: `PUT`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 4. Delete Internal Message
**Local URL**: `http://localhost:5001/api/internal-messages/MESSAGE_ID_HERE`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/internal-messages/MESSAGE_ID_HERE`  
**Method**: `DELETE`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

---

## 📊 ANALYTICS & UTILITY ENDPOINTS

### 1. Get Analytics Data (Admin Only)
**Local URL**: `http://localhost:5001/api/analytics`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/analytics`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 2. Get Activity Logs (Admin Only)
**Local URL**: `http://localhost:5001/api/activity-logs`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/activity-logs`  
**Method**: `GET`  
**Headers**: `Authorization: Bearer YOUR_TOKEN`

### 3. Health Check
**Local URL**: `http://localhost:5001/api/health`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/health`  
**Method**: `GET`

### 4. Get Statistics
**Local URL**: `http://localhost:5001/api/stats`  
**Production URL**: `https://travel-planner-backend-f9gd.onrender.com/api/stats`  
**Method**: `GET`

---

## 🔐 TEST CREDENTIALS

### Admin Account
- **Username**: `ashu`
- **Email**: `ashenafiabebe604@gmail.com`
- **Password**: `Ashu19951?`
- **Role**: Admin (Full access)

### Agent Account
- **Username**: `agent_jane`
- **Email**: `jane@ethiotravel.com`
- **Password**: `Ashu19951?`
- **Role**: Agent (Trip management)

### User Account 1
- **Username**: `traveler_bob`
- **Email**: `bob@gmail.com`
- **Password**: `Ashu19951?`
- **Role**: User (Regular traveler)

### User Account 2
- **Username**: `testuser`
- **Email**: `test@example.com`
- **Password**: `Ashu19951?`
- **Role**: User (Test account)

### 🔑 Login Methods
You can login using either:
1. **Username**: `traveler_bob` + Password: `Ashu19951?`
2. **Email**: `bob@gmail.com` + Password: `Ashu19951?`

**Note**: All accounts use the same password `Ashu19951?` for testing convenience.

---

## 📦 POSTMAN COLLECTION SETUP

### Quick Import Collection

Create a new Postman collection with these pre-configured requests:

#### Environment Variables
```json
{
  "local_url": "http://localhost:5001",
  "prod_url": "https://travel-planner-backend-f9gd.onrender.com",
  "token": "",
  "user_id": "",
  "trip_id": "",
  "destination_id": ""
}
```

#### Collection Structure
```
EthioTravel API/
├── 🔐 Authentication/
│   ├── Login (Admin)
│   ├── Login (Agent)  
│   ├── Login (User)
│   └── Get My Profile
├── 👤 Users/
│   ├── Get All Users
│   ├── Create User
│   ├── Get User by ID
│   ├── Update User
│   ├── Partial Update User
│   └── Delete User
├── 🏞️ Destinations/
│   ├── Get All Destinations
│   ├── Get Destination by ID
│   ├── Create Destination
│   ├── Update Destination
│   └── Delete Destination
├── ✈️ Trips/
│   ├── Get All Trips
│   ├── Get Trip by ID
│   ├── Create Trip
│   ├── Update Trip
│   ├── Approve Trip
│   └── Delete Trip
├── 📋 Travel Requests/
│   ├── Get All Requests
│   ├── Submit Request
│   ├── Update Request
│   ├── Update Request Status
│   └── Delete Request
├── 💬 Contact Messages/
│   ├── Get All Messages
│   ├── Submit Message
│   ├── Update Message
│   ├── Reply to Message
│   └── Delete Message
├── 🔔 Notifications/
│   ├── Get My Notifications
│   ├── Create Notification
│   ├── Update Notification
│   ├── Mark as Read
│   └── Delete Notification
├── 📢 Announcements/
│   ├── Get All Announcements
│   ├── Create Announcement
│   ├── Update Announcement
│   └── Delete Announcement
├── 💬 Internal Messages/
│   ├── Get My Messages
│   ├── Send Message
│   ├── Mark as Read
│   └── Delete Message
└── 📊 Analytics/
    ├── Get Analytics
    ├── Get Activity Logs
    ├── Health Check
    └── Get Statistics
```

### Pre-request Scripts

Add this to your collection's Pre-request Script tab:
```javascript
// Auto-set authorization header if token exists
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("token")
    });
}
```

### Test Scripts

Add this to your Login requests' Test tab:
```javascript
// Save token from login response
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("token", response.data.token);
        pm.environment.set("user_id", response.data.user.id);
        console.log("Token saved:", response.data.token);
    }
}
```

Add this to GET requests' Test tab:
```javascript
// Save IDs for future use
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data) {
        // For single item responses
        if (response.data.id) {
            pm.environment.set("last_id", response.data.id);
        }
        // For array responses - save first item's ID
        if (Array.isArray(response.data) && response.data.length > 0) {
            pm.environment.set("last_id", response.data[0].id);
        }
    }
}
```

---

## 🧪 POSTMAN TESTING WORKFLOW

### Step 1: Setup Environment
Create Postman environment with:
- `local_url`: `http://localhost:5001`
- `prod_url`: `https://travel-planner-backend-f9gd.onrender.com`
- `token`: (will be set after login)

### Step 2: Login and Get Token
1. **POST** `{{local_url}}/api/login` or `{{prod_url}}/api/login`
2. Use admin credentials from above
3. Copy token from response
4. Set as environment variable `token`

### Step 3: Test Authentication
1. **GET** `{{local_url}}/api/me` with `Authorization: Bearer {{token}}`
2. Should return your profile data

### Step 4: Test CRUD Operations

#### Users (Admin required)
1. **GET** `{{local_url}}/api/users` - List all users
2. **POST** `{{local_url}}/api/users` - Create new user
3. **PUT** `{{local_url}}/api/users/USER_ID` - Update user
4. **DELETE** `{{local_url}}/api/users/USER_ID` - Delete user

#### Destinations (Admin for CUD, Public for R)
1. **GET** `{{local_url}}/api/destinations` - List destinations (no auth needed)
2. **POST** `{{local_url}}/api/destinations` - Create destination (admin only)
3. **PUT** `{{local_url}}/api/destinations/DEST_ID` - Update destination (admin only)
4. **DELETE** `{{local_url}}/api/destinations/DEST_ID` - Delete destination (admin only)

#### Trips (User can CRUD own, Admin can CRUD all)
1. **GET** `{{local_url}}/api/trips` - List all trips
2. **POST** `{{local_url}}/api/trips` - Create trip
3. **PUT** `{{local_url}}/api/trips/TRIP_ID` - Update trip
4. **PATCH** `{{local_url}}/api/trips/TRIP_ID/approval` - Approve trip (admin only)
5. **DELETE** `{{local_url}}/api/trips/TRIP_ID` - Delete trip

#### Travel Requests (Public POST, Admin GET/PUT/DELETE)
1. **POST** `{{local_url}}/api/travel-requests` - Submit request (no auth needed)
2. **GET** `{{local_url}}/api/travel-requests` - List requests (admin only)
3. **PUT** `{{local_url}}/api/travel-requests/REQ_ID` - Update request (admin only)
4. **DELETE** `{{local_url}}/api/travel-requests/REQ_ID` - Delete request (admin only)

### Step 5: Test Utility Endpoints
1. **GET** `{{local_url}}/api/health` - Health check (no auth)
2. **GET** `{{local_url}}/api/stats` - Statistics (no auth)
3. **GET** `{{local_url}}/api/analytics` - Analytics (admin only)

---

## 📝 RESPONSE FORMATS

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

---

## 🔍 TESTING WITH REAL DATA

### Getting Real IDs for Testing

Before testing UPDATE, PATCH, or DELETE operations, you need real IDs from your database:

#### Get User IDs
```bash
GET {{local_url}}/api/users
# Response will include user IDs like: "id": "1200", "id": "1201", etc.
```

#### Get Destination IDs
```bash
GET {{local_url}}/api/destinations
# Response will include destination IDs like: "id": 1, "id": 2, etc.
```

#### Get Trip IDs
```bash
GET {{local_url}}/api/trips
# Response will include trip IDs like: "id": "uuid-string-here"
```

#### Get Travel Request IDs (Admin Only)
```bash
GET {{local_url}}/api/travel-requests
# Response will include request IDs like: "id": "uuid-string-here"
```

#### Get Notification IDs
```bash
GET {{local_url}}/api/notifications
# Response will include notification IDs like: "id": "uuid-string-here"
```

### Sample Test Flow

1. **Login** → Get token
2. **GET /api/destinations** → Get a destination ID (e.g., `1`)
3. **PUT /api/destinations/1** → Update that destination
4. **GET /api/destinations/1** → Verify the update
5. **DELETE /api/destinations/1** → Delete it (if needed)

---

## 🔍 COMMON HTTP STATUS CODES

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate data (e.g., email already exists)
- **500 Internal Server Error**: Server error

---

## � TROUBLESHOOTING

### Common Issues and Solutions

#### 1. "Invalid or expired token" (403)
**Problem**: Token expired or malformed  
**Solution**: 
- Re-login to get a fresh token
- Check Authorization header format: `Bearer YOUR_TOKEN`
- Ensure no extra spaces in the token

#### 2. "Admin access required" (403)
**Problem**: Trying to access admin endpoint with non-admin account  
**Solution**: 
- Use admin credentials: `ashu` / `Ashu19951?`
- Verify user role in login response

#### 3. "User not found" (404)
**Problem**: Using invalid user/trip/destination ID  
**Solution**: 
- First GET the list to see available IDs
- Use exact ID format (string for users/trips, number for destinations)

#### 4. "Email or Username already exists" (400)
**Problem**: Duplicate registration  
**Solution**: 
- Use unique email/username combinations
- Check existing users first

#### 5. Connection refused (Network Error)
**Problem**: Server not running or wrong URL  
**Solution**: 
- Verify server is running on localhost:5001
- Check production URL is accessible
- Ensure no firewall blocking

#### 6. "Validation failed" (400)
**Problem**: Missing required fields  
**Solution**: 
- Check request body matches documentation
- Ensure all required fields are included
- Verify data types (strings, numbers, arrays)

### Testing Checklist

#### Before Testing
- [ ] Server is running (check `/api/health`)
- [ ] Environment variables are set
- [ ] Valid test credentials available

#### Authentication Flow
- [ ] Login with admin credentials
- [ ] Login with agent credentials  
- [ ] Login with user credentials
- [ ] Token saved in environment
- [ ] Profile accessible with token

#### CRUD Operations Test
- [ ] CREATE: Add new record
- [ ] READ: Get all records
- [ ] READ: Get single record by ID
- [ ] UPDATE: Modify existing record
- [ ] DELETE: Remove record
- [ ] Verify changes persist

#### Permission Testing
- [ ] Admin can access all endpoints
- [ ] Agent has appropriate access
- [ ] User has limited access
- [ ] Unauthorized requests fail properly

---

## �📋 TESTING CHECKLIST

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Access protected endpoint without token (should fail)
- [ ] Access protected endpoint with invalid token (should fail)

### User Management
- [ ] Register new user
- [ ] Get user profile
- [ ] Update user profile
- [ ] Admin: Get all users
- [ ] Admin: Update any user
- [ ] Admin: Delete user

### Destinations
- [ ] Get all destinations (public)
- [ ] Admin: Create destination
- [ ] Admin: Update destination
- [ ] Admin: Delete destination

### Trips
- [ ] Create trip
- [ ] Get my trips
- [ ] Update my trip
- [ ] Admin: Approve/reject trip
- [ ] Delete trip

### Travel Requests
- [ ] Submit travel request (public)
- [ ] Admin: Get all requests
- [ ] Admin: Update request status
- [ ] Admin: Delete request

---

## 🚀 PRODUCTION DEPLOYMENT NOTES

### Environment Differences

#### Local Development
- **URL**: `http://localhost:5001`
- **Database**: Local Supabase instance
- **CORS**: Allows all origins
- **Logging**: Verbose console output
- **Rate Limiting**: Disabled

#### Production (Render)
- **URL**: `https://travel-planner-backend-f9gd.onrender.com`
- **Database**: Production Supabase
- **CORS**: Configured for specific origins
- **Logging**: Error-level only
- **Rate Limiting**: May be enabled

### Production Testing Considerations

1. **Cold Starts**: First request may take 10-30 seconds
2. **Rate Limits**: Avoid rapid-fire requests
3. **Data Persistence**: Changes affect real data
4. **SSL Required**: All requests must use HTTPS
5. **CORS Policy**: Ensure your client domain is whitelisted

### Monitoring Production

#### Health Check
```bash
GET https://travel-planner-backend-f9gd.onrender.com/api/health
```

#### Statistics
```bash
GET https://travel-planner-backend-f9gd.onrender.com/api/stats
```

### Production Credentials

Use the same test credentials for production:
- **Admin**: `ashu` / `Ashu19951?`
- **Agent**: `agent_jane` / `Ashu19951?`
- **User**: `traveler_bob` / `Ashu19951?`

---

**Note**: Replace placeholders like `YOUR_TOKEN`, `TRIP_ID_HERE`, `REQUEST_ID_HERE`, etc. with actual values when testing. Always test with both localhost and production URLs to ensure consistency.

## 📞 SUPPORT

For API issues or questions:
- **Email**: ashenafiabebe604@gmail.com
- **GitHub**: https://github.com/ashusoft1995/travel-planner-app-2026
- **Documentation**: This file (api_docs.md)

---

**Last Updated**: May 2, 2026  
**API Version**: 1.0  
**Server Status**: ✅ Active
er Status**: Active

---

# 🔄 FOCUSED PUT & DELETE OPERATIONS GUIDE

## 🌐 Quick Reference URLs
- **Local**: `http://localhost:5001`
- **Production**: `https://travel-planner-backend-f9gd.onrender.com`

---

## 🔑 AUTHENTICATION SETUP

### Step 1: Get Your Token
```bash
# Local
POST http://localhost:5001/api/login

# Production  
POST https://travel-planner-backend-f9gd.onrender.com/api/login

# Body:
{
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```

### Step 2: Use Token in All Requests
```bash
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 🔄 PUT OPERATIONS (Complete Updates)

### 1. UPDATE USER (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/users
# Copy a user ID from response

PUT http://localhost:5001/api/users/1201
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "name": "Updated Name",
  "role": "agent", 
  "status": "active"
}

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/users
PUT https://travel-planner-backend-f9gd.onrender.com/api/users/1201
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "name": "Updated Name",
  "role": "agent",
  "status": "active"
}
```

### 2. UPDATE DESTINATION (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/destinations
# Copy a destination ID from response

PUT http://localhost:5001/api/destinations/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "name": "Updated Lalibela",
  "price": "45,000 ETB",
  "rating": 4.9,
  "description": "Updated description with new attractions"
}

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/destinations
PUT https://travel-planner-backend-f9gd.onrender.com/api/destinations/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "name": "Updated Lalibela",
  "price": "45,000 ETB", 
  "rating": 4.9,
  "description": "Updated description with new attractions"
}
```

### 3. UPDATE TRIP
```bash
# Local Steps:
GET http://localhost:5001/api/trips
# Copy a trip ID from response

PUT http://localhost:5001/api/trips/TRIP_UUID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "destination": "Updated Gondar",
  "startDate": "2026-08-15",
  "endDate": "2026-08-25",
  "budget": 55000,
  "accommodation": "Luxury Hotel",
  "notes": "Updated preferences for luxury experience"
}

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/trips
PUT https://travel-planner-backend-f9gd.onrender.com/api/trips/TRIP_UUID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "destination": "Updated Gondar",
  "startDate": "2026-08-15",
  "endDate": "2026-08-25",
  "budget": 55000,
  "accommodation": "Luxury Hotel", 
  "notes": "Updated preferences for luxury experience"
}
```

### 4. UPDATE MY PROFILE
```bash
# Local:
PUT http://localhost:5001/api/me
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "name": "My Updated Name",
  "phone": "+251911777888",
  "about": "Travel enthusiast from Ethiopia exploring hidden gems"
}

# Production:
PUT https://travel-planner-backend-f9gd.onrender.com/api/me
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "name": "My Updated Name",
  "phone": "+251911777888",
  "about": "Travel enthusiast from Ethiopia exploring hidden gems"
}
```

### 5. UPDATE TRAVEL REQUEST (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/travel-requests
# Copy a request ID from response

PUT http://localhost:5001/api/travel-requests/REQUEST_UUID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "status": "reviewed",
  "admin_notes": "Customer contacted. Tour package prepared for Danakil Depression.",
  "assigned_agent": "agent_jane"
}

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/travel-requests
PUT https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/REQUEST_UUID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "status": "reviewed",
  "admin_notes": "Customer contacted. Tour package prepared for Danakil Depression.",
  "assigned_agent": "agent_jane"
}
```

### 6. UPDATE NOTIFICATION (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/notifications
# Copy a notification ID from response

PUT http://localhost:5001/api/notifications/NOTIFICATION_UUID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "message": "URGENT: Your trip has been confirmed! Check your email for details.",
  "type": "urgent",
  "audience": "user"
}

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/notifications
PUT https://travel-planner-backend-f9gd.onrender.com/api/notifications/NOTIFICATION_UUID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "message": "URGENT: Your trip has been confirmed! Check your email for details.",
  "type": "urgent",
  "audience": "user"
}
```

### 7. UPDATE ANNOUNCEMENT (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/announcements
# Copy an announcement ID from response

PUT http://localhost:5001/api/announcements/ANNOUNCEMENT_UUID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "title": "UPDATED: Special Offer - Bale Mountains",
  "body": "Extended offer! 20% off Bale Mountains tours until June 30th.",
  "type": "promotion",
  "is_active": true
}

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/announcements
PUT https://travel-planner-backend-f9gd.onrender.com/api/announcements/ANNOUNCEMENT_UUID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
{
  "title": "UPDATED: Special Offer - Bale Mountains",
  "body": "Extended offer! 20% off Bale Mountains tours until June 30th.",
  "type": "promotion",
  "is_active": true
}
```

---

## 🗑️ DELETE OPERATIONS (Permanent Removal)

### 1. DELETE USER (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/users
# Copy a user ID to delete

DELETE http://localhost:5001/api/users/1202
Authorization: Bearer YOUR_TOKEN

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/users
DELETE https://travel-planner-backend-f9gd.onrender.com/api/users/1202
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 2. DELETE DESTINATION (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/destinations
# Copy a destination ID to delete

DELETE http://localhost:5001/api/destinations/5
Authorization: Bearer YOUR_TOKEN

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/destinations
DELETE https://travel-planner-backend-f9gd.onrender.com/api/destinations/5
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "Destination deleted successfully"
}
```

### 3. DELETE TRIP
```bash
# Local Steps:
GET http://localhost:5001/api/trips
# Copy a trip ID to delete

DELETE http://localhost:5001/api/trips/TRIP_UUID
Authorization: Bearer YOUR_TOKEN

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/trips
DELETE https://travel-planner-backend-f9gd.onrender.com/api/trips/TRIP_UUID
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

### 4. DELETE TRAVEL REQUEST (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/travel-requests
# Copy a request ID to delete

DELETE http://localhost:5001/api/travel-requests/REQUEST_UUID
Authorization: Bearer YOUR_TOKEN

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/travel-requests
DELETE https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/REQUEST_UUID
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "Travel request deleted successfully"
}
```

### 5. DELETE CONTACT MESSAGE (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/contact-messages
# Copy a message ID to delete

DELETE http://localhost:5001/api/contact-messages/MESSAGE_UUID
Authorization: Bearer YOUR_TOKEN

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/contact-messages
DELETE https://travel-planner-backend-f9gd.onrender.com/api/contact-messages/MESSAGE_UUID
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "Contact message deleted successfully"
}
```

### 6. DELETE NOTIFICATION (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/notifications
# Copy a notification ID to delete

DELETE http://localhost:5001/api/notifications/NOTIFICATION_UUID
Authorization: Bearer YOUR_TOKEN

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/notifications
DELETE https://travel-planner-backend-f9gd.onrender.com/api/notifications/NOTIFICATION_UUID
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### 7. DELETE ANNOUNCEMENT (Admin Only)
```bash
# Local Steps:
GET http://localhost:5001/api/announcements
# Copy an announcement ID to delete

DELETE http://localhost:5001/api/announcements/ANNOUNCEMENT_UUID
Authorization: Bearer YOUR_TOKEN

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/announcements
DELETE https://travel-planner-backend-f9gd.onrender.com/api/announcements/ANNOUNCEMENT_UUID
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```

### 8. DELETE INTERNAL MESSAGE
```bash
# Local Steps:
GET http://localhost:5001/api/internal-messages
# Copy a message ID to delete

DELETE http://localhost:5001/api/internal-messages/MESSAGE_UUID
Authorization: Bearer YOUR_TOKEN

# Production Steps:
GET https://travel-planner-backend-f9gd.onrender.com/api/internal-messages
DELETE https://travel-planner-backend-f9gd.onrender.com/api/internal-messages/MESSAGE_UUID
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "Internal message deleted successfully"
}
```

### 9. DELETE MY ACCOUNT
```bash
# Local (WARNING: Permanent):
DELETE http://localhost:5001/api/me
Authorization: Bearer YOUR_TOKEN

# Production (WARNING: Permanent):
DELETE https://travel-planner-backend-f9gd.onrender.com/api/me
Authorization: Bearer YOUR_TOKEN

# Expected Response:
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🧪 STEP-BY-STEP TESTING WORKFLOW

### Local Development Testing:

#### Step 1: Start Your Server
```bash
cd backend
npm start
# Server should be running on http://localhost:5001
```

#### Step 2: Health Check
```bash
GET http://localhost:5001/api/health
# Expected: {"success": true, "message": "Server is running"}
```

#### Step 3: Login and Get Token
```bash
POST http://localhost:5001/api/login
Content-Type: application/json

{
  "identifier": "ashu",
  "password": "Ashu19951?"
}

# Copy the token from response.data.token
```

#### Step 4: Test PUT Operation Example
```bash
# Get existing destinations
GET http://localhost:5001/api/destinations

# Update a destination (use real ID from above)
PUT http://localhost:5001/api/destinations/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Destination Name",
  "price": "50,000 ETB",
  "rating": 4.8,
  "description": "Updated with new facilities"
}
```

#### Step 5: Test DELETE Operation Example
```bash
# Get existing notifications
GET http://localhost:5001/api/notifications
Authorization: Bearer YOUR_TOKEN_HERE

# Delete a notification (use real ID from above)
DELETE http://localhost:5001/api/notifications/NOTIFICATION_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

### Production (Render) Testing:

#### Step 1: Health Check Production
```bash
GET https://travel-planner-backend-f9gd.onrender.com/api/health
# Note: First request may take 10-30 seconds (cold start)
# Expected: {"success": true, "message": "Server is running"}
```

#### Step 2: Login to Production
```bash
POST https://travel-planner-backend-f9gd.onrender.com/api/login
Content-Type: application/json

{
  "identifier": "ashu",
  "password": "Ashu19951?"
}

# Copy the token from response.data.token
```

#### Step 3: Test PUT on Production
```bash
# Update your profile
PUT https://travel-planner-backend-f9gd.onrender.com/api/me
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+251911555444",
  "about": "Updated profile information"
}
```

#### Step 4: Test DELETE on Production
```bash
# Get your trips first
GET https://travel-planner-backend-f9gd.onrender.com/api/trips
Authorization: Bearer YOUR_TOKEN_HERE

# Delete a trip (use real ID from above)
DELETE https://travel-planner-backend-f9gd.onrender.com/api/trips/TRIP_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔍 COMMON ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Name is required", "Invalid email format"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## 🛡️ SECURITY & SAFETY NOTES

### For PUT Operations:
- ✅ Always validate input data
- ✅ Check user permissions before updating
- ✅ Users can only update their own resources (except admins)
- ✅ Sensitive fields like passwords require special handling
- ✅ Use proper Content-Type headers

### For DELETE Operations:
- ⚠️ **WARNING**: DELETE operations are PERMANENT
- ⚠️ Always confirm you have the correct ID
- ⚠️ Test with non-critical data first
- ⚠️ Admin permissions required for most deletions
- ⚠️ Some deletions may cascade (deleting user deletes their trips)

### Best Practices:
1. **Always backup data** before testing DELETE operations
2. **Use test accounts** for destructive operations
3. **Verify permissions** - ensure you're using the right role
4. **Check responses** - confirm operations succeeded
5. **Test locally first** before production testing

---

## 📋 QUICK TESTING CHECKLIST

### Before Testing:
- [ ] Server is running (check health endpoint)
- [ ] Valid admin credentials available
- [ ] Token obtained and saved
- [ ] Postman/curl ready with proper headers

### PUT Operations Test:
- [ ] Login and get fresh token
- [ ] GET resource list to find valid IDs
- [ ] PUT with valid data and proper headers
- [ ] Verify response shows success
- [ ] GET resource again to confirm changes

### DELETE Operations Test:
- [ ] Login and get fresh token
- [ ] GET resource list to find valid IDs
- [ ] DELETE with proper authorization
- [ ] Verify response shows success
- [ ] GET resource list to confirm deletion

### Permission Testing:
- [ ] Admin can PUT/DELETE all resources
- [ ] Users can only PUT/DELETE their own resources
- [ ] Unauthorized requests return 401/403
- [ ] Invalid IDs return 404

---

## 🚀 PRODUCTION CONSIDERATIONS

### Environment Differences:
- **Local**: Immediate response, verbose logging
- **Production**: Cold start delays, limited logging

### Production-Specific Notes:
1. **Cold Starts**: First request may take 10-30 seconds
2. **Rate Limits**: Avoid rapid-fire requests
3. **Data Persistence**: Changes affect real data
4. **SSL Required**: All requests must use HTTPS
5. **CORS Policy**: Ensure client domain is whitelisted

### Monitoring Production:
```bash
# Health Check
GET https://travel-planner-backend-f9gd.onrender.com/api/health

# Statistics
GET https://travel-planner-backend-f9gd.onrender.com/api/stats
```

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues:

#### "Invalid or expired token" (401/403)
**Solution**: Re-login to get fresh token, check header format

#### "Resource not found" (404)
**Solution**: Verify ID exists by GET request first

#### "Admin access required" (403)
**Solution**: Use admin credentials: `ashu` / `Ashu19951?`

#### Connection refused
**Solution**: Check server is running, verify URL

### For Support:
- **Email**: ashenafiabebe604@gmail.com
- **GitHub**: https://github.com/ashusoft1995/travel-planner-app-2026

---

**🔄 PUT & DELETE Guide Complete**  
**Last Updated**: May 2, 2026  
**Focus**: Clear step-by-step instructions for local and production testing**