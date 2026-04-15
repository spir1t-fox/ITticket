import React from 'react'

export default function Card({ children, className = '', onClick }) {
  const baseClasses = `bg-white overflow-hidden shadow rounded-lg ${className}`
  
  if (onClick) {
    return (
      <button 
        className={`${baseClasses} text-left w-full hover:shadow-lg transition-shadow cursor-pointer`}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    )
  }
  
  return (
    <div className={baseClasses}>
      {children}
    </div>
  )
}
