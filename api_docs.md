# EthioTravel API Reference (Postman)

This document provides all **PUT** and **DELETE** endpoints available in the system for testing in Postman.

## 🔑 Authentication
All administrative and user-specific endpoints require an `Authorization` header:
`Authorization: Bearer <YOUR_JWT_TOKEN>`

---

## 🏗️ Destination Management
Manage the global destination registry.

### Update Destination
- **URL**: `{{BASE_URL}}/api/destinations/:id`
- **Method**: `PUT`
- **Body** (JSON):
```json
{
  "name": "Addis Ababa",
  "country": "Ethiopia",
  "region": "Addis Ababa",
  "price": "25,000 ETB",
  "rating": 4.8,
  "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
  "travelVolumeIndex": 85,
  "description": "Updated city description here."
}
```

### Delete Destination
- **URL**: `{{BASE_URL}}/api/destinations/:id`
- **Method**: `DELETE`

---

## ✈️ Trip Management
Manage user itineraries and bookings.

### Update Trip
- **URL**: `{{BASE_URL}}/api/trips/:id`
- **Method**: `PUT`
- **Body** (JSON):
```json
{
  "destination": "Lalibela",
  "startDate": "2026-05-10",
  "endDate": "2026-05-15",
  "budget": 45000,
  "accommodation": "Luxury Hotel",
  "notes": "Updated traveler notes."
}
```

### Approve/Reject Trip (Admin Only)
- **URL**: `{{BASE_URL}}/api/trips/:id/approval`
- **Method**: `PATCH`
- **Body** (JSON):
```json
{
  "approval_status": "approved",
  "notes": "Looks good! Itinerary confirmed."
}
```

### Delete Trip
- **URL**: `{{BASE_URL}}/api/trips/:id`
- **Method**: `DELETE`

---

## 👤 User & Profile Management
Manage identity and system access.

### Update My Profile
- **URL**: `{{BASE_URL}}/api/me`
- **Method**: `PUT`
- **Body** (JSON):
```json
{
  "name": "Ashenafi Abebe",
  "phone": "+251911223344",
  "about": "Expert guide and administrator.",
  "username": "ashu_new",
  "currentPassword": "OldPassword123",
  "password": "NewSecurePassword456"
}
```

### Update Any User (Admin Only)
- **URL**: `{{BASE_URL}}/api/users/:id`
- **Method**: `PUT`
- **Body** (JSON):
```json
{
  "role": "agent",
  "status": "active"
}
```

### Delete My Account (Self)
- **URL**: `{{BASE_URL}}/api/me`
- **Method**: `DELETE`

### Delete Any User (Admin Only)
- **URL**: `{{BASE_URL}}/api/users/:id`
- **Method**: `DELETE`

---

## 📢 Bulletins & Announcements

### Update Announcement
- **URL**: `{{BASE_URL}}/api/announcements/:id`
- **Method**: `PUT`
- **Body** (JSON):
```json
{
  "title": "Season Peak Alert",
  "body": "Travel volume is increasing in the North.",
  "type": "warning",
  "is_active": true
}
```

### Delete Announcement
- **URL**: `{{BASE_URL}}/api/announcements/:id`
- **Method**: `DELETE`

---

## 📨 Travel Requests

### Update Travel Request Status (Admin Only)
- **URL**: `{{BASE_URL}}/api/travel-requests/:id`
- **Method**: `PUT`
- **Body** (JSON):
```json
{
  "status": "reviewed",
  "admin_notes": "Follow up scheduled for tomorrow."
}
```

### Delete Travel Request
- **URL**: `{{BASE_URL}}/api/travel-requests/:id`
- **Method**: `DELETE`
