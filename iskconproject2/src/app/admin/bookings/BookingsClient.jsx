"use client";

import { useState } from "react";
import { Check, X, MessageSquare, Trash2 } from "lucide-react";
import { approveBooking, rejectBooking, deleteBooking } from '@/actions/admin/adminbookingsactions'

export default function BookingsClient({ initialBookings }) {
    const [bookings, setBookings] = useState(initialBookings);

    const handleApprove = async (bookingId) => {
        const res = await approveBooking(bookingId)
        if (!res.success) {
            alert('Failed to approve booking')
            return
        }

        setBookings(prev =>
            prev.map(b =>
                b.id === bookingId
                    ? { ...b, status: 'approved' }
                    : b
            )
        )
    }

    const handleReject = async (bookingId) => {
        const reason = prompt('Reason for rejection?')
        if (!reason) return

        const res = await rejectBooking(bookingId, reason)
        if (!res.success) {
            alert('Failed to reject booking')
            return
        }

        // ✅ UPDATE LOCAL STATE
        setBookings(prev =>
            prev.map(b =>
                b.id === bookingId
                    ? { ...b, status: 'rejected', remarks: reason }
                    : b
            )
        )
    }

    const handleDelete = async (bookingId) => {
        if (!confirm('Are you sure you want to permanently delete this booking?')) return

        const res = await deleteBooking(bookingId)
        if (!res.success) {
            alert('Failed to delete booking')
            return
        }

        // ✅ REMOVE FROM LOCAL STATE
        setBookings(prev => prev.filter(b => b.id !== bookingId))
    }

    return (
        <div className="bg-card border border-border shadow-sm rounded-2xl p-6 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                            <th className="p-3 font-semibold">User</th>
                            <th className="p-3 font-semibold">Room</th>
                            <th className="p-3 font-semibold">Date & Time</th>
                            <th className="p-3 font-semibold">Purpose</th>
                            <th className="p-3 font-semibold">Status</th>
                            <th className="p-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="border-b border-border hover:bg-muted/50 transition-colors"
                                >
                                    {/* User */}
                                    <td className="p-3">
                                        <div className="font-semibold">{booking.user}</div>
                                        <div className="text-xs text-gray-500">{booking.email}</div>
                                    </td>

                                    {/* Room */}
                                    <td className="p-3">{booking.room}</td>

                                    {/* Date & Time */}
                                    <td className="p-3">
                                        <div>{booking.date}</div>
                                        <div className="text-xs text-gray-500">{booking.time}</div>
                                    </td>

                                    {/* Purpose */}
                                    <td className="p-3 text-sm text-gray-600 max-w-[200px] truncate">
                                        {booking.purpose}
                                    </td>

                                    {/* Status */}
                                    <td className="p-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : booking.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2 items-center">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(booking.id)}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg
                              bg-green-100 text-green-700 hover:bg-green-200"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={() => handleReject(booking.id)}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg
                              bg-red-100 text-red-700 hover:bg-red-200"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {/* DELETE BUTTON for ALL statuses */}
                                            <button
                                                onClick={() => handleDelete(booking.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Booking"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
    );
}
