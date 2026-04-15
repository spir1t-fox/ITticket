import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="md:pl-72">
        <Header />
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
