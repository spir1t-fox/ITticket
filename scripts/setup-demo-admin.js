// Standalone script to create demo admin user
// Run: node scripts/setup-demo-admin.js
// No need to start the server first!

const admin = require('firebase-admin');

// Initialize Firebase Admin with your credentials
const serviceAccount = {
  type: "service_account",
  project_id: "ticketingsystem-1204c",
  private_key_id: "c7c4045ecf2c4a1784f4225b057f9576e5fc8176",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIAGMUKmqaVFNR\nVgQiqJWyBbsdOTRlUGr2++3mYXGGF74TQZ8hEHTCNv/XFKMZd+TEonO3Uq1YHuMb\ntsyPGh4FuT/sslF6jct5DpF5AQ/RZDOI9mC5B54t7nhbq3Mzx5RepeYF++rjh0UV\n5esLzCBo0/jt6H910rs34YlbRZMmUgD40a7BWyhaVal1iWD9JCU7WVrQylnCsPvL\ngpnCRqVhTmEagbVQQHZtVaf3/XfOjAKPCDQHlY/8NQkCLShy0gAp97cORgGytJ4Y\nW7NhmAkVHOVGsoh94HcFlmUCL/kWP0aLA1tPgJ1/zIJRCDnwTAmg6Ciez409s0DC\njX9VEQ4rAgMBAAECggEAN4eD+tFcD8Vh7K9JLqZICcl1jkOXvJl7WV/RSam8b1Kg\nP5B0siVzhYjnt7vPHP8g0UeZgUi/QDwzKjqyyPijZUtt6DYKUVCVMeNNmJ8m2ShM\n9rYRXM40qOQRHsKXlcTP+QduujKboNip4c6YWAow5WoVL1jiKsB7oqRIEsNae8TD\nA6/NuwlPyHlQmz5WSB6JALuXQ4pF8WtTDEAFeKHrMSYOXNvS6OveDlIc3dMyTdzW\nYfHNCGwh0u4AAH3UFIbBMjm0342olQ2ozNKfqVhrdKHkFhIJeU3HR7lqGPDedAGm\nqvx2NkAFWtDHpXBKVWoVI6FeT0N2L9qsdPtwA/vgQQKBgQDwy1S/DS8LKy6i5yCr\nuGVi+0e9bacWVRVYTgwGVI+71X6E9FytoWft0KLeS8rvQxD24Awpxjsv6KmKe90T\nc9oVZM1uMGChR7RA27k4913qKH9qt603BIh8LnMFy/QEOqjcVEfxM6SqrJd2ZnHJ\nQR+pi0vRumgWZtWC0f/SjOQCqQKBgQDUoZouEvRq0fGauTGXofuwpWnpfBpLbHbw\npo7OgmBcsz5zCl6o9bbzgYPAnPIYbY3IOcJCRmbH3NjVJ6FzAA3XLBwPOOpFT56k\nj15glavJieNOqfJ44GVPHu/MIRbEOQ+KK27OTGTftSAwk8EoLTnYfb4T6iz5EmTp\nq8kWpTriswKBgQDJB1g3MJCH6INE6WUzN/0dB+A626LVWC87y9zqJArjrDe2VDRT\nmR8lQjvXDrvbyMgO87nz3lVnh/yTaxmEtgHqPn/rcGQcAbsRMt+OGabEaQ8HT1VD\nS3uPAVByFHYiWb7EQ3DUhGMDQpgo9xokBUSjzXF9JPzlRvEWCLBlXc62EQKBgDAK\nXwJf5/cmffbeNrUytOIBTX+iOXKnC+xtRUClNk5bdRWa1y5HbdFwhqsDCrO4NNtz\nKU++BkTLwfXO4WxRK89cuO47hrqoNYiql8Esr8Z2L/Q683yZ/mm07KrrIvCsj7VB\nAOT9X6EnlCFFkNOZ/ELMjiCDvSt9G22sEV/bbwV/AoGBAKKt8TWAX4gQcV+cabNR\nbyvJfcTUiaTNTUEc3cM7ZOCpP+C22baBs7h2RlRGVtiQBzEo4Vg0Ry8qpiiS0c8S\nHgtmyavXCZJV1cS9Fnpf9BeRBbBRX+0jm3WYQj6PoItiv5Ze7x92O5sjIjvsL2QU\n8+sGqwHlfGUnVfNrsn811wN0\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@ticketingsystem-1204c.iam.gserviceaccount.com",
  client_id: "117628995307401114108",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ticketingsystem-1204c.iam.gserviceaccount.com"
};

// Demo credentials
const DEMO_ADMIN = {
  email: 'demo@admin.com',
  password: 'demoadmin123',
  name: 'Demo Admin'
};

async function createDemoAdmin() {
  try {
    // Initialize the app
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const auth = admin.auth();
    const db = admin.firestore();

    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(DEMO_ADMIN.email);
      console.log('ℹ️ User already exists, updating password and role...');
      await auth.updateUser(userRecord.uid, { password: DEMO_ADMIN.password });
    } catch (error) {
      // User doesn't exist, create new
      console.log('🆕 Creating new admin user...');
      userRecord = await auth.createUser({
        email: DEMO_ADMIN.email,
        password: DEMO_ADMIN.password,
        displayName: DEMO_ADMIN.name
      });
    }

    // Set admin custom claim
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });

    // Save to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true
    }, { merge: true });

    console.log('✅ Demo admin created successfully!');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', DEMO_ADMIN.email);
    console.log('🔑 Password:', DEMO_ADMIN.password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🌐 Login at: http://localhost:3000/admin/login');
    console.log('');
    console.log('⚠️  After setup, delete this file for security');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('insufficient permissions')) {
      console.log('');
      console.log('💡 Check if your Firebase service account has proper permissions');
    }
  }
}

createDemoAdmin();
