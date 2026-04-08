// Ticket subcategories with auto-assigned priorities (hidden from users, visible to admin)

export const subcategoriesConfig = {
  'Hardware Issues': {
    icon: '💻',
    items: [
      { name: 'Desktop not turning ON', priority: 'urgent' },
      { name: 'Laptop overheating', priority: 'medium' },
      { name: 'Keyboard not working', priority: 'medium' },
      { name: 'Mouse not working', priority: 'low' },
      { name: 'Monitor display issue', priority: 'urgent' },
      { name: 'Printer not printing', priority: 'medium' },
      { name: 'Scanner not working', priority: 'low' },
      { name: 'Hard disk failure', priority: 'urgent' },
      { name: 'USB ports not working', priority: 'low' },
      { name: 'Battery not charging', priority: 'medium' },
      { name: 'Others', priority: 'medium' }
    ]
  },
  'Software Issues': {
    icon: '💻',
    items: [
      { name: 'Application not opening', priority: 'urgent' },
      { name: 'Software crash frequently', priority: 'urgent' },
      { name: 'Login issues', priority: 'urgent' },
      { name: 'Password reset request', priority: 'medium' },
      { name: 'Software installation request', priority: 'low' },
      { name: 'License expired', priority: 'medium' },
      { name: 'Slow system performance', priority: 'medium' },
      { name: 'OS update issue', priority: 'medium' },
      { name: 'Antivirus not working', priority: 'urgent' },
      { name: 'File not opening', priority: 'low' },
      { name: 'Others', priority: 'medium' }
    ]
  },
  'Network Issues': {
    icon: '🌐',
    items: [
      { name: 'No internet connection', priority: 'urgent' },
      { name: 'Slow internet speed', priority: 'medium' },
      { name: 'Wi-Fi not connecting', priority: 'urgent' },
      { name: 'VPN not working', priority: 'urgent' },
      { name: 'Network disconnection frequently', priority: 'medium' },
      { name: 'LAN cable issue', priority: 'medium' },
      { name: 'DNS issue', priority: 'medium' },
      { name: 'Server not reachable', priority: 'urgent' },
      { name: 'IP conflict', priority: 'low' },
      { name: 'Firewall blocking access', priority: 'medium' },
      { name: 'Others', priority: 'medium' }
    ]
  }
}

// Helper functions
export function getAllSubcategories() {
  const allItems = []
  Object.entries(subcategoriesConfig).forEach(([category, data]) => {
    data.items.forEach(item => {
      allItems.push({
        category,
        subcategory: item.name,
        priority: item.priority,
        icon: data.icon
      })
    })
  })
  return allItems
}

export function getPriorityBySubcategory(subcategoryName) {
  for (const [category, data] of Object.entries(subcategoriesConfig)) {
    const item = data.items.find(i => i.name === subcategoryName)
    if (item) return item.priority
  }
  return 'medium' // default
}

export function getCategoryBySubcategory(subcategoryName) {
  for (const [category, data] of Object.entries(subcategoriesConfig)) {
    const item = data.items.find(i => i.name === subcategoryName)
    if (item) return category
  }
  return null
}

export function getSubcategoriesByCategory(category) {
  return subcategoriesConfig[category]?.items || []
}

export const priorityColors = {
  urgent: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  low: 'bg-gray-100 text-gray-800 border-gray-200'
}

export const priorityLabels = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low'
}
