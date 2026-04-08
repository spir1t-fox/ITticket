import React from 'react'

export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error = '', 
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${error ? 'border-red-500' : ''} ${disabled ? 'bg-gray-100' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
