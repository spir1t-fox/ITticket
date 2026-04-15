export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
}

export const hasRole = (user, requiredRole) => {
  if (!user || !user.role) return false
  return user.role === requiredRole
}

export const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN)
}

export const isUser = (user) => {
  return hasRole(user, ROLES.USER)
}

export const canAccessAdminPanel = (user) => {
  return isAdmin(user)
}

export const canCreateTicket = (user) => {
  return !!user // Any authenticated user can create tickets
}

export const canViewAllTickets = (user) => {
  return isAdmin(user)
}

export const canManageUsers = (user) => {
  return isAdmin(user)
}
