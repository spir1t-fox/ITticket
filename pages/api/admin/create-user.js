import { getFirestore, doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Initialize Firebase with client config for Firestore
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, name, role } = req.body
    
    console.log('Received request:', { email, name, role, hasPassword: !!password })

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Use Firebase Auth REST API to create user
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    console.log('API Key exists:', !!apiKey)
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Firebase API key not configured' })
    }
    
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
    
    console.log('Calling Firebase Auth REST API...')
    
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    })

    const authData = await authResponse.json()
    console.log('Firebase Auth response:', { status: authResponse.status, error: authData.error })

    if (!authResponse.ok) {
      console.error('Firebase Auth Error:', authData)
      return res.status(400).json({ 
        error: authData.error?.message || 'Failed to create user in Firebase Auth' 
      })
    }

    const uid = authData.localId
    console.log('User created with UID:', uid)

    // Store user data in Firestore using REST API (no SDK needed)
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users/${uid}?key=${apiKey}`
    
    console.log('Calling Firestore REST API...')
    
    const firestoreResponse = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          uid: { stringValue: uid },
          email: { stringValue: email },
          name: { stringValue: name },
          role: { stringValue: role },
          createdAt: { stringValue: new Date().toISOString() },
          isActive: { booleanValue: true }
        }
      })
    })

    if (!firestoreResponse.ok) {
      const firestoreError = await firestoreResponse.json()
      console.error('Firestore Error:', firestoreError)
      // Don't fail if Firestore write fails, user is already created
      return res.status(201).json({ 
        message: 'User created in Auth but failed to save to database',
        uid,
        warning: firestoreError.error?.message
      })
    }

    console.log('User data saved to Firestore successfully')

    res.status(201).json({ 
      message: 'User created successfully',
      uid
    })

  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: error.message || 'Failed to create user' })
  }
}
