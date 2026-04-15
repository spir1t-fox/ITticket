import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/hooks/useAuth'
import { auth } from '../lib/firebase/clientApp'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, logout } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)

      // Check if user is admin - admins should not login via user login
      if (user.role === 'admin') {
        await logout()
        setError('Admin accounts must use the admin login page.')
        return
      }

      router.push('/')
    } catch (err) {
      setError('Failed to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            User Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your tickets and submit new requests
          </p>
        </div>
        <Card className="p-8 shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full py-3">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                onClick={() => router.push('/admin/login')}
              >
                Admin Login
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
