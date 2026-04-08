import React from 'react'

export default function Loader({ size = 'medium' }) {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizes[size]}`}></div>
    </div>
  )
}
