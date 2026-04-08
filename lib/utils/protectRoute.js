import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { isAdmin } from './roles'

export function withAuth(WrappedComponent, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login')
          return
        }

        if (requiredRole && user.role !== requiredRole) {
          // Redirect based on user role
          if (isAdmin(user)) {
            router.push('/admin/dashboard')
          } else {
            router.push('/user/dashboard')
          }
          return
        }
      }
    }, [user, loading, router, requiredRole])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    if (!user) {
      return null
    }

    if (requiredRole && user.role !== requiredRole) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

export function protectAdminRoute(WrappedComponent) {
  return withAuth(WrappedComponent, 'admin')
}

export function protectUserRoute(WrappedComponent) {
  return withAuth(WrappedComponent, 'user')
}

export function protectAnyAuthenticatedRoute(WrappedComponent) {
  return withAuth(WrappedComponent)
}

// Hook for route protection
export function useRouteProtection(requiredRole = null) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        if (isAdmin(user)) {
          router.push('/admin/dashboard')
        } else {
          router.push('/user/dashboard')
        }
        return
      }
    }
  }, [user, loading, router, requiredRole])

  return { user, loading, isAuthorized: !loading && user && (!requiredRole || user.role === requiredRole) }
}
