"use client"

import { useState } from 'react'
import AdminLayout from '@/app/admin/components/admin/admin-layout'
import { Plus, Pencil, Trash2, Users, X } from 'lucide-react'

const initialRooms = [
  { id: 1, name: 'Conference Hall A', capacity: 100, type: 'Conference', status: 'Active' },
  { id: 2, name: 'Conference Hall B', capacity: 80, type: 'Conference', status: 'Active' },
  { id: 3, name: 'Meeting Room 1', capacity: 20, type: 'Meeting', status: 'Active' },
  { id: 4, name: 'Meeting Room 2', capacity: 15, type: 'Meeting', status: 'Maintenance' },
  { id: 5, name: 'Meeting Room 3', capacity: 25, type: 'Meeting', status: 'Active' },
  { id: 6, name: 'Seminar Hall', capacity: 200, type: 'Seminar', status: 'Active' },
  { id: 7, name: 'Training Room 1', capacity: 40, type: 'Training', status: 'Active' },
  { id: 8, name: 'Training Room 2', capacity: 35, type: 'Training', status: 'Maintenance' },
]

const roomTypes = ['Conference', 'Meeting', 'Seminar', 'Training', 'Multipurpose']

export default function RoomsPage() {
  const [rooms, setRooms] = useState(initialRooms)
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    type: 'Meeting',
    status: 'Active'
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)

  const openAddModal = () => {
    setEditingRoom(null)
    setFormData({ name: '', capacity: '', type: 'Meeting', status: 'Active' })
    setShowModal(true)
  }

  const openEditModal = (room) => {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      capacity: room.capacity.toString(),
      type: room.type,
      status: room.status
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingRoom) {
      setRooms(rooms.map(room => 
        room.id === editingRoom.id 
          ? { ...room, ...formData, capacity: parseInt(formData.capacity) }
          : room
      ))
    } else {
      const newRoom = {
        id: Math.max(...rooms.map(r => r.id)) + 1,
        ...formData,
        capacity: parseInt(formData.capacity)
      }
      setRooms([...rooms, newRoom])
    }
    setShowModal(false)
    setFormData({ name: '', capacity: '', type: 'Meeting', status: 'Active' })
    setEditingRoom(null)
  }

  const confirmDelete = (room) => {
    setRoomToDelete(room)
    setShowDeleteConfirm(true)
  }

  const handleDelete = () => {
    if (roomToDelete) {
      setRooms(rooms.filter(room => room.id !== roomToDelete.id))
    }
    setShowDeleteConfirm(false)
    setRoomToDelete(null)
  }

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-orange-100 text-orange-800'
  }

  const activeRooms = rooms.filter(r => r.status === 'Active').length
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0)

  return (
    <AdminLayout title="Rooms Management">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Total Rooms</p>
          <p className="text-3xl font-bold text-foreground">{rooms.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Active Rooms</p>
          <p className="text-3xl font-bold text-foreground">{activeRooms}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Total Capacity</p>
          <p className="text-3xl font-bold text-foreground">{totalCapacity}</p>
        </div>
      </div>

      {/* Rooms List */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">All Rooms</h3>
            <p className="text-sm text-muted-foreground">Manage rooms and their availability</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border bg-secondary/50">
                <th className="px-6 py-4 font-medium">Room Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{room.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{room.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {room.capacity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(room)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(room)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter room name"
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                  min="1"
                  placeholder="Enter capacity"
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingRoom ? 'Save Changes' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && roomToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-sm w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Delete Room</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete "{roomToDelete.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setRoomToDelete(null) }}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
