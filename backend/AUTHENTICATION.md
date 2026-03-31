## 🔐 GDG Event Management System - Backend Authentication Guide

### Overview
This backend implements a secure authentication system where only **ONE ADMIN** can manage events, while all users can view them publicly.

---

## 📋 Admin Credentials

**Email:** `admin@gmail.com`  
**Password:** `admin123`

> ⚠️ **IMPORTANT:** Change these credentials in production!

---

## 🚀 Getting Started

### 1. **Seed Admin (First Time Only)**
Run this command once to create the admin user in MongoDB:

```bash
npm run seed
```

Or add this script to `package.json`:
```json
"scripts": {
  "start": "node server.js",
  "seed": "node seedAdmin.js"
}
```

### 2. **Start the Backend**
```bash
npm start
```

Backend runs on: `http://localhost:5000`

---

## 🔑 API Endpoints

### 1. **Admin Login** (PUBLIC)
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": "admin"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'
```

---

### 2. **Get All Events** (PUBLIC)
**Endpoint:** `GET /api/events`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Web Development Workshop",
    "description": "Learn modern web development",
    "startDate": "2026-04-01T09:30:00Z",
    "endDate": "2026-04-01T11:30:00Z",
    "location": "Room 101",
    "organizer": "GDG Team",
    "image": "/uploads/event-image.jpg",
    "locationType": "offline"
  }
]
```

**cURL Example:**
```bash
curl http://localhost:5000/api/events
```

---

### 3. **Create Event** (ADMIN ONLY)
**Endpoint:** `POST /api/events`

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>
Content-Type: multipart/form-data
```

**Form Fields:**
- `title` (required): Event name
- `description` (required): Event description
- `startDate` (required): ISO date string (e.g., 2026-04-01T09:30:00Z)
- `endDate` (required): ISO date string
- `location` (optional): Event location
- `department` (optional): Department name
- `organizer` (optional): Organizer name
- `locationType` (optional): "online" or "offline"
- `image` (optional): Image file (max 5MB, images only)

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=AI Workshop" \
  -F "description=Learn AI and Machine Learning" \
  -F "startDate=2026-04-15T10:00:00Z" \
  -F "endDate=2026-04-15T12:00:00Z" \
  -F "location=Main Hall" \
  -F "organizer=GDG" \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "AI Workshop",
  "description": "Learn AI and Machine Learning",
  "startDate": "2026-04-15T10:00:00Z",
  "endDate": "2026-04-15T12:00:00Z",
  "location": "Main Hall",
  "organizer": "GDG",
  "image": "/uploads/1711900000000-ai-workshop.jpg",
  "locationType": "offline"
}
```

---

### 4. **Delete Event** (ADMIN ONLY)
**Endpoint:** `DELETE /api/events/:id`

**Headers Required:**
```
Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/events/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. **Get Single Event** (PUBLIC)
**Endpoint:** `GET /api/events/:id`

**Response:** Single event object

**cURL Example:**
```bash
curl http://localhost:5000/api/events/507f1f77bcf86cd799439011
```

---

## 🔐 How Authentication Works

### 1. **Login Process**
```
User sends email & password → Server validates → JWT token generated → Token returned
```

### 2. **Using the Token**
```
Client stores JWT token (localStorage, sessionStorage, etc.)
Client includes token in "Authorization: Bearer <token>" header for protected routes
Server verifies token and allows access to protected routes
```

### 3. **Token Expiration**
- Default expiration: **7 days**
- After expiration, user must login again

---

## 📝 JWT Token Structure

The JWT token contains:
```json
{
  "id": "admin_id",
  "email": "admin@gmail.com",
  "name": "Admin",
  "role": "admin",
  "iat": 1711900000,
  "exp": 1712505000
}
```

---

## 🛡️ Security Features

✅ **Password Hashing:** Passwords are hashed using bcryptjs (10 salt rounds)  
✅ **JWT Verification:** Tokens are verified on every protected request  
✅ **Role-Based Access:** Only users with "admin" role can create/delete events  
✅ **Email Validation:** Admin identified by unique email  
✅ **Error Handling:** Generic error messages prevent user enumeration  

---

## 📂 Folder Structure

```
backend/
├── models/
│   ├── Admin.js           # Admin schema with password hashing
│   ├── Event.js
│   └── Registration.js
├── controllers/
│   ├── authController.js  # Login logic
│   ├── eventController.js
│   └── registrationController.js
├── routes/
│   ├── authRoutes.js      # /api/auth endpoints
│   ├── eventRoutes.js
│   └── registrationRoutes.js
├── middleware/
│   └── auth.js            # JWT verification & role checking
├── config/
│   └── db.js              # MongoDB connection
├── seedAdmin.js           # Admin creation script
├── server.js              # Express server setup
├── .env                   # Environment variables
└── package.json
```

---

## 🔧 Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CORS_ORIGIN=http://localhost:8080,http://127.0.0.1:5173
```

You can copy [backend/.env.example](backend/.env.example) to [backend/.env](backend/.env) and update values for your environment.

---

## 💻 Frontend Integration

### 1. **Login Example (JavaScript/React)**

```javascript
async function loginAdmin() {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@gmail.com',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  if (response.ok) {
    // Store token in localStorage
    localStorage.setItem('adminToken', data.token);
    console.log('Login successful!');
  }
}
```

### 2. **Create Event Example**

```javascript
async function createEvent(eventData, imageFile) {
  const formData = new FormData();
  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append('startDate', eventData.startDate);
  formData.append('endDate', eventData.endDate);
  formData.append('location', eventData.location);
  formData.append('organizer', eventData.organizer);
  if (imageFile) formData.append('image', imageFile);

  const token = localStorage.getItem('adminToken');
  
  const response = await fetch('http://localhost:5000/api/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const result = await response.json();
  return result;
}
```

### 3. **Fetch Public Events**

```javascript
async function getPublicEvents() {
  const response = await fetch('http://localhost:5000/api/events');
  const events = await response.json();
  return events;
}
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Admin access required"
**Cause:** JWT token is missing or invalid  
**Solution:** 
1. Login first to get a valid token
2. Include the token in `Authorization: Bearer <token>` header
3. Ensure token hasn't expired

### Issue: "Invalid email or password"
**Cause:** Wrong credentials provided  
**Solution:** Use `admin@gmail.com` / `admin123` for default admin

### Issue: "Admin already exists"
**Cause:** Admin was already seeded  
**Solution:** This is normal - admin is created once and reused

---

## 🚀 Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Change default admin password
- [ ] Set MONGO_URI to production database
- [ ] Enable HTTPS
- [ ] Set CORS to allow only your frontend domain
- [ ] Add rate limiting to login endpoint
- [ ] Add logging for security events
- [ ] Implement password reset functionality
- [ ] Use environment-specific configs

---

## 📚 Additional Notes

- Only one admin account exists - this is by design
- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- All event creation/deletion requires admin authentication
- Event viewing is completely public (no authentication needed)

---

**Backend Version:** 1.0.0  
**Last Updated:** March 31, 2026  
**Creator:** GDG Event Management System
