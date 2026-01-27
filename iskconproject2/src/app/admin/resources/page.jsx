"use client"

import { useState } from 'react'
import AdminLayout from '@/app/admin/components/admin/admin-layout'
import { Pencil, History, X, Package, Filter } from 'lucide-react'

const initialResources = [
  { 
    id: 1, 
    name: 'Projector HD-4000', 
    category: 'Electronics', 
    quantity: 5, 
    status: 'Available',
    remarks: 'High-definition projectors for conference rooms',
    history: [
      { action: 'Added', date: '01 Jan 2026', by: 'Admin', details: 'Initial inventory' },
      { action: 'Updated', date: '15 Jan 2026', by: 'Admin', details: 'Quantity increased from 3 to 5' }
    ]
  },
  { 
    id: 2, 
    name: 'Whiteboard (Large)', 
    category: 'Furniture', 
    quantity: 12, 
    status: 'Available',
    remarks: 'Magnetic whiteboards for training rooms',
    history: [
      { action: 'Added', date: '01 Jan 2026', by: 'Admin', details: 'Initial inventory' }
    ]
  },
  { 
    id: 3, 
    name: 'Conference Phone', 
    category: 'Electronics', 
    quantity: 8, 
    status: 'Available',
    remarks: 'VoIP conference phones',
    history: [
      { action: 'Added', date: '05 Jan 2026', by: 'Admin', details: 'Initial inventory' },
      { action: 'Updated', date: '10 Jan 2026', by: 'Admin', details: 'Status changed to Available' }
    ]
  },
  { 
    id: 4, 
    name: 'Laptop Stand', 
    category: 'Accessories', 
    quantity: 20, 
    status: 'Available',
    remarks: 'Ergonomic laptop stands',
    history: [
      { action: 'Added', date: '01 Jan 2026', by: 'Admin', details: 'Initial inventory' }
    ]
  },
  { 
    id: 5, 
    name: 'Microphone System', 
    category: 'Electronics', 
    quantity: 3, 
    status: 'Low Stock',
    remarks: 'Wireless microphone systems for seminars',
    history: [
      { action: 'Added', date: '01 Jan 2026', by: 'Admin', details: 'Initial inventory with 10 units' },
      { action: 'Updated', date: '20 Jan 2026', by: 'Admin', details: 'Quantity reduced to 3 - marked as Low Stock' }
    ]
  },
  { 
    id: 6, 
    name: 'Extension Cables', 
    category: 'Accessories', 
    quantity: 30, 
    status: 'Available',
    remarks: 'Power extension cables 5m',
    history: [
      { action: 'Added', date: '01 Jan 2026', by: 'Admin', details: 'Initial inventory' }
    ]
  },
  { 
    id: 7, 
    name: 'Folding Chairs', 
    category: 'Furniture', 
    quantity: 0, 
    status: 'Out of Stock',
    remarks: 'Portable folding chairs for events',
    history: [
      { action: 'Added', date: '01 Jan 2026', by: 'Admin', details: 'Initial inventory with 50 units' },
      { action: 'Updated', date: '22 Jan 2026', by: 'Admin', details: 'All units issued for temple festival' }
    ]
  },
  { 
    id: 8, 
    name: 'Portable PA System', 
    category: 'Electronics', 
    quantity: 2, 
    status: 'Available',
    remarks: 'Battery-powered portable PA systems',
    history: [
      { action: 'Added', date: '10 Jan 2026', by: 'Admin', details: 'New procurement' }
    ]
  },
]

const categories = ['All', 'Electronics', 'Furniture', 'Accessories']

export default function ResourcesPage() {
  const [resources, setResources] = useState(initialResources)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    status: '',
    remarks: ''
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800'
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'Out of Stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const openEditModal = (resource) => {
    setSelectedResource(resource)
    setFormData({
      name: resource.name,
      category: resource.category,
      quantity: resource.quantity.toString(),
      status: resource.status,
      remarks: resource.remarks
    })
    setShowEditModal(true)
  }

  const openHistoryModal = (resource) => {
    setSelectedResource(resource)
    setShowHistoryModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedQuantity = parseInt(formData.quantity)
    let newStatus = formData.status
    
    if (updatedQuantity === 0) {
      newStatus = 'Out of Stock'
    } else if (updatedQuantity <= 3) {
      newStatus = 'Low Stock'
    } else if (formData.status === 'Out of Stock' || formData.status === 'Low Stock') {
      newStatus = 'Available'
    }

    setResources(resources.map(resource => {
      if (resource.id === selectedResource.id) {
        return {
          ...resource,
          ...formData,
          quantity: updatedQuantity,
          status: newStatus,
          history: [
            ...resource.history,
            {
              action: 'Updated',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              by: 'Admin',
              details: `Quantity: ${updatedQuantity}, Status: ${newStatus}`
            }
          ]
        }
      }
      return resource
    }))
    setShowEditModal(false)
    setSelectedResource(null)
  }

  const filteredResources = filterCategory === 'All' 
    ? resources 
    : resources.filter(r => r.category === filterCategory)

  const totalResources = resources.length
  const availableCount = resources.filter(r => r.status === 'Available').length
  const lowStockCount = resources.filter(r => r.status === 'Low Stock').length

  return (
    <AdminLayout title="Resources Management">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Total Resources</p>
          <p className="text-3xl font-bold text-foreground">{totalResources}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Available</p>
          <p className="text-3xl font-bold text-green-600">{availableCount}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Low Stock Items</p>
          <p className="text-3xl font-bold text-yellow-600">{lowStockCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">All Resources</h3>
          <p className="text-sm text-muted-foreground">View and manage inventory resources</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border bg-secondary/50">
                <th className="px-6 py-4 font-medium">Resource Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Remarks</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{resource.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{resource.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{resource.quantity}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">
                    {resource.remarks}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(resource)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openHistoryModal(resource)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        title="View History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Edit Resource</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Resource Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Resource History</h3>
                <p className="text-sm text-muted-foreground">{selectedResource.name}</p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {selectedResource.history.map((entry, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-secondary rounded-lg">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${entry.action === 'Added' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{entry.action}</span>
                        <span className="text-xs text-muted-foreground">by {entry.by}</span>
                      </div>
                      <p className="text-sm text-foreground">{entry.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
