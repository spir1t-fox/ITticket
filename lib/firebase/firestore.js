import { clientApp } from './clientApp'
import { adminApp } from './adminApp'

// Client-side Firestore instance
export const clientDb = clientApp.firestore()

// Admin-side Firestore instance
export const adminDb = adminApp.firestore()

// Helper functions for common operations
export const firestoreHelpers = {
  // Create a document
  async createDoc(collection, data) {
    const docRef = await clientDb.collection(collection).add(data)
    return docRef.id
  },

  // Read a document
  async getDoc(collection, docId) {
    const doc = await clientDb.collection(collection).doc(docId).get()
    return doc.exists ? { id: doc.id, ...doc.data() } : null
  },

  // Update a document
  async updateDoc(collection, docId, data) {
    await clientDb.collection(collection).doc(docId).update(data)
  },

  // Delete a document
  async deleteDoc(collection, docId) {
    await clientDb.collection(collection).doc(docId).delete()
  },

  // Query documents
  async queryCollection(collection, constraints = []) {
    let query = clientDb.collection(collection)
    constraints.forEach(constraint => {
      query = query.where(constraint.field, constraint.operator, constraint.value)
    })
    const snapshot = await query.get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
}
