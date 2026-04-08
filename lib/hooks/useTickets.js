import { useState, useEffect } from 'react'
import { clientDb } from '../firebase/firestore'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'

export function useTickets(userId = null, status = null) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = collection(clientDb, 'tickets')
    
    const constraints = []
    
    if (userId) {
      constraints.push(where('userId', '==', userId))
    }
    
    if (status) {
      if (Array.isArray(status)) {
        constraints.push(where('status', 'in', status))
      } else {
        constraints.push(where('status', '==', status))
      }
    }
    
    constraints.push(orderBy('createdAt', 'desc'))
    
    q = query(q, ...constraints)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTickets(ticketsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId, status])

  return { tickets, loading }
}

export function useTicketStats() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(clientDb, 'tickets'), (snapshot) => {
      const tickets = snapshot.docs.map(doc => doc.data())
      
      const newStats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length
      }
      
      setStats(newStats)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { stats, loading }
}
