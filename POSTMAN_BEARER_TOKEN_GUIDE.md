# 🔐 How to Use Bearer Token in Postman - Step by Step

## Step 1: Login First to Get Token

### In Postman:
1. Go to **Authentication** folder
2. Click **Login** request
3. Body should have:
```json
{
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```
4. Click **Send**

### You will see Response:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDAiLCJlbWFpbCI6ImFzaGVuYWZpYWJlYmU2MDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3Nzk1NzQxLCJleHAiOjE3Nzg0MDA1NDF9.HOTmBEUQd_0G2-vS-DBnj65MBjEa-0Ch6GusqdRAQus"
  }
}
```

**Copy the token value** (the long string starting with `eyJ...`)

---

## Step 2: Save Token to Environment

### Automatic (Recommended):
The Postman collection automatically saves token to `{{token}}` variable after login.

### Manual (If needed):
1. Click **Environments** (left sidebar)
2. Select **EthioTravel Local**
3. Find `token` variable
4. Paste the token value
5. Click **Save**

---

## Step 3: Add Bearer Token to Headers

### Method 1: Using Authorization Tab (EASIEST)

1. Open any request (e.g., **Get Current User**)
2. Click **Authorization** tab
3. Select **Bearer Token** from dropdown
4. In **Token** field, type: `{{token}}`
5. Click **Send**

**Screenshot:**
```
┌─────────────────────────────────────────┐
│ Authorization Tab                       │
├─────────────────────────────────────────┤
│ Type: [Bearer Token ▼]                  │
│                                         │
│ Token: [{{token}}]                      │
│                                         │
│ [Preview] [Clear]                       │
└─────────────────────────────────────────┘
```

### Method 2: Using Headers Tab (MANUAL)

1. Open any request
2. Click **Headers** tab
3. Add new header:
   - **Key**: `Authorization`
   - **Value**: `Bearer {{token}}`
4. Click **Send**

**Screenshot:**
```
┌──────────────────────────────────────────┐
│ Headers Tab                              │
├──────────────────────────────────────────┤
│ Key              │ Value                 │
├──────────────────┼──────────────────────┤
│ Content-Type     │ application/json      │
│ Authorization    │ Bearer {{token}}      │
└──────────────────────────────────────────┘
```

---

## Step 4: See Your Token Value

### Where to Find Your Token:

**Option 1: In Response**
1. Login request → Click **Send**
2. Look at **Response** section
3. Find `"token": "eyJ..."`
4. That's your token!

**Option 2: In Environment**
1. Click **Environments** (left sidebar)
2. Select **EthioTravel Local**
3. Look for `token` variable
4. You'll see the value there

**Option 3: In Postman Console**
1. Click **View** → **Show Postman Console**
2. Run login request
3. Console shows all requests/responses
4. Find token in response

---

## Complete Example: Update Profile with Bearer Token

### Step 1: Login
```
POST http://localhost:5001/api/login
Body: {
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```
Response includes token ✓

### Step 2: Copy Token
From response: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Update Profile
```
PUT http://localhost:5001/api/me

Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

Body: {
  "name": "New Name",
  "phone": "+251911111111"
}
```

### Step 4: Send Request
Click **Send** → You get response ✓

---

## Quick Reference: Bearer Token Format

### What is Bearer Token?
```
Authorization: Bearer <YOUR_TOKEN_HERE>
```

### Example with Real Token:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDAiLCJlbWFpbCI6ImFzaGVuYWZpYWJlYmU2MDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3Nzk1NzQxLCJleHAiOjE3Nzg0MDA1NDF9.HOTmBEUQd_0G2-vS-DBnj65MBjEa-0Ch6GusqdRAQus
```

### Using Variable (Recommended):
```
Authorization: Bearer {{token}}
```

---

## Troubleshooting

### Problem: "Unauthorized" Error
**Solution:**
1. Make sure you logged in first
2. Check token is saved in environment
3. Verify Authorization header is set correctly

### Problem: Token Not Showing
**Solution:**
1. Run login request first
2. Check response has token
3. Look in Environments → EthioTravel Local

### Problem: "Invalid token"
**Solution:**
1. Token might be expired (7 days)
2. Login again to get new token
3. Update environment variable

### Problem: Can't Find Authorization Tab
**Solution:**
1. Make sure you're in request view
2. Look for tabs: Params, Authorization, Headers, Body, etc.
3. Click **Authorization** tab

---

## Step-by-Step Video Guide (Text Version)

### 1. Open Postman
- Launch Postman application

### 2. Select Environment
- Top right corner
- Click dropdown
- Select **EthioTravel Local**

### 3. Login
- Go to **Authentication** folder
- Click **Login** request
- Click **Send**
- See token in response

### 4. Use Token
- Go to any protected endpoint (e.g., **Get Current User**)
- Click **Authorization** tab
- Select **Bearer Token**
- Type `{{token}}`
- Click **Send**

### 5. Success!
- You should see response with your user data

---

## All Protected Endpoints Need Bearer Token

These endpoints require `Authorization: Bearer {{token}}`:

✓ GET /api/me
✓ PUT /api/me
✓ DELETE /api/me
✓ GET /api/users (Admin)
✓ PUT /api/users/:id (Admin)
✓ DELETE /api/users/:id (Admin)
✓ POST /api/trips
✓ PUT /api/trips/:id
✓ DELETE /api/trips/:id
✓ And all other admin endpoints...

---

## Quick Checklist

- [ ] Download Postman
- [ ] Import collection
- [ ] Create environment
- [ ] Run Login request
- [ ] See token in response
- [ ] Copy token to environment
- [ ] Use {{token}} in Authorization header
- [ ] Test protected endpoint
- [ ] Success! ✓

---

## Token Expiration

- **Expires in**: 7 days
- **When expired**: Get "Unauthorized" error
- **Solution**: Login again to get new token

---

**Now you know how to use Bearer tokens in Postman! 🎉**
