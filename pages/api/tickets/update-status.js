import { adminApp } from '../../../lib/firebase/adminApp'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { ticketId, status, adminComment } = req.body

    if (!ticketId || !status) {
      return res.status(400).json({ error: 'Ticket ID and status are required' })
    }

    const adminDb = adminApp.firestore()
    
    // Update ticket status
    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    }

    if (adminComment) {
      updateData.adminComment = adminComment
    }

    await adminDb.collection('tickets').doc(ticketId).update(updateData)

    // Add to history if status is resolved or closed
    if (status === 'resolved' || status === 'closed') {
      await adminDb.collection('ticketHistory').add({
        ticketId,
        status,
        adminComment,
        updatedAt: new Date().toISOString()
      })
    }

    res.status(200).json({ message: 'Ticket updated successfully' })

  } catch (error) {
    console.error('Error updating ticket:', error)
    res.status(500).json({ error: error.message })
  }
}
