import React, { useState } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import { clientApp } from '../../lib/firebase/clientApp'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { subcategoriesConfig, getPriorityBySubcategory, getCategoryBySubcategory } from '../../lib/utils/subcategories'
import Card from '../common/Card'
import Input from '../common/Input'
import Button from '../common/Button'
import Toast from '../common/Toast'
import { useRouter } from 'next/router'

export default function RaiseTicketForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: ''
  })
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const categories = Object.keys(subcategoriesConfig)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'category') {
      // Reset subcategory when category changes
      setFormData({
        ...formData,
        category: value,
        subcategory: ''
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const db = clientApp.firestore()
      
      // Auto-assign priority based on subcategory (hidden from user)
      const autoPriority = getPriorityBySubcategory(formData.subcategory)
      const mainCategory = getCategoryBySubcategory(formData.subcategory)
      
      await addDoc(collection(db, 'tickets'), {
        title: formData.title,
        description: formData.description,
        category: mainCategory,
        subcategory: formData.subcategory,
        priority: autoPriority, // Auto-assigned, not shown to user
        userId: user.uid,
        userEmail: user.email,
        userName: user.name,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      setToastMessage('Ticket raised successfully!')
      setToastType('success')
      setShowToast(true)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        subcategory: ''
      })

      // Redirect to my tickets page after a short delay to show the toast
      setTimeout(() => {
        router.push('/user/my-tickets')
      }, 1500)

    } catch (error) {
      setToastMessage('Failed to raise ticket. Please try again.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  const availableSubcategories = formData.category 
    ? subcategoriesConfig[formData.category]?.items || []
    : []

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <Input
              label="Ticket Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of your issue"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {subcategoriesConfig[category].icon} {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Issue <span className="text-red-500">*</span>
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
                disabled={!formData.category}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formData.category ? 'Select specific issue' : 'First select a category'}
                </option>
                {availableSubcategories.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please provide detailed information about your issue"
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Submitting...' : 'Raise Ticket'}
            </Button>
          </form>
        </div>
      </Card>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
