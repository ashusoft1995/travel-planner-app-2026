# 🎯 EthioTravel API - Quick Reference Card

## 🌐 Base URLs

| Environment | URL |
|---|---|
| **Local** | `http://localhost:5001` |
| **Production** | `https://travel-planner-backend-f9gd.onrender.com` |

---

## 🔐 Authentication

### Login
```
POST /api/login
Body: { identifier, password }
Response: { success, data: { user, token } }
```

### Register
```
POST /api/users
Body: { name, email, username, password, role, phone, about }
Response: { success, data: { user, token } }
```

### Get Profile
```
GET /api/me
Headers: Authorization: Bearer {{token}}
Response: { success, data: user }
```

### Update Profile
```
PUT /api/me
Headers: Authorization: Bearer {{token}}
Body: { name, phone, about }
Response: { success, user }
```

---

## 👥 Users (Admin)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| PATCH | `/api/users/:id` | Partial update |
| DELETE | `/api/users/:id` | Delete user |

---

## 🏖️ Destinations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/destinations` | Get all destinations |
| POST | `/api/destinations` | Create destination (Admin) |
| PUT | `/api/destinations/:id` | Update destination (Admin) |
| DELETE | `/api/destinations/:id` | Delete destination (Admin) |

---

## ✈️ Trips

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trips` | Get all trips |
| GET | `/api/trips/:id` | Get trip by ID |
| POST | `/api/trips` | Create trip |
| PUT | `/api/trips/:id` | Update trip |
| PATCH | `/api/trips/:id/approval` | Approve/reject trip (Admin) |
| DELETE | `/api/trips/:id` | Delete trip |

---

## 📝 Travel Requests

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/travel-requests` | Get all requests (Admin) |
| POST | `/api/travel-requests` | Submit request |

---

## 🔔 Health & Stats

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/stats` | Get statistics |

---

## 🧪 Test Users

| Role | Username | Email | Password |
|---|---|---|---|
| Admin | `ashu` | ashenafiabebe604@gmail.com | `Ashu19951?` |
| Agent | `agent_jane` | jane@ethiotravel.com | `Ashu19951?` |
| User | `traveler_bob` | bob@gmail.com | `Ashu19951?` |

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
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

## 🔑 Common Headers

```
Content-Type: application/json
Authorization: Bearer {{token}}
```

---

## ⚡ Quick Commands

### Login & Save Token
```bash
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"ashu","password":"Ashu19951?"}'
```

### Get All Destinations
```bash
curl http://localhost:5001/api/destinations
```

### Create Trip (with token)
```bash
curl -X POST http://localhost:5001/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"destination":"Lalibela","startDate":"2026-06-01",...}'
```

---

## 🚀 Postman Setup

1. **Import Collection**: `EthioTravel_Complete_API.postman_collection.json`
2. **Create Environment**: Set `base_url` and `token`
3. **Login First**: Run login request to get token
4. **Use Token**: Token auto-saved for other requests

---

## ⚠️ Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔒 Authentication Flow

```
1. POST /api/login → Get token
2. Save token in environment
3. Use token in Authorization header
4. Token expires in 7 days
5. Login again to get new token
```

---

## 📱 Common Requests

### Create User Account
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "role": "user"
}
```

### Create Trip
```json
POST /api/trips
{
  "destination": "Lalibela",
  "startDate": "2026-06-01",
  "endDate": "2026-06-07",
  "budget": 50000,
  "activities": ["Church visits"],
  "accommodation": "Hotel"
}
```

### Approve Agent
```json
PATCH /api/users/:id
{
  "status": "active"
}
```

---

## 🎯 Workflow Examples

### Admin Workflow
```
1. Login as admin
2. GET /api/users → View all users
3. PATCH /api/users/:id → Approve agent
4. GET /api/travel-requests → View requests
5. PATCH /api/trips/:id/approval → Approve trip
```

### User Workflow
```
1. POST /api/users → Register
2. POST /api/login → Login
3. POST /api/trips → Create trip
4. GET /api/trips → View my trips
5. PUT /api/me → Update profile
```

### Agent Workflow
```
1. POST /api/users (role: agent) → Register as agent
2. Wait for admin approval
3. POST /api/login → Login
4. GET /api/travel-requests → View requests
5. PUT /api/users/:id → Update profile
```

---

## 🔗 Useful Links

- **API Guide**: `POSTMAN_API_GUIDE.md`
- **Setup Steps**: `POSTMAN_SETUP_STEPS.md`
- **Collection**: `EthioTravel_Complete_API.postman_collection.json`
- **GitHub**: https://github.com/ashusoft1995/travel-planner-app-2026

---

## 💡 Tips

- ✅ Always login first to get token
- ✅ Use environment variables for URLs
- ✅ Check response status codes
- ✅ Use test users for quick testing
- ✅ Save responses as examples
- ✅ Use pre-request scripts for automation

---

**Last Updated**: May 3, 2026 | **Version**: 1.0.0
