# 🚀 EthioTravel API Documentation (Postman Ready)

This documentation provides the endpoints for both Local Development and Production environments.

### 🌐 Server Environments
- **Local Host**: `http://localhost:5000`
- **Production Host**: `https://travel-planner-backend-f9gd.onrender.com`

---

## 🔑 Authentication
All administrative and user-specific endpoints require an `Authorization` header.

| Key | Value |
| :--- | :--- |
| **Header** | `Authorization` |
| **Format** | `Bearer <YOUR_JWT_TOKEN>` |

---

## 🔄 ALL UPDATE ENDPOINTS (PUT / PATCH)
Use these to modify existing records.

### 1. Update My Profile (Self)
- **Local URL**: `http://localhost:5000/api/me`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/me`
- **Method**: `PUT`
- **Payload**:
```json
{
  "name": "Ashenafi Abebe",
  "phone": "+251911223344",
  "username": "ashu_updated",
  "currentPassword": "OldPassword123",
  "password": "NewSecurePassword456"
}
```

### 2. Update Destination (Admin Only)
- **Local URL**: `http://localhost:5000/api/destinations/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/destinations/:id`
- **Method**: `PUT`
- **Payload**:
```json
{
  "name": "Lalibela",
  "price": "28,000 ETB",
  "rating": 4.9,
  "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  "travelVolumeIndex": 90
}
```

### 3. Update Trip Itinerary
- **Local URL**: `http://localhost:5000/api/trips/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips/:id`
- **Method**: `PUT`
- **Payload**:
```json
{
  "destination": "Gondar",
  "startDate": "2026-06-01",
  "endDate": "2026-06-07",
  "budget": 55000,
  "accommodation": "Mid-range Hotel"
}
```

### 4. Approve/Reject Trip (Admin Only)
- **Local URL**: `http://localhost:5000/api/trips/:id/approval`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips/:id/approval`
- **Method**: `PATCH`
- **Payload**:
```json
{
  "approval_status": "approved",
  "notes": "Verified and confirmed."
}
```

### 5. Update User Role/Status (Admin Only)
- **Local URL**: `http://localhost:5000/api/users/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/users/:id`
- **Method**: `PUT`
- **Payload**:
```json
{
  "role": "agent",
  "status": "active"
}
```

### 6. Update Announcement/Bulletin (Admin Only)
- **Local URL**: `http://localhost:5000/api/announcements/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/announcements/:id`
- **Method**: `PUT`
- **Payload**:
```json
{
  "title": "Season Peak Alert",
  "body": "Travel volume is increasing.",
  "type": "warning",
  "is_active": true
}
```

### 7. Update Travel Request Status (Admin Only)
- **Local URL**: `http://localhost:5000/api/travel-requests/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/:id`
- **Method**: `PUT`
- **Payload**:
```json
{
  "status": "reviewed",
  "admin_notes": "Follow up scheduled."
}
```

---

## 🗑️ ALL DELETE ENDPOINTS
Use these to permanently remove records.

### 1. Purge My Account (Self)
- **Local URL**: `http://localhost:5000/api/me`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/me`
- **Method**: `DELETE`

### 2. Delete Destination (Admin Only)
- **Local URL**: `http://localhost:5000/api/destinations/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/destinations/:id`
- **Method**: `DELETE`

### 3. Delete Trip Itinerary
- **Local URL**: `http://localhost:5000/api/trips/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/trips/:id`
- **Method**: `DELETE`

### 4. Delete User Record (Admin Only)
- **Local URL**: `http://localhost:5000/api/users/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/users/:id`
- **Method**: `DELETE`

### 5. Kill Announcement/Bulletin (Admin Only)
- **Local URL**: `http://localhost:5000/api/announcements/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/announcements/:id`
- **Method**: `DELETE`

### 6. Purge Travel Request (Admin Only)
- **Local URL**: `http://localhost:5000/api/travel-requests/:id`
- **Prod URL**: `https://travel-planner-backend-f9gd.onrender.com/api/travel-requests/:id`
- **Method**: `DELETE`
