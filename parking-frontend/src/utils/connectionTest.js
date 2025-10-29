// Connection Test Utility
// You can run these functions in the browser console to test the backend connection

const API_BASE_URL = 'http://localhost:8080/api';

// Test if backend is running
export const testConnection = async () => {
  try {
    // Test simple endpoint first
    const testResponse = await fetch(`${API_BASE_URL}/test`);
    const testData = await testResponse.json();
    console.log('✅ Basic API test:', testData);
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    return { success: true, test: testData, health: healthData };
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Create test user
export const createTestUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/debug/create-test-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('Test user creation result:', data);
    return data;
  } catch (error) {
    console.error('❌ Test user creation failed:', error);
    return { success: false, error: error.message };
  }
};

// Test login with credentials
export const testLogin = async (username = 'admin', password = 'Admin123!') => {
  try {
    // Try main login endpoint
    let response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    let data = await response.json();
    console.log('Main login test result:', data);
    
    // If main login fails, try test endpoint
    if (!data.success) {
      console.log('Trying test login endpoint...');
      response = await fetch(`${API_BASE_URL}/login-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      data = await response.json();
      console.log('Test login result:', data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return { success: false, error: error.message };
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🧪 Running connection tests...');
  
  console.log('\n1. Testing backend connection...');
  const connectionTest = await testConnection();
  
  if (connectionTest.success) {
    console.log('\n2. Creating test user...');
    await createTestUser();
    
    console.log('\n3. Testing login...');
    await testLogin();
  }
  
  console.log('\n✅ Tests completed!');
};

// Make functions available globally for console use
if (typeof window !== 'undefined') {
  window.parkingTests = {
    testConnection,
    createTestUser,
    testLogin,
    runAllTests,
  };
  
  console.log('🔧 Parking system test utilities loaded!');
  console.log('Available functions:');
  console.log('- parkingTests.testConnection()');
  console.log('- parkingTests.createTestUser()');
  console.log('- parkingTests.testLogin()');
  console.log('- parkingTests.runAllTests()');
}