// Simple Backend Health Check Script
// Run this with: node check-backend.js

const http = require('http');

function checkEndpoint(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: `/api${path}`,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${description}: ${res.statusCode}`);
          console.log(`   Response:`, json);
          resolve({ success: true, data: json });
        } catch (e) {
          console.log(`⚠️  ${description}: ${res.statusCode} (Invalid JSON)`);
          console.log(`   Raw response:`, data);
          resolve({ success: false, error: 'Invalid JSON' });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${description}: Connection failed`);
      console.log(`   Error:`, err.message);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ ${description}: Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function runChecks() {
  console.log('🔍 Checking Backend Health...\n');
  
  const checks = [
    ['/test', 'Basic API Test'],
    ['/health', 'Health Check'],
  ];

  for (const [path, description] of checks) {
    await checkEndpoint(path, description);
    console.log('');
  }

  // Test user creation
  console.log('🧪 Testing User Creation...');
  const userCreation = await testUserCreation();
  console.log('');

  // Test login
  if (userCreation.success) {
    console.log('🔐 Testing Login...');
    await testLogin();
  }
}

function testUserCreation() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/debug/create-test-user',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ User Creation: ${res.statusCode}`);
          console.log(`   Response:`, json);
          resolve({ success: true, data: json });
        } catch (e) {
          console.log(`⚠️  User Creation: ${res.statusCode} (Invalid JSON)`);
          resolve({ success: false, error: 'Invalid JSON' });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ User Creation: Connection failed`);
      console.log(`   Error:`, err.message);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ User Creation: Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

function testLogin() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'Admin123!'
    });
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/login-test',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ Login Test: ${res.statusCode}`);
          console.log(`   Response:`, json);
          resolve({ success: true, data: json });
        } catch (e) {
          console.log(`⚠️  Login Test: ${res.statusCode} (Invalid JSON)`);
          resolve({ success: false, error: 'Invalid JSON' });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ Login Test: Connection failed`);
      console.log(`   Error:`, err.message);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log(`⏰ Login Test: Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

// Run the checks
runChecks().then(() => {
  console.log('🏁 Backend health check completed!');
}).catch((err) => {
  console.error('💥 Health check failed:', err);
});