"use client"

import { useState } from 'react'
import { Plus, Trash2, Edit, Box, DoorOpen, X, Check } from 'lucide-react'
import { createResource, updateResource, deleteResource, assignResourceToRoom, removeResourceFromRoom, getResourceAssignments } from '@/actions/admin/adminresourcesactions'
import { toast } from 'sonner'

export default function ResourcesClient({ initialResources, rooms }) {
    const [resources, setResources] = useState(initialResources)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)

    // State for Add/Edit
    const [editingResource, setEditingResource] = useState(null)
    const [formData, setFormData] = useState({
        name: ''
    })

    // State for Room Assignment
    const [selectedResourceForRooms, setSelectedResourceForRooms] = useState(null)
    const [assignedRoomIds, setAssignedRoomIds] = useState([])
    const [loadingAssignments, setLoadingAssignments] = useState(false)

    /* ---------------- CRUD HANDLERS ---------------- */

    const handleOpenAdd = () => {
        setEditingResource(null)
        setFormData({ name: '' })
        setIsAddModalOpen(true)
    }

    const handleOpenEdit = (res) => {
        setEditingResource(res)
        setFormData({
            name: res.name
        })
        setIsAddModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this resource?')) return

        const res = await deleteResource(id)
        if (res.success) {
            toast.success('Resource deleted')
            setResources(prev => prev.filter(r => r.id !== id))
        } else {
            toast.error(res.error || 'Failed to delete')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (editingResource) {
            // Update
            const res = await updateResource(editingResource.id, formData)
            if (res.success) {
                toast.success('Resource updated')
                // Optimistic update
                // Use returned data if possible, or fallback to local
                const updated = res.data || { ...editingResource, ...formData }
                setResources(prev => prev.map(r => r.id === editingResource.id ? { ...r, ...updated } : r))
                setIsAddModalOpen(false)
            } else {
                toast.error(res.error || 'Failed to update')
            }
        } else {
            // Create
            const res = await createResource(formData)
            if (res.success) {
                toast.success('Resource created')
                setResources(prev => [...prev, res.data])
                setIsAddModalOpen(false)
            } else {
                toast.error(res.error || 'Failed to create')
            }
        }
    }

    /* ---------------- ROOM ASSIGNMENT HANDLERS ---------------- */

    const handleOpenRoomManager = async (resource) => {
        setSelectedResourceForRooms(resource)
        setIsRoomModalOpen(true)
        setLoadingAssignments(true)

        const res = await getResourceAssignments(resource.id)
        if (res.success) {
            setAssignedRoomIds(res.data)
        } else {
            toast.error('Failed to load assignments')
        }
        setLoadingAssignments(false)
    }

    const toggleRoomAssignment = async (roomId) => {
        if (!selectedResourceForRooms) return

        const isAssigned = assignedRoomIds.includes(roomId)
        const resourceId = selectedResourceForRooms.id

        // Optimistic Update
        const originalIds = [...assignedRoomIds]
        if (isAssigned) {
            setAssignedRoomIds(prev => prev.filter(id => id !== roomId))
        } else {
            setAssignedRoomIds(prev => [...prev, roomId])
        }

        let res
        if (isAssigned) {
            res = await removeResourceFromRoom(resourceId, roomId)
        } else {
            res = await assignResourceToRoom(resourceId, roomId)
        }

        if (!res.success) {
            toast.error(res.error || 'Failed to update assignment')
            setAssignedRoomIds(originalIds) // Revert
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Resources Inventory</h1>
                <button
                    onClick={handleOpenAdd}
                    className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Resource
                </button>
            </div>

            {/* Resources Table */}
            <div className="bg-card border border-border shadow-sm rounded-2xl p-6 overflow-hidden">
                <table className="w-full">
                    <thead className="border-b border-border text-left text-muted-foreground">
                        <tr>
                            <th className="p-4 font-semibold w-full">Name</th>
                            <th className="text-right p-4 font-semibold w-[200px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="p-8 text-center text-gray-500">
                                    No resources found. Add one to get started.
                                </td>
                            </tr>
                        ) : (
                            resources.map((res, idx) => (
                                <tr key={res.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">{res.name}</td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenRoomManager(res)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Manage Room Assignments"
                                        >
                                            <DoorOpen className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleOpenEdit(res)}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(res.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h2 className="font-semibold text-lg">{editingResource ? 'Edit Resource' : 'Add Resource'}</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="e.g. Projector"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    {editingResource ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Room Management Modal */}
            {isRoomModalOpen && selectedResourceForRooms && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-lg">Manage Room Access</h2>
                                <p className="text-sm text-muted-foreground">Assign <strong>{selectedResourceForRooms.name}</strong> to specific rooms.</p>
                            </div>
                            <button onClick={() => setIsRoomModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1">
                            {loadingAssignments ? (
                                <div className="flex justify-center py-8">
                                    <span className="loading-spinner text-primary">Loading...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {rooms.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-4">No rooms available.</p>
                                    ) : (
                                        rooms.map(room => {
                                            const isAssigned = assignedRoomIds.includes(room.id)
                                            return (
                                                <div
                                                    key={room.id}
                                                    onClick={() => toggleRoomAssignment(room.id)}
                                                    className={`
                                                flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                                                ${isAssigned
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/50 hover:bg-gray-50'
                                                        }
                                            `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                    ${isAssigned ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'}
                                                 `}>
                                                            {isAssigned && <Check className="w-3 h-3" />}
                                                        </div>
                                                        <span className={isAssigned ? 'font-medium text-primary' : 'text-gray-700'}>
                                                            {room.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{room.type}</span>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setIsRoomModalOpen(false)}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
