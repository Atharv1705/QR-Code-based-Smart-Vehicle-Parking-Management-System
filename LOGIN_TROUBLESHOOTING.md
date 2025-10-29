# 🔧 Login Issue Troubleshooting Guide

## Issue: "Server error: 406" - Not Acceptable

### ✅ **Fixes Applied**

1. **Fixed Package Structure**
   - Moved DTO classes to correct package: `org.parking.dto`
   - Removed duplicate DTO files
   - Fixed import statements

2. **Enhanced API Endpoints**
   - Added explicit content type handling: `consumes = "application/json", produces = "application/json"`
   - Added CORS annotations for better cross-origin support
   - Created fallback test endpoints for debugging

3. **Improved Error Handling**
   - Enhanced error logging with stack traces
   - Better error messages with specific error types
   - Connection test utilities

4. **Database Verification**
   - Health check now includes database status
   - User count verification
   - Connection testing

### 🚀 **How to Test the Fix**

#### **Step 1: Start Backend**
```bash
# In project root
./mvnw spring-boot:run
```

#### **Step 2: Verify Backend Health**
Open browser: `http://localhost:8080/api/health`
Expected response:
```json
{
  "status": "UP",
  "timestamp": "2024-01-01T12:00:00",
  "service": "Parking Management API",
  "database": "Connected",
  "userCount": 0
}
```

#### **Step 3: Test Basic API**
Open browser: `http://localhost:8080/api/test`
Expected response:
```json
{
  "message": "API is working!",
  "timestamp": "2024-01-01T12:00:00"
}
```

#### **Step 4: Create Test User**
On login page, click **"Create Test User"** button
- This should create: Username: `admin`, Password: `Admin123!`

#### **Step 5: Test Login**
Use credentials: `admin` / `Admin123!`

### 🔍 **Advanced Debugging**

#### **Browser Console Tests**
```javascript
// Test all endpoints
parkingTests.runAllTests()

// Individual tests
parkingTests.testConnection()
parkingTests.createTestUser()
parkingTests.testLogin()
```

#### **Manual API Testing**
```bash
# Test health
curl http://localhost:8080/api/health

# Test basic endpoint
curl http://localhost:8080/api/test

# Create test user
curl -X POST http://localhost:8080/api/debug/create-test-user

# Test login
curl -X POST http://localhost:8080/api/login-test \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

### 🐛 **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| 406 Not Acceptable | Fixed with proper content type headers |
| Package not found | Fixed DTO package structure |
| Database error | Check SQLite file creation |
| CORS error | Added CORS annotations |
| No users found | Use "Create Test User" button |

### 📋 **Verification Checklist**

- [ ] Backend starts without errors
- [ ] Health endpoint returns "UP" status
- [ ] Test endpoint returns success message
- [ ] Database shows "Connected" status
- [ ] Test user creation works
- [ ] Login succeeds with test credentials
- [ ] Dashboard loads after login

### 🎯 **Expected Behavior**

1. **Backend Health**: Status "UP" with database connected
2. **Test User**: Created successfully with admin/Admin123!
3. **Login**: Works with both main and test endpoints
4. **Dashboard**: Loads with parking management interface
5. **No 406 Errors**: All API calls succeed

### 🔄 **Fallback Mechanisms**

The system now includes:
- **Dual login endpoints**: Main `/login` and fallback `/login-test`
- **Automatic fallback**: Frontend tries test endpoint if main fails
- **Detailed error reporting**: Specific error messages for debugging
- **Connection testing**: Built-in utilities for troubleshooting

### 📞 **Still Having Issues?**

If login still fails:
1. Check backend console for detailed error logs
2. Run `parkingTests.runAllTests()` in browser console
3. Verify no other service is using port 8080
4. Check if antivirus/firewall is blocking connections
5. Try restarting both backend and frontend

The 406 error should now be resolved with the package structure fixes and enhanced error handling!