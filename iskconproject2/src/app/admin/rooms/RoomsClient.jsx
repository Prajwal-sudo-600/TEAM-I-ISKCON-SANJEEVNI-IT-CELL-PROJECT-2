"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { createRoom, updateRoom, deleteRoom } from '@/actions/adminroomsactions';

export default function RoomsClient({ initialRooms = [] }) {
    const [rooms, setRooms] = useState(initialRooms);
    const [isCreating, setIsCreating] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        capacity: "",
        type: "Meeting",
        status: "Active",
    });

    const resetForm = () => {
        setFormData({ name: "", capacity: "", type: "Meeting", status: "Active" });
        setIsCreating(false);
        setEditingRoom(null);
    };

    const handleEditClick = (room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            capacity: room.capacity,
            type: room.type || "Meeting",
            status: room.status || "Active",
        });
        setIsCreating(false);
    };

    const handleDelete = async (roomId) => {
        if (!confirm("Are you sure you want to delete this room?")) return;

        const res = await deleteRoom(roomId);
        if (!res.success) {
            alert(res.error || "Failed to delete room");
            return;
        }

        setRooms((prev) => prev.filter((r) => r.id !== roomId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingRoom) {
            // Update
            const res = await updateRoom(editingRoom.id, formData);
            if (!res.success) {
                alert(res.error || "Failed to update room");
                return;
            }
            setRooms((prev) =>
                prev.map((r) => (r.id === editingRoom.id ? res.data : r))
            );
        } else {
            // Create
            const res = await createRoom(formData);
            if (!res.success) {
                alert(res.error || "Failed to create room");
                return;
            }
            setRooms((prev) => [...prev, res.data]);
        }

        resetForm();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl p-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Rooms</h2>
                    <p className="text-gray-500">Manage conference and meeting rooms</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsCreating(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-blue-600/20"
                >
                    <Plus size={18} />
                    Add Room
                </button>
            </div>

            {/* Create / Edit Form */}
            {(isCreating || editingRoom) && (
                <div className="bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {editingRoom ? "Edit Room" : "Create New Room"}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="e.g. Conference Room A"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Capacity
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.capacity}
                                onChange={(e) =>
                                    setFormData({ ...formData, capacity: e.target.value })
                                }
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="e.g. 10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value })
                                }
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            >
                                <option value="Meeting">Meeting Room</option>
                                <option value="Conference">Conference Hall</option>
                                <option value="Training">Training Room</option>
                                <option value="Auditorium">Auditorium</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value })
                                }
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            >
                                <option value="Active">Active</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-600/20"
                            >
                                {editingRoom ? "Save Changes" : "Create Room"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Rooms Table */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200/50 text-left text-gray-700">
                                <th className="p-3 font-semibold">Name</th>
                                <th className="p-3 font-semibold">Capacity</th>
                                <th className="p-3 font-semibold">Type</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No rooms found. Click "Add Room" to create one.
                                    </td>
                                </tr>
                            ) : (
                                rooms.map((room) => (
                                    <tr
                                        key={room.id}
                                        className="border-b border-gray-100 hover:bg-white/30 transition-colors"
                                    >
                                        <td className="p-3 font-medium text-gray-900">
                                            {room.name}
                                        </td>
                                        <td className="p-3 text-gray-600">{room.capacity} people</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">
                                                {room.type}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${room.status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(room)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(room.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
