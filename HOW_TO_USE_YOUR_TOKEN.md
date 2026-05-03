# ✅ How to Use Your Token in Postman

## Your Token (Copy This Entire String)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDAiLCJlbWFpbCI6ImFzaGVuYWZpYWJlYmU2MDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3ODIzNTczLCJleXAiOjE3Nzg0MjgzNzN9.mCUjqGyr4YvGGRqtXwlEy4jeUHUiwPYOHlUeh9hXuwk
```

---

## Method 1: Using Authorization Tab (EASIEST)

### Step 1: Open Any Protected Request
- Example: **Get Current User**
- Click it in left sidebar

### Step 2: Click Authorization Tab
```
┌──────────────────────────────────────────┐
│ Tabs at top:                             │
│ Params | Authorization | Headers | Body  │
│                ▲                         │
│           CLICK HERE                     │
└──────────────────────────────────────────┘
```

### Step 3: Select Bearer Token
```
┌──────────────────────────────────────────┐
│ Type: [Bearer Token ▼]                   │
│        ▲                                 │
│     CLICK DROPDOWN & SELECT              │
│     "Bearer Token"                       │
└──────────────────────────────────────────┘
```

### Step 4: Paste Your Token
```
┌──────────────────────────────────────────┐
│ Token: [eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...]
│         ▲                                │
│      PASTE YOUR TOKEN HERE               │
│      (The long string)                   │
└──────────────────────────────────────────┘
```

### Step 5: Click Send
```
┌──────────────────────────────────────────┐
│ [Send] Button (Blue)                     │
│   ▲                                      │
│ CLICK HERE                               │
└──────────────────────────────────────────┘
```

### Step 6: See Response
```
Response:
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
    "about": "System Administrator"
  }
}
```

✅ **Success! You're authenticated!**

---

## Method 2: Using Headers Tab (MANUAL)

### Step 1: Click Headers Tab
```
┌──────────────────────────────────────────┐
│ Tabs: Params | Authorization | Headers   │
│                              ▲           │
│                          CLICK HERE      │
└──────────────────────────────────────────┘
```

### Step 2: Add New Header
```
┌──────────────────────────────────────────┐
│ Key              │ Value                 │
├──────────────────┼──────────────────────┤
│ Content-Type     │ application/json      │
│ Authorization    │ Bearer eyJhbGciOi...  │
│                  │ ▲                    │
│              PASTE TOKEN HERE            │
└──────────────────────────────────────────┘
```

### Step 3: Format Must Be
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDAiLCJlbWFpbCI6ImFzaGVuYWZpYWJlYmU2MDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3ODIzNTczLCJleHAiOjE3Nzg0MjgzNzN9.mCUjqGyr4YvGGRqtXwlEy4jeUHUiwPYOHlUeh9hXuwk
```

**Important:** Include the word **Bearer** before the token!

### Step 4: Click Send
- Click **Send** button
- You'll get response ✓

---

## Complete Example: Update Profile

### Request Details:
```
Method: PUT
URL: http://localhost:5001/api/me

Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDAiLCJlbWFpbCI6ImFzaGVuYWZpYWJlYmU2MDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3ODIzNTczLCJleHAiOjE3Nzg0MjgzNzN9.mCUjqGyr4YvGGRqtXwlEy4jeUHUiwPYOHlUeh9hXuwk
  Content-Type: application/json

Body (raw JSON):
{
  "name": "New Name",
  "phone": "+251911111111",
  "about": "Updated bio"
}
```

### Response:
```json
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

✅ **Profile updated successfully!**

---

## Test All These Endpoints with Your Token

### 1. Get Current User
```
GET http://localhost:5001/api/me
Authorization: Bearer YOUR_TOKEN
```

### 2. Update Profile
```
PUT http://localhost:5001/api/me
Authorization: Bearer YOUR_TOKEN
Body: { "name": "New Name" }
```

### 3. Get All Users (Admin)
```
GET http://localhost:5001/api/users
Authorization: Bearer YOUR_TOKEN
```

### 4. Get All Destinations
```
GET http://localhost:5001/api/destinations
Authorization: Bearer YOUR_TOKEN
```

### 5. Create Trip
```
POST http://localhost:5001/api/trips
Authorization: Bearer YOUR_TOKEN
Body: {
  "destination": "Lalibela",
  "startDate": "2026-06-01",
  "endDate": "2026-06-07",
  "budget": 50000
}
```

### 6. Update Trip
```
PUT http://localhost:5001/api/trips/1
Authorization: Bearer YOUR_TOKEN
Body: { "budget": 60000 }
```

### 7. Delete Trip
```
DELETE http://localhost:5001/api/trips/1
Authorization: Bearer YOUR_TOKEN
```

---

## Visual: Where to Paste Token in Postman

```
POSTMAN WINDOW:

┌─────────────────────────────────────────────────────┐
│ GET  http://localhost:5001/api/me          [Send]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Tabs: Params | Authorization | Headers | Body      │
│                    ▲                                │
│              CLICK THIS TAB                         │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Type: [Bearer Token ▼]                          │ │
│ │                                                 │ │
│ │ Token: [eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...] │
│ │         ▲                                       │ │
│ │      PASTE YOUR TOKEN HERE                      │ │
│ │                                                 │ │
│ │ [Preview] [Clear]                               │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [Send] Button                                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Token Information

### Your Token Details:
```
User ID: 1200
Email: ashenafiabebe604@gmail.com
Role: admin
Issued: May 3, 2026
Expires: May 10, 2026 (7 days)
```

### Token Format:
```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJpZCI6IjEyMDAiLCJlbWFpbCI6ImFzaGVuYWZpYWJlYmU2MDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3ODIzNTczLCJleHAiOjE3Nzg0MjgzNzN9
.
mCUjqGyr4YvGGRqtXwlEy4jeUHUiwPYOHlUeh9hXuwk
```

---

## Quick Checklist

- [ ] Copy your token
- [ ] Open Postman
- [ ] Click any protected endpoint
- [ ] Click Authorization tab
- [ ] Select Bearer Token
- [ ] Paste token
- [ ] Click Send
- [ ] See response ✓

---

## Troubleshooting

### Problem: "Unauthorized" Error
**Solution:**
- Make sure you pasted the ENTIRE token
- Check "Bearer" word is included
- Token might be expired (7 days)

### Problem: Token Not Working
**Solution:**
- Copy token again from login response
- Make sure no extra spaces
- Check Authorization header format

### Problem: Can't Find Authorization Tab
**Solution:**
- Look for tabs at top of request
- Should see: Params | Authorization | Headers | Body
- Click Authorization

### Problem: Bearer Token Option Not Available
**Solution:**
- Click Type dropdown
- Select "Bearer Token" from list
- If not there, select "API Key" and manually type header

---

## Your Token is Valid For:

✅ All GET requests
✅ All POST requests
✅ All PUT requests
✅ All DELETE requests
✅ All admin endpoints
✅ All user endpoints

**For 7 days from now!**

---

**Now you can test all API endpoints! 🎉**
