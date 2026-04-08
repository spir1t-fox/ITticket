import React from 'react'

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '', 
  variant = 'primary' 
}) {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
  
  const variants = {
    primary: 'border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
  }

  const classes = `${baseClasses} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}
