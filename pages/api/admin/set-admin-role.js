import { adminApp } from '../../../lib/firebase/adminApp'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    if (!adminApp.apps || adminApp.apps.length === 0) {
      return res.status(500).json({ error: 'Firebase Admin SDK not configured' })
    }

    const auth = adminApp.auth()
    const db = adminApp.firestore()

    // Get user by email
    const userRecord = await auth.getUserByEmail(email)

    // Set admin custom claims
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' })

    // Update Firestore
    await db.collection('users').doc(userRecord.uid).set({
      role: 'admin'
    }, { merge: true })

    res.status(200).json({
      message: 'Admin role set successfully',
      uid: userRecord.uid,
      email: userRecord.email
    })

  } catch (error) {
    console.error('Error setting admin role:', error)
    res.status(500).json({ error: error.message })
  }
}