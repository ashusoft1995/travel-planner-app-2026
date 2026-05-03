# 🔍 Where to Find Login Request in Postman - Visual Guide

## If You Don't Have Collection Yet

### Step 1: Import Collection First
1. Open Postman
2. Click **File** (top left)
3. Click **Import**
4. Select file: `EthioTravel_Complete_API.postman_collection.json`
5. Click **Import**

---

## After Importing Collection - Where is Login?

### Left Sidebar Structure:

```
┌─────────────────────────────────────────┐
│ POSTMAN LEFT SIDEBAR                    │
├─────────────────────────────────────────┤
│                                         │
│ 📁 Collections                          │
│   └─ 📦 EthioTravel API                 │
│      ├─ 🔐 Authentication ◄─ CLICK HERE │
│      │  ├─ 📝 Login ◄─ CLICK THIS       │
│      │  ├─ 📝 Register User             │
│      │  ├─ 📝 Register Agent            │
│      │  ├─ 📝 Get Current User          │
│      │  ├─ 📝 Update Profile            │
│      │  └─ 📝 Delete Account            │
│      │                                  │
│      ├─ 👥 User Management              │
│      ├─ 🏖️ Destinations                 │
│      ├─ ✈️ Trips                        │
│      ├─ 📝 Travel Requests              │
│      └─ 🔔 Health & Stats               │
│                                         │
└─────────────────────────────────────────┘
```

---

## Step-by-Step: Find and Click Login

### Step 1: Look at Left Sidebar
- You should see **Collections** section
- Find **EthioTravel API** (the collection name)

### Step 2: Expand Authentication Folder
- Click the arrow (▶) next to **🔐 Authentication**
- It expands to show requests inside

### Step 3: Click Login Request
- You'll see **📝 Login** in the list
- Click on it

### Step 4: Login Request Opens
- Right side shows the request details
- You'll see:
  - **URL**: `{{base_url}}/api/login`
  - **Method**: POST
  - **Body** tab with login data

---

## Visual: Exact Location in Postman

```
POSTMAN WINDOW:

┌──────────────────────────────────────────────────────────────┐
│ File  Edit  View  Help                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ LEFT SIDEBAR          │         MAIN AREA                   │
│                       │                                      │
│ Collections           │  POST {{base_url}}/api/login        │
│ ├─ EthioTravel API    │                                      │
│ │  ├─ 🔐 Auth ▶       │  Params  Authorization  Headers  Body
│ │  │  ├─ Login ◄──────┼─ YOU CLICK HERE                     │
│ │  │  ├─ Register     │                                      │
│ │  │  └─ ...          │  Body (raw):                        │
│ │  ├─ Users           │  {                                  │
│ │  ├─ Destinations    │    "identifier": "ashu",            │
│ │  ├─ Trips           │    "password": "Ashu19951?"         │
│ │  └─ ...             │  }                                  │
│ │                     │                                      │
│ │                     │  [Send] Button                      │
│ │                     │                                      │
│ └─────────────────────┴──────────────────────────────────────┘
│
```

---

## If Login Doesn't Exist - Create It Manually

### If you don't see Login request:

#### Step 1: Create New Request
1. Right-click on **Authentication** folder
2. Click **Add Request**
3. Name it: `Login`

#### Step 2: Set Request Details
1. **Method**: Change to **POST**
2. **URL**: `{{base_url}}/api/login`
3. Click **Body** tab
4. Select **raw** (JSON)
5. Paste:
```json
{
  "identifier": "ashu",
  "password": "Ashu19951?"
}
```

#### Step 3: Save
- Press **Ctrl+S** or click **Save**

#### Step 4: Send
- Click **Send** button

---

## What You'll See After Clicking Login

### Request View Opens:

```
┌─────────────────────────────────────────────────────┐
│ Login                                    [Send]      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ POST  {{base_url}}/api/login                        │
│                                                     │
│ Tabs: Params | Authorization | Headers | Body      │
│                                                     │
│ Body (raw - JSON):                                  │
│ {                                                   │
│   "identifier": "ashu",                             │
│   "password": "Ashu19951?"                          │
│ }                                                   │
│                                                     │
│ [Send] Button (Blue)                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## After Clicking Send - Where is Token?

### Response Shows Below:

```
┌─────────────────────────────────────────────────────┐
│ Response                                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Status: 200 OK                                      │
│                                                     │
│ {                                                   │
│   "success": true,                                  │
│   "message": "Login successful",                    │
│   "data": {                                         │
│     "user": {                                       │
│       "id": "1200",                                 │
│       "username": "ashu",                           │
│       "email": "ashenafiabebe604@gmail.com",        │
│       "name": "Ashenafi Abebe",                     │
│       "role": "admin",                              │
│       "status": "active"                            │
│     },                                              │
│     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" │
│   }                                                 │
│ }                                                   │
│                                                     │
│ ◄─ TOKEN IS HERE! Copy this long string            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Copy Token - Where to Find It

### In Response JSON:
```
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDAiLCJlbWFpbCI6ImFzaGVuYWZpYWJlYmU2MDRAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3Nzk1NzQxLCJleHAiOjE3Nzg0MDA1NDF9.HOTmBEUQd_0G2-vS-DBnj65MBjEa-0Ch6GusqdRAQus"
```

**This entire string is your token!**

---

## Save Token to Environment

### Automatic (Already Done):
- Collection has test script
- Token auto-saves to `{{token}}`

### Manual (If needed):
1. Click **Environments** (left sidebar)
2. Click **EthioTravel Local**
3. Find row with `token`
4. Paste token value in **Current Value** column
5. Click **Save**

---

## Now Use Token in Next Request

### Step 1: Go to Any Protected Endpoint
- Example: **Get Current User**
- Click it in left sidebar

### Step 2: Click Authorization Tab
```
┌─────────────────────────────────────────┐
│ Tabs: Params | Authorization | Headers  │
│                    ▲                    │
│                 CLICK HERE              │
└─────────────────────────────────────────┘
```

### Step 3: Select Bearer Token
```
┌─────────────────────────────────────────┐
│ Type: [Bearer Token ▼]                  │
│        ▲                                │
│     CLICK DROPDOWN                      │
└─────────────────────────────────────────┘
```

### Step 4: Enter Token Variable
```
┌─────────────────────────────────────────┐
│ Token: [{{token}}]                      │
│         ▲                               │
│      TYPE THIS                          │
└─────────────────────────────────────────┘
```

### Step 5: Send Request
- Click **Send** button
- You'll get response with your user data ✓

---

## Complete Flow Summary

```
1. Import Collection
   ↓
2. Find Authentication Folder (Left Sidebar)
   ↓
3. Click Login Request
   ↓
4. Click Send
   ↓
5. Copy Token from Response
   ↓
6. Token Auto-Saves to {{token}}
   ↓
7. Use {{token}} in Authorization Header
   ↓
8. Send Protected Requests ✓
```

---

## Troubleshooting: Can't Find Login

### Problem: No Collections in Left Sidebar
**Solution:**
- Click **Collections** tab (left sidebar)
- If empty, import the collection file

### Problem: No Authentication Folder
**Solution:**
- Import collection again
- Make sure file is: `EthioTravel_Complete_API.postman_collection.json`

### Problem: No Login Request
**Solution:**
- Create it manually (see above)
- Or re-import collection

### Problem: Can't Find Send Button
**Solution:**
- Look for blue **Send** button
- Usually top right of request area
- Or press **Ctrl+Enter**

---

## Quick Checklist

- [ ] Open Postman
- [ ] Import collection
- [ ] See Collections in left sidebar
- [ ] Expand Authentication folder
- [ ] Click Login request
- [ ] See request details on right
- [ ] Click Send button
- [ ] See response with token
- [ ] Token auto-saved to {{token}}
- [ ] Use {{token}} in other requests ✓

---

**Now you know exactly where to find Login! 🎉**
