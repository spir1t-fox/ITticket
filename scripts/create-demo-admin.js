// Run this script to create demo admin user
// Usage: node scripts/create-demo-admin.js

const fetch = require('node-fetch');

const DEMO_ADMIN = {
  email: 'demo@admin.com',
  password: 'demoadmin123',
  name: 'Demo Admin',
  setupKey: 'temp-setup-key-12345'
};

async function createDemoAdmin() {
  try {
    const response = await fetch('http://localhost:3000/api/setup-create-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEMO_ADMIN)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Demo admin created successfully!');
      console.log('');
      console.log('📧 Email:', DEMO_ADMIN.email);
      console.log('🔑 Password:', DEMO_ADMIN.password);
      console.log('');
      console.log('🌐 Login at: http://localhost:3000/admin/login');
    } else {
      console.error('❌ Error:', data.error || 'Failed to create admin');
      console.log('');
      console.log('Make sure:');
      console.log('1. Server is running (npm run dev)');
      console.log('2. You are in the correct directory');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('');
    console.log('Make sure the server is running on http://localhost:3000');
  }
}

createDemoAdmin();
