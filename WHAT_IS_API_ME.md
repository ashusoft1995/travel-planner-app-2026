# 🔍 What is /api/me? - Explained with Examples

## What Does "/me" Mean?

`/api/me` means **"Current Logged-In User"**

It's a special endpoint that refers to **YOUR** profile (the user who is logged in).

---

## Real Examples

### Example 1: Delete Account
```
DELETE /api/me

This means: Delete MY account (the logged-in user's account)
```

### Example 2: Update Profile
```
PUT /api/me

This means: Update MY profile (the logged-in user's profile)
```

### Example 3: Get My Profile
```
GET /api/me

This means: Get MY profile (the logged-in user's profile)
```

---

## Comparison: /me vs /users/:id

### Using /me (Current User)
```
GET /api/me
→ Gets YOUR profile (whoever is logged in)
→ No ID needed
→ Always refers to current user
```

### Using /users/:id (Specific User)
```
GET /api/users/1200
→ Gets user with ID 1200
→ Need to specify ID
→ Can be any user
```

---

## Real-World Analogy

Think of it like this:

```
/api/me = "My Profile"
/api/users/1200 = "John's Profile"
/api/users/1201 = "Jane's Profile"
```

When you use `/api/me`, the system knows who you are and shows YOUR data.

---

## Sample URLs with /me

### Local Development
```
GET http://localhost:5001/api/me
PUT http://localhost:5001/api/me
DELETE http://localhost:5001/api/me
```

### Production (Render)
```
GET https://travel-planner-backend-f9gd.onrender.com/api/me
PUT https://travel-planner-backend-f9gd.onrender.com/api/me
DELETE https://travel-planner-backend-f9gd.onrender.com/api/me
```

---

## Complete Examples

### 1. Get My Profile
```
GET https://travel-planner-backend-f9gd.onrender.com/api/me

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

---

### 2. Update My Profile
```
PUT https://travel-planner-backend-f9gd.onrender.com/api/me

Body:
{
  "name": "New Name",
  "phone": "+251922222222",
  "about": "New bio"
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
    "phone": "+251922222222",
    "about": "New bio"
  }
}
```

---

### 3. Delete My Account
```
DELETE https://travel-planner-backend-f9gd.onrender.com/api/me

Response:
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## How /me Works

### Step 1: User Logs In
```
POST /api/login
Body: {"identifier": "ashu", "password": "Ashu19951?"}
Response: token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 2: System Knows Who You Are
```
Token contains: user_id = "1200"
System remembers: You are user 1200
```

### Step 3: Use /api/me
```
GET /api/me
System thinks: "Who is asking? User 1200"
System returns: User 1200's profile
```

---

## /me vs Other Endpoints

### /api/me (Current User)
```
GET /api/me → Get MY profile
PUT /api/me → Update MY profile
DELETE /api/me → Delete MY account
```

### /api/users/:id (Any User)
```
GET /api/users/1200 → Get user 1200's profile
PUT /api/users/1200 → Update user 1200's profile
DELETE /api/users/1200 → Delete user 1200's account
```

### /api/trips (All Trips)
```
GET /api/trips → Get all trips
POST /api/trips → Create new trip
```

### /api/trips/:id (Specific Trip)
```
GET /api/trips/1 → Get trip 1
PUT /api/trips/1 → Update trip 1
DELETE /api/trips/1 → Delete trip 1
```

---

## When to Use /me

✅ Use `/api/me` when:
- Getting your own profile
- Updating your own profile
- Deleting your own account
- Changing your password
- Updating your settings

❌ Don't use `/api/me` when:
- Getting another user's profile
- Updating another user's profile
- Deleting another user's account

---

## Quick Reference

| Endpoint | Purpose | Example |
|----------|---------|---------|
| GET /api/me | Get my profile | Get my user data |
| PUT /api/me | Update my profile | Change my name |
| DELETE /api/me | Delete my account | Remove my account |
| GET /api/users/1200 | Get user 1200 | Get someone else's data |
| PUT /api/users/1200 | Update user 1200 | Admin updates user |
| DELETE /api/users/1200 | Delete user 1200 | Admin deletes user |

---

## Summary

```
/api/me = Your own profile
/api/users/:id = Someone else's profile

/me is a shortcut that means "the current logged-in user"
```

---

**Now you understand /api/me! 🎉**
