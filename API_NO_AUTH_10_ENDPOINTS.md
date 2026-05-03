# 🚀 10 API Endpoints - NO Bearer Token Required

## Base URL
```
http://localhost:5001
```

---

## 1. Login (Get Token)
```
POST /api/login

Body:
{
  "identifier": "ashu",
  "password": "Ashu19951?"
}

Response:
{
  "success": true,
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

---

## 2. Register User
```
POST /api/users

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "role": "user",
  "phone": "+251911234567",
  "about": "Travel enthusiast"
}

Response:
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "user_123",
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

## 3. Register Agent
```
POST /api/users

Body:
{
  "name": "Jane Travel Expert",
  "email": "jane@example.com",
  "username": "jane_agent",
  "password": "SecurePass123!",
  "role": "agent",
  "phone": "+251911234567",
  "expertise": ["Addis Ababa", "Lalibela"],
  "about": "Professional travel guide",
  "legal_paper_photo": "https://example.com/permit.jpg",
  "national_id_photo": "https://example.com/id.jpg"
}

Response:
{
  "success": true,
  "message": "Account request sent to admin. Please wait for approval."
}
```

---

## 4. Get All Destinations
```
GET /api/destinations

Response:
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
    },
    {
      "id": 2,
      "name": "Simien Mountains",
      "description": "Dramatic mountain landscapes",
      "country": "Ethiopia",
      "region": "Amhara",
      "price": "28,000 ETB",
      "rating": 4.7,
      "travel_volume_index": 85
    }
  ]
}
```

---

## 5. Get All Trips
```
GET /api/trips

Response:
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

## 6. Get Specific Trip
```
GET /api/trips/1

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "owner_email": "john@example.com",
    "destination": "Lalibela",
    "start_date": "2026-06-01",
    "end_date": "2026-06-07",
    "budget": 50000,
    "activities": ["Church visits"],
    "accommodation": "Hotel",
    "approval_status": "approved"
  }
}
```

---

## 7. Submit Travel Request
```
POST /api/travel-requests

Body:
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

Response:
{
  "success": true,
  "message": "Travel request submitted successfully"
}
```

---

## 8. Health Check
```
GET /api/health

Response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-03T10:30:00.000Z"
}
```

---

## 9. Get Statistics
```
GET /api/stats

Response:
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

## 10. Delete Trip (No Auth)
```
DELETE /api/trips/1

Response:
{
  "success": true,
  "message": "Trip deleted"
}
```

---

## 📋 Summary Table

| # | Method | Endpoint | Auth Required | Purpose |
|---|--------|----------|---------------|---------|
| 1 | POST | /api/login | ❌ NO | Login & get token |
| 2 | POST | /api/users | ❌ NO | Register user |
| 3 | POST | /api/users | ❌ NO | Register agent |
| 4 | GET | /api/destinations | ❌ NO | Get all destinations |
| 5 | GET | /api/trips | ❌ NO | Get all trips |
| 6 | GET | /api/trips/:id | ❌ NO | Get specific trip |
| 7 | POST | /api/travel-requests | ❌ NO | Submit travel request |
| 8 | GET | /api/health | ❌ NO | Health check |
| 9 | GET | /api/stats | ❌ NO | Get statistics |
| 10 | DELETE | /api/trips/:id | ❌ NO | Delete trip |

---

## 🧪 Test Users

```
Admin:    ashu / Ashu19951?
Agent:    agent_jane / Ashu19951?
User:     traveler_bob / Ashu19951?
```

---

## ✅ How to Use in Postman

### For Each Endpoint:
1. Open Postman
2. Select **Method** (GET, POST, DELETE)
3. Enter **URL**: `http://localhost:5001/api/...`
4. If POST: Click **Body** → Paste JSON
5. Click **Send**
6. See response ✓

### NO Authorization Header Needed!
- ❌ Don't add Bearer token
- ❌ Don't add Authorization header
- ✅ Just send the request directly

---

## 📝 Example: Login in Postman

```
Method: POST
URL: http://localhost:5001/api/login

Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "identifier": "ashu",
  "password": "Ashu19951?"
}

Click Send → Get response with token
```

---

## 📝 Example: Get Destinations in Postman

```
Method: GET
URL: http://localhost:5001/api/destinations

Headers:
  Content-Type: application/json

NO Body needed

Click Send → Get all destinations
```

---

## 📝 Example: Submit Travel Request in Postman

```
Method: POST
URL: http://localhost:5001/api/travel-requests

Headers:
  Content-Type: application/json

Body (raw JSON):
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
  "travelHistory": "First time"
}

Click Send → Request submitted
```

---

## ⚠️ Important Notes

- ✅ These 10 endpoints work WITHOUT authentication
- ✅ No Bearer token needed
- ✅ No Authorization header needed
- ✅ Just send the request directly
- ✅ All responses are JSON format

---

## 🎯 Quick Checklist

- [ ] Open Postman
- [ ] Select method (GET/POST/DELETE)
- [ ] Enter URL
- [ ] Add body if needed (for POST)
- [ ] Click Send
- [ ] See response ✓

---

**All 10 endpoints ready to use! No authentication required! 🚀**
