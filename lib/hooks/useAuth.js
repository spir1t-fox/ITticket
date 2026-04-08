import { useState, useEffect, useContext } from 'react'
import { auth, db } from '../firebase/clientApp'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import AuthContext from '../context/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthListener() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.exists() ? userDoc.data() : {}
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name || firebaseUser.displayName || 'User',
          role: userData.role || 'user'
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, loading }
}
