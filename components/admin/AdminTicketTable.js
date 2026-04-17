import React, { useState, useEffect } from 'react'
import { clientApp } from '../../lib/firebase/clientApp'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where } from 'firebase/firestore'
import Card from '../common/Card'
import Button from '../common/Button'
import Loader from '../common/Loader'
import Toast from '../common/Toast'
import { priorityColors, priorityLabels } from '../../lib/utils/subcategories'

export default function AdminTicketTable() {
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const [pendingStatus, setPendingStatus] = useState(null)
  const [pendingTicketId, setPendingTicketId] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const db = clientApp.firestore()
    const q = query(
      collection(db, 'tickets'),
      where('status', 'not-in', ['resolved', 'closed'])
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // Sort by priority (urgent > high > medium > low)
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      ticketsData.sort((a, b) => {
        const priorityDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
        if (priorityDiff !== 0) return priorityDiff
        // If same priority, sort by createdAt (newest first)
        return b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.() || 0
      })
      setTickets(ticketsData)
      setFilteredTickets(ticketsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching tickets:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    let filtered = tickets

    // Search filter based on selected field
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(ticket => {
        if (searchField === 'title') {
          return ticket.title?.toLowerCase().includes(searchLower)
        } else if (searchField === 'user') {
          return ticket.userName?.toLowerCase().includes(searchLower) || ticket.userEmail?.toLowerCase().includes(searchLower)
        } else if (searchField === 'category') {
          return ticket.category?.toLowerCase().includes(searchLower) || ticket.subcategory?.toLowerCase().includes(searchLower)
        } else if (searchField === 'all') {
          return ticket.title?.toLowerCase().includes(searchLower) ||
            ticket.subcategory?.toLowerCase().includes(searchLower) ||
            ticket.category?.toLowerCase().includes(searchLower) ||
            ticket.userName?.toLowerCase().includes(searchLower) ||
            ticket.userEmail?.toLowerCase().includes(searchLower)
        }
        return true
      })
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const monthsAgo = parseInt(dateFilter)
      const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate())
      filtered = filtered.filter(ticket => {
        const ticketDate = ticket.createdAt?.toDate?.()
        return ticketDate && ticketDate >= cutoffDate
      })
    }

    setFilteredTickets(filtered)
  }, [searchTerm, searchField, priorityFilter, statusFilter, dateFilter, tickets])

  const handleStatusChange = (ticketId, newStatus) => {
    setPendingTicketId(ticketId)
    setPendingStatus(newStatus)
    setShowConfirm(true)
  }

  const confirmStatusChange = async () => {
    await updateTicketStatus(pendingTicketId, pendingStatus, `Status changed to ${pendingStatus}`)
    setShowConfirm(false)
    setPendingStatus(null)
    setPendingTicketId(null)
  }

  const cancelStatusChange = () => {
    setShowConfirm(false)
    setPendingStatus(null)
    setPendingTicketId(null)
  }

  const updateTicketStatus = async (ticketId, newStatus, adminComment = '') => {
    try {
      const db = clientApp.firestore()
      const ticketRef = doc(db, 'tickets', ticketId)
      
      await updateDoc(ticketRef, {
        status: newStatus,
        adminComment,
        updatedAt: new Date()
      })

      setToastMessage(`Ticket status updated to ${newStatus}`)
      setToastType('success')
      setShowToast(true)

    } catch (error) {
      setToastMessage('Failed to update ticket status')
      setToastType('error')
      setShowToast(true)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      case 'inprogress':
        return 'bg-blue-100 text-blue-800'
      case 'onhold':
        return 'bg-orange-100 text-orange-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Card>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
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
                  <option value="user">User</option>
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
                  <option value="open">Open</option>
                  <option value="inprogress">In Progress</option>
                  <option value="onhold">On Hold</option>
                  
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
          
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tickets found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category / Issue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.userName}</div>
                        <div className="text-sm text-gray-500">{ticket.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ticket.category}</div>
                        <div className="text-sm text-gray-500">{ticket.subcategory || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[ticket.priority] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {priorityLabels[ticket.priority] || ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.createdAt?.toDate()?.toLocaleDateString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={ticket.status === 'closed' ? 'resolved' : ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="open">Open</option>
                          <option value="inprogress">In Progress</option>
                          <option value="onhold">On Hold</option>
                          <option value="resolved">Resolved/Close</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Status Change</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to change the ticket status to <strong>{pendingStatus}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={cancelStatusChange}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmStatusChange}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
