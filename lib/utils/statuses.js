export const TICKET_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
}

export const TICKET_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

export const getStatusColor = (status) => {
  switch (status) {
    case TICKET_STATUSES.OPEN:
      return 'bg-yellow-100 text-yellow-800'
    case TICKET_STATUSES.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800'
    case TICKET_STATUSES.RESOLVED:
      return 'bg-green-100 text-green-800'
    case TICKET_STATUSES.CLOSED:
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getPriorityColor = (priority) => {
  switch (priority) {
    case TICKET_PRIORITIES.LOW:
      return 'bg-gray-100 text-gray-800'
    case TICKET_PRIORITIES.MEDIUM:
      return 'bg-blue-100 text-blue-800'
    case TICKET_PRIORITIES.HIGH:
      return 'bg-orange-100 text-orange-800'
    case TICKET_PRIORITIES.URGENT:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getStatusLabel = (status) => {
  switch (status) {
    case TICKET_STATUSES.OPEN:
      return 'Open'
    case TICKET_STATUSES.IN_PROGRESS:
      return 'In Progress'
    case TICKET_STATUSES.RESOLVED:
      return 'Resolved'
    case TICKET_STATUSES.CLOSED:
      return 'Closed'
    default:
      return status
  }
}

export const getPriorityLabel = (priority) => {
  switch (priority) {
    case TICKET_PRIORITIES.LOW:
      return 'Low'
    case TICKET_PRIORITIES.MEDIUM:
      return 'Medium'
    case TICKET_PRIORITIES.HIGH:
      return 'High'
    case TICKET_PRIORITIES.URGENT:
      return 'Urgent'
    default:
      return priority
  }
}
