import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_FIREBASE_API_KEY environment variable.\n' +
    'Please create a .env.local file in your project root with your Firebase configuration.\n' +
    'See .env.example for the required variables.'
  )
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Export the app instance with auth and db attached
const clientApp = app
clientApp.auth = auth
clientApp.firestore = () => db

export { clientApp, auth, db }
