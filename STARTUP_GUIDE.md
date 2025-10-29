# 🚀 Smart Parking System - Startup Guide

## Quick Start Instructions

### 1. Backend Setup (Spring Boot)

1. **Navigate to the project root directory**
2. **Start the Spring Boot application:**
   ```bash
   # Option 1: Using Maven
   ./mvnw spring-boot:run
   
   # Option 2: Using Gradle (if applicable)
   ./gradlew bootRun
   
   # Option 3: Using IDE
   # Run the main application class in your IDE
   ```

3. **Verify backend is running:**
   - Open browser and go to: `http://localhost:8080/api/health`
   - You should see: `{"status":"UP","timestamp":"...","service":"Parking Management API"}`

### 2. Frontend Setup (React)

1. **Navigate to the frontend directory:**
   ```bash
   cd parking-frontend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open browser and go to: `http://localhost:3000`

### 3. Initial Setup & Testing

1. **Create a test user:**
   - On the login page, click "Create Test User" button
   - This will create: Username: `admin`, Password: `Admin123!`

2. **Login with test credentials:**
   - Username: `admin`
   - Password: `Admin123!`

### 4. Troubleshooting

#### "Server error" on login page:
- ✅ Check if backend is running on port 8080
- ✅ Click "Test Connection" button on login page
- ✅ Verify no other application is using port 8080

#### "Cannot connect to server":
- ✅ Start the Spring Boot application first
- ✅ Check console for any startup errors
- ✅ Ensure port 8080 is not blocked by firewall

#### Database issues:
- ✅ The SQLite database will be created automatically
- ✅ Check if `parking_system.db` file is created in project root
- ✅ Database tables are initialized automatically

### 5. Default Ports
- **Backend (Spring Boot):** http://localhost:8080
- **Frontend (React):** http://localhost:3000

### 6. API Endpoints
- Health Check: `GET /api/health`
- Login: `POST /api/login`
- Register: `POST /api/register`
- Create Test User: `POST /api/debug/create-test-user`

## 🎯 Success Indicators
- ✅ Backend health check returns status "UP"
- ✅ Frontend loads without errors
- ✅ Login page displays properly
- ✅ Test user creation works
- ✅ Login with test credentials succeeds

## 📞 Need Help?
If you encounter issues:
1. Check the console logs for both frontend and backend
2. Verify all dependencies are installed
3. Ensure no port conflicts exist
4. Try restarting both applications