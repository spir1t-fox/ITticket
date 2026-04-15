import React, { createContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase/clientApp'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Force token refresh to get latest custom claims
        await firebaseUser.getIdToken(true)
        
        // Get custom claims (role) from token
        const tokenResult = await firebaseUser.getIdTokenResult()
        const tokenRole = tokenResult.claims.role

        let userData = {}
        let userName = firebaseUser.displayName

        // Try to get user data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          if (userDoc.exists()) {
            userData = userDoc.data()
            console.log('AuthContext - Firestore user data found:', userData)
          } else {
            console.log('AuthContext - Firestore user document does not exist for uid:', firebaseUser.uid)
          }
        } catch (firestoreError) {
          console.error('AuthContext - Firestore fetch error:', firestoreError)
        }

        // Use token role if available, otherwise fall back to Firestore role
        const role = tokenRole || userData.role || 'user'

        const finalName = userData.name || userName || 'User'
        console.log('AuthContext - Final name:', finalName, { firestoreName: userData.name, authName: userName })

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: finalName,
          role: role
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      // Force token refresh to get latest custom claims
      await result.user.getIdToken(true)
      
      // Get custom claims (role) from token
      const tokenResult = await result.user.getIdTokenResult()
      const tokenRole = tokenResult.claims.role

      // Get user data from Firestore
      const userDocRef = doc(db, 'users', result.user.uid)
      const userDoc = await getDoc(userDocRef)
      const userData = userDoc.exists() ? userDoc.data() : {}

      // Use token role if available, otherwise fall back to Firestore role
      const role = tokenRole || userData.role || 'user'

      setUser({
        uid: result.user.uid,
        email: result.user.email,
        name: userData.name || result.user.displayName || 'User',
        role: role
      })

      return {
        uid: result.user.uid,
        email: result.user.email,
        name: userData.name || result.user.displayName || 'User',
        role: role
      }
    } catch (error) {
      throw error
    }
  }

  const signup = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update display name
      if (result.user) {
        await result.user.updateProfile({ displayName: name })
      }

      // Save user data to Firestore
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: name,
          role: 'user',
          createdAt: new Date().toISOString(),
          isActive: true
        })
        console.log('AuthContext - User saved to Firestore:', { uid: result.user.uid, name })
      } catch (firestoreError) {
        console.error('AuthContext - Failed to save user to Firestore:', firestoreError)
        // Don't fail signup if Firestore write fails
      }

      setUser({
        uid: result.user.uid,
        email: result.user.email,
        name: name,
        role: 'user'
      })

      return {
        uid: result.user.uid,
        email: result.user.email,
        name: userData.name || result.user.displayName || 'User',
        role: role
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
