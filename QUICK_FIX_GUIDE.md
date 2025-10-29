# 🚀 Quick Fix for "Server error. Please try again."

## ✅ Backend is Running (Port 8080 is active)

The backend Spring Boot application is running on port 8080. The issue is likely with API configuration or database initialization.

## 🔧 Immediate Solutions

### Step 1: Test Backend Health
Open your browser and go to:
```
http://localhost:8080/api/health
```

**Expected Response:**
```json
{
  "status": "UP",
  "timestamp": "...",
  "service": "Parking Management API",
  "database": "Connected",
  "userCount": 0
}
```

### Step 2: Test Basic API
```
http://localhost:8080/api/test
```

**Expected Response:**
```json
{
  "message": "API is working!",
  "timestamp": "..."
}
```

### Step 3: Create Test User
On the login page, click the **"Create Test User"** button at the bottom.

### Step 4: Use Test Credentials
- **Username:** `admin`
- **Password:** `Admin123!`

## 🐛 If Still Getting Errors

### Browser Console Debug
1. Press `F12` to open Developer Tools
2. Go to Console tab
3. Type and run:
```javascript
parkingTests.runAllTests()
```

### Manual API Test
1. Open a new browser tab
2. Go to: `http://localhost:8080/api/health`
3. If you see JSON response, the API is working

## 🔄 Restart Instructions

If the above doesn't work:

### Restart Backend
```bash
# Stop the current process (Ctrl+C in the terminal running Spring Boot)
# Then restart:
./mvnw spring-boot:run
```

### Restart Frontend
```bash
# In parking-frontend directory
npm start
```

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Backend has CORS configured for localhost:3000 |
| 404 Not Found | Check if you're using correct URL paths |
| 500 Server Error | Check backend console for error logs |
| Database Error | SQLite database will be created automatically |

## 🎯 Success Indicators

- ✅ Health endpoint returns status "UP"
- ✅ Test user creation succeeds
- ✅ Login works with admin/Admin123!
- ✅ Dashboard loads after login

Try these steps in order and let me know which step fails!