import React from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../lib/hooks/useAuth'
import Button from '../common/Button'

export default function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">FlowDesk</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.name}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
              {user?.role}
            </span>
           
          </div>
        </div>
      </div>
    </header>
  )
}
