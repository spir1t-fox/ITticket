import { useAuth } from '../../lib/hooks/useAuth'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { clientApp } from '../../lib/firebase/clientApp'
import { collection, onSnapshot } from 'firebase/firestore'
import Loader from '../../components/common/Loader'

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    onHold: 0,
    resolved: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const db = clientApp.firestore()
    const q = collection(db, 'tickets')

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
    })

    return () => unsubscribe()
  }, [])

  const adminActions = [
    {
      title: 'Create User',
      description: 'Add new users to the system',
      action: () => router.push('/admin/create-user'),
      color: 'bg-blue-500'
    },
    {
      title: 'View All Tickets',
      description: 'Manage all support tickets',
      action: () => router.push('/admin/view-tickets'),
      color: 'bg-green-500'
    },
    {
      title: 'System History',
      description: 'View system activity logs',
      action: () => router.push('/admin/history'),
      color: 'bg-gray-500'
    }
  ]

  if (loading) {
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.name}. Manage the ticket system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <div className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
        </div>
      </div>
    </Layout>
  )
}
