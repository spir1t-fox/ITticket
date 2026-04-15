import { useAuth } from '../../lib/hooks/useAuth'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { clientApp } from '../../lib/firebase/clientApp'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import Loader from '../../components/common/Loader'

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    onHold: 0,
    resolved: 0
  })

  const quickActions = [
    {
      title: 'Raise New Ticket',
      description: 'Create a new support ticket',
      action: () => router.push('/user/raise-ticket'),
      color: 'bg-blue-500',
      route: '/user/raise-ticket'
    },
    {
      title: 'View My Tickets',
      description: 'See all your active tickets',
      action: () => router.push('/user/my-tickets'),
      color: 'bg-green-500',
      route: '/user/my-tickets'
    },
    {
      title: 'Ticket History',
      description: 'View resolved and closed tickets',
      action: () => router.push('/user/history'),
      color: 'bg-gray-500',
      route: '/user/history'
    }
  ]

  useEffect(() => {
    if (authLoading) return
    
    if (!user?.uid) {
      setLoading(false)
      return
    }

    const db = clientApp.firestore()
    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => doc.data())
      
      setStats({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'inprogress').length,
        onHold: tickets.filter(t => t.status === 'onhold').length,
        resolved: tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length
      })
      setLoading(false)
    }, (error) => {
      console.error('Error fetching tickets:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.uid])

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
            <p className="mt-2 text-gray-600">Have a productive day !</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Tickets</div>
              </div>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
                <div className="text-sm text-gray-600">Open</div>
              </div>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.onHold}</div>
                <div className="text-sm text-gray-600">On Hold</div>
              </div>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" >
              <div className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <div className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
