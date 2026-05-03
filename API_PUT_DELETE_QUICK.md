# 🔧 PUT & DELETE Endpoints - Quick Reference

## Base URL
- **Local**: `http://localhost:5001`
- **Production**: `https://travel-planner-backend-f9gd.onrender.com`

---

## 🔴 DELETE Endpoints (5 Most Important)

### 1. Delete Account
```
DELETE /api/me
Headers: Authorization: Bearer {{token}}
Response: { success: true, message: "Account deleted successfully" }
```

### 2. Delete User (Admin)
```
DELETE /api/users/:id
Headers: Authorization: Bearer {{token}}
Response: { success: true, message: "User deleted" }
```

### 3. Delete Destination (Admin)
```
DELETE /api/destinations/:id
Headers: Authorization: Bearer {{token}}
Response: { success: true }
```

### 4. Delete Trip
```
DELETE /api/trips/:id
Headers: Authorization: Bearer {{token}}
Response: { success: true, message: "Trip deleted" }
```

### 5. Delete Travel Request (Admin)
```
DELETE /api/travel-requests/:id
Headers: Authorization: Bearer {{token}}
Response: { success: true }
```

---

## 🟢 PUT Endpoints (5 Most Important)

### 1. Update Profile
```
PUT /api/me
Headers: Authorization: Bearer {{token}}
Body: { name, phone, about }
Response: { success: true, user: {...} }
```

### 2. Update User (Admin)
```
PUT /api/users/:id
Headers: Authorization: Bearer {{token}}
Body: { name, status, role, rating }
Response: { success: true, data: {...} }
```

### 3. Update Destination (Admin)
```
PUT /api/destinations/:id
Headers: Authorization: Bearer {{token}}
Body: { price, rating, description }
Response: { success: true, data: {...} }
```

### 4. Update Trip
```
PUT /api/trips/:id
Headers: Authorization: Bearer {{token}}
Body: { budget, notes, activities }
Response: { success: true, data: {...} }
```

### 5. Update Travel Request (Admin)
```
PUT /api/travel-requests/:id
Headers: Authorization: Bearer {{token}}
Body: { status, notes }
Response: { success: true, data: {...} }
```

---

## 🧪 Test Users
- Admin: `ashu` / `Ashu19951?`
- Agent: `agent_jane` / `Ashu19951?`
- User: `traveler_bob` / `Ashu19951?`

---

## ⚠️ Important Notes
- All endpoints require `Authorization: Bearer {{token}}`
- Admin endpoints require `role: "admin"`
- Token obtained from `/api/login`
- Token expires in 7 days
