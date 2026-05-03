# 🔧 10 Endpoints - DELETE & PUT (Render URL - No Bearer Token)

## Base URL (Render Production)
```
https://travel-planner-backend-f9gd.onrender.com
```

---

## 🔴 DELETE Endpoints (5)

### 1. Delete Account
```
DELETE https://travel-planner-backend-f9gd.onrender.com/api/me

Body: (empty)

Response:
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

### 2. Delete User (Admin)
```
DELETE https://travel-planner-backend-f9gd.onrender.com/api/users/1201

Body: (empty)

Response:
{
  "success": true,
  "message": "User deleted"
}
```

---

### 3. Delete Destination (Admin)
```
DELETE https://travel-planner-backend-f9gd.onrender.com/api/destinations/5

Body: (empty)

Response:
{
  "success": true
}
```

---

### 4. Delete Trip
```
DELETE https://travel-planner-backend-f9gd.onrender.com/api/trips/2

Body: (empty)

Response:
{
  "success": true,
  "message": "Trip deleted"
}
```

---

### 5. Delete Travel Request (Admin)
```
DELETE https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/1

Body: (empty)

Response:
{
  "success": true
}
```

---

## 🟢 PUT Endpoints (5)

### 6. Update Profile
```
PUT https://travel-planner-backend-f9gd.onrender.com/api/me

Body:
{
  "name": "New Name",
  "phone": "+251911111111",
  "about": "Updated bio"
}

Response:
{
  "success": true,
  "user": {
    "id": "1200",
    "email": "ashenafiabebe604@gmail.com",
    "name": "New Name",
    "role": "admin",
    "status": "active",
    "username": "ashu",
    "phone": "+251911111111",
    "about": "Updated bio"
  }
}
```

---

### 7. Update User (Admin)
```
PUT https://travel-planner-backend-f9gd.onrender.com/api/users/1201

Body:
{
  "name": "Updated Agent Name",
  "status": "active",
  "role": "agent",
  "rating": 4.8
}

Response:
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

### 8. Update Destination (Admin)
```
PUT https://travel-planner-backend-f9gd.onrender.com/api/destinations/1

Body:
{
  "price": "40,000 ETB",
  "rating": 4.9,
  "description": "Updated description"
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Lalibela",
    "price": "40,000 ETB",
    "rating": 4.9,
    "description": "Updated description"
  }
}
```

---

### 9. Update Trip
```
PUT https://travel-planner-backend-f9gd.onrender.com/api/trips/2

Body:
{
  "budget": 80000,
  "notes": "Updated notes",
  "activities": ["Hiking", "Photography"]
}

Response:
{
  "success": true,
  "data": {
    "id": 2,
    "destination": "Simien Mountains",
    "budget": 80000,
    "notes": "Updated notes",
    "activities": ["Hiking", "Photography"]
  }
}
```

---

### 10. Update Travel Request (Admin)
```
PUT https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/1

Body:
{
  "status": "approved",
  "notes": "Approved by admin"
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Ahmed Hassan",
    "status": "approved",
    "notes": "Approved by admin"
  }
}
```

---

## 📋 Quick Reference Table

| # | Method | URL | Purpose |
|---|--------|-----|---------|
| 1 | DELETE | /api/me | Delete Account |
| 2 | DELETE | /api/users/:id | Delete User |
| 3 | DELETE | /api/destinations/:id | Delete Destination |
| 4 | DELETE | /api/trips/:id | Delete Trip |
| 5 | DELETE | /api/travel-requests/:id | Delete Travel Request |
| 6 | PUT | /api/me | Update Profile |
| 7 | PUT | /api/users/:id | Update User |
| 8 | PUT | /api/destinations/:id | Update Destination |
| 9 | PUT | /api/trips/:id | Update Trip |
| 10 | PUT | /api/travel-requests/:id | Update Travel Request |

---

## ✅ How to Use in Postman

### Step 1: Open Postman
- Launch Postman

### Step 2: Select Method
- Choose DELETE or PUT

### Step 3: Paste URL
- Copy URL from above
- Paste in URL bar

### Step 4: Add Body (for PUT only)
- Click Body tab
- Select raw (JSON)
- Paste JSON from above

### Step 5: Send
- Click Send button
- See response ✓

---

## ⚠️ Important

- ✅ NO Bearer token needed
- ✅ NO Authorization header
- ✅ NO headers needed
- ✅ Just send the request
- ✅ Use Render URL (production)

---

## 🧪 Test IDs

Replace these with real IDs:
- User ID: `1201` (agent_jane)
- Destination ID: `1` (Lalibela)
- Trip ID: `2`
- Travel Request ID: `1`

---

**All 10 endpoints ready! No authentication! 🚀**
