import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/hooks/useAuth'
import Loader from '../components/common/Loader'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check user role and redirect accordingly
        if (user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/user/dashboard')
        }
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return <Loader />
  }

  return null
}
