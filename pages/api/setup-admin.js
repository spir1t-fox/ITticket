import { adminApp } from '../../lib/firebase/adminApp'
import { getAuth } from 'firebase-admin/auth'

// This endpoint allows setting admin role using a setup key
// Use this ONCE to set up your first admin user
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, setupKey } = req.body

    // Simple security - use a temporary setup key from env
    // Set SETUP_KEY in .env.local temporarily for initial setup
    if (setupKey !== process.env.SETUP_KEY) {
      return res.status(401).json({ error: 'Invalid setup key' })
    }

    const auth = getAuth(adminApp)
    
    // Find user by email
    const userRecord = await auth.getUserByEmail(email)
    
    // Set admin role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' })

    // Update Firestore
    const adminDb = adminApp.firestore()
    await adminDb.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || email.split('@')[0],
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true
    }, { merge: true })

    res.status(200).json({ 
      message: 'Admin role set successfully',
      uid: userRecord.uid,
      email: userRecord.email
    })

  } catch (error) {
    console.error('Error setting admin:', error)
    res.status(500).json({ error: error.message })
  }
}
