import React, { useState, useEffect } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import { clientApp } from '../../lib/firebase/clientApp'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import Card from '../common/Card'
import Loader from '../common/Loader'
import Button from '../common/Button'
import { useRouter } from 'next/router'

export default function UserHistoryList() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    if (authLoading) {
      return
    }

    const uid = user?.uid

    if (!uid) {
      setTickets([])
      setLoading(false)
      setError('')
      return
    }

    setError('')

    const db = clientApp.firestore()
    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', uid)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ticketsData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((t) => ['resolved', 'closed'].includes(t.status))
          .sort((a, b) => {
            const at = a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0
            const bt = b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0
            return bt - at
          })

        setTickets(ticketsData)
        setLoading(false)
      },
      (err) => {
        setError(err?.message || 'Failed to load history.')
        setTickets([])
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [authLoading, user?.uid])

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    // Search filter based on selected field
    let matchesSearch = true
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      if (searchField === 'title') {
        matchesSearch = ticket.title?.toLowerCase().includes(searchLower)
      } else if (searchField === 'category') {
        matchesSearch = ticket.category?.toLowerCase().includes(searchLower) || ticket.subcategory?.toLowerCase().includes(searchLower)
      } else if (searchField === 'all') {
        matchesSearch = 
          ticket.title?.toLowerCase().includes(searchLower) ||
          ticket.subcategory?.toLowerCase().includes(searchLower) ||
          ticket.category?.toLowerCase().includes(searchLower)
      }
    }
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    
    // Date filter (use updatedAt for history)
    let matchesDate = true
    const ticketDate = ticket.updatedAt?.toDate?.() || ticket.createdAt?.toDate?.()
    if (ticketDate && dateFilter !== 'all') {
      const now = new Date()
      const monthsAgo = parseInt(dateFilter)
      const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate())
      matchesDate = ticketDate >= cutoffDate
    }
    
    return matchesSearch && matchesPriority && matchesStatus && matchesDate
  })

  if (authLoading || loading) return <Loader />

  return (
    <Card>
      <div className="p-6">
        {/* Header with Title and New Ticket Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-900">My Ticket History</h2>
          <Button onClick={() => router.push('/user/raise-ticket')}>
            New Ticket
          </Button>
        </div>

        {/* Filters Bar */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search Field Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Search By</label>
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Fields</option>
                <option value="title">Title</option>
                <option value="category">Category</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
              <input
                type="text"
                placeholder="Enter search term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="1">Last 1 Month</option>
                <option value="3">Last 3 Months</option>
                <option value="6">Last 6 Months</option>
                <option value="12">Last 1 Year</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSearchField('all')
                  setPriorityFilter('all')
                  setStatusFilter('all')
                  setDateFilter('all')
                }}
                className="w-full px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-xs text-gray-500">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {tickets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-gray-500 mb-4">No resolved or closed tickets found.</p>
            <Button onClick={() => router.push('/user/raise-ticket')}>
              Create Your First Ticket
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ticket Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category / Issue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Resolved Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{ticket.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate mt-1">{ticket.description}</div>
                      {ticket.adminComment && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-800 border border-green-100">
                          <strong>Resolution:</strong> {ticket.adminComment}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ticket.subcategory}</div>
                      <div className="text-xs text-gray-500">{ticket.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.updatedAt?.toDate?.()?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}
