import { useState } from 'react'

export function useCategories() {
  const [categories] = useState([
    'Technical Support',
    'Account Issues',
    'Billing',
    'Feature Request',
    'Bug Report',
    'Other'
  ])

  return { categories }
}

export function usePriorities() {
  const [priorities] = useState([
    { value: 'low', label: 'Low', color: 'gray' },
    { value: 'medium', label: 'Medium', color: 'blue' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' }
  ])

  return { priorities }
}

export function useStatuses() {
  const [statuses] = useState([
    { value: 'open', label: 'Open', color: 'yellow' },
    { value: 'in-progress', label: 'In Progress', color: 'blue' },
    { value: 'resolved', label: 'Resolved', color: 'green' },
    { value: 'closed', label: 'Closed', color: 'gray' }
  ])

  return { statuses }
}
