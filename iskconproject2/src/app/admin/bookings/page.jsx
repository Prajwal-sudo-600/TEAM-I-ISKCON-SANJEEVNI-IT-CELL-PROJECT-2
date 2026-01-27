"use client"

import { useState } from 'react'
import AdminLayout from '@/app/admin/components/admin/admin-layout'
import { Eye, Check, X, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const initialBookings = [
  { 
    id: 1, 
    user: 'Radha Devi', 
    email: 'radha.devi@iskcon.org',
    room: 'Conference Hall A', 
    date: '24 Jan 2026',
    time: '10:00 AM - 12:00 PM',
    purpose: 'Bhagavad Gita Study Group',
    status: 'Pending',
    remarks: '',
    history: [{ status: 'Pending', date: '22 Jan 2026', by: 'System' }]
  },
  { 
    id: 2, 
    user: 'Krishna Das', 
    email: 'krishna.das@iskcon.org',
    room: 'Meeting Room 3', 
    date: '24 Jan 2026',
    time: '2:00 PM - 4:00 PM',
    purpose: 'IT Team Weekly Sync',
    status: 'Approved',
    remarks: '',
    history: [
      { status: 'Pending', date: '20 Jan 2026', by: 'System' },
      { status: 'Approved', date: '21 Jan 2026', by: 'Admin' }
    ]
  },
  { 
    id: 3, 
    user: 'Govinda Prabhu', 
    email: 'govinda@iskcon.org',
    room: 'Seminar Hall', 
    date: '25 Jan 2026',
    time: '9:00 AM - 1:00 PM',
    purpose: 'New Devotee Orientation',
    status: 'Pending',
    remarks: '',
    history: [{ status: 'Pending', date: '23 Jan 2026', by: 'System' }]
  },
  { 
    id: 4, 
    user: 'Madhavi Dasi', 
    email: 'madhavi@iskcon.org',
    room: 'Training Room 1', 
    date: '25 Jan 2026',
    time: '3:00 PM - 5:00 PM',
    purpose: 'Volunteer Training Session',
    status: 'Approved',
    remarks: '',
    history: [
      { status: 'Pending', date: '21 Jan 2026', by: 'System' },
      { status: 'Approved', date: '22 Jan 2026', by: 'Admin' }
    ]
  },
  { 
    id: 5, 
    user: 'Damodar Das', 
    email: 'damodar@iskcon.org',
    room: 'Conference Hall B', 
    date: '26 Jan 2026',
    time: '10:00 AM - 12:00 PM',
    purpose: 'Festival Planning Meeting',
    status: 'Rejected',
    remarks: 'Room already booked for temple maintenance.',
    history: [
      { status: 'Pending', date: '19 Jan 2026', by: 'System' },
      { status: 'Rejected', date: '20 Jan 2026', by: 'Admin' }
    ]
  },
  { 
    id: 6, 
    user: 'Lakshmi Devi', 
    email: 'lakshmi@iskcon.org',
    room: 'Meeting Room 2', 
    date: '27 Jan 2026',
    time: '11:00 AM - 1:00 PM',
    purpose: 'Prasadam Planning Committee',
    status: 'Pending',
    remarks: '',
    history: [{ status: 'Pending', date: '24 Jan 2026', by: 'System' }]
  },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(initialBookings)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApprove = (id) => {
    setBookings(bookings.map(booking => {
      if (booking.id === id) {
        return {
          ...booking,
          status: 'Approved',
          history: [...booking.history, { status: 'Approved', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), by: 'Admin' }]
        }
      }
      return booking
    }))
  }

  const handleReject = (id) => {
    setSelectedBooking(bookings.find(b => b.id === id))
    setShowRejectModal(true)
  }

  const confirmReject = () => {
    if (selectedBooking) {
      setBookings(bookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          return {
            ...booking,
            status: 'Rejected',
            remarks: rejectReason,
            history: [...booking.history, { status: 'Rejected', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), by: 'Admin' }]
          }
        }
        return booking
      }))
    }
    setShowRejectModal(false)
    setRejectReason('')
    setSelectedBooking(null)
  }

  const viewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filterStatus === 'All' || booking.status === filterStatus
    const matchesSearch = booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.room.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <AdminLayout title="Booking Control">
      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
                className="px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by user or room..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="w-full md:w-64 pl-10 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">All Bookings</h3>
          <p className="text-sm text-muted-foreground">Manage booking requests and approvals</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border bg-secondary/50">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Purpose</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{booking.user}</p>
                      <p className="text-xs text-muted-foreground">{booking.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{booking.room}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-foreground">{booking.date}</p>
                      <p className="text-xs text-muted-foreground">{booking.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-[200px] truncate">{booking.purpose}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewDetails(booking)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {booking.status !== 'Approved' && (
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status !== 'Rejected' && (
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-foreground px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Booking Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">User</p>
                  <p className="text-sm font-medium text-foreground">{selectedBooking.user}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm text-foreground">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Room</p>
                  <p className="text-sm font-medium text-foreground">{selectedBooking.room}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm text-foreground">{selectedBooking.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Time</p>
                  <p className="text-sm text-foreground">{selectedBooking.time}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Purpose</p>
                <p className="text-sm text-foreground">{selectedBooking.purpose}</p>
              </div>
              {selectedBooking.remarks && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Admin Remarks</p>
                  <p className="text-sm text-foreground bg-secondary p-3 rounded-lg">{selectedBooking.remarks}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Status History</p>
                <div className="space-y-2">
                  {selectedBooking.history.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <span className={`w-2 h-2 rounded-full ${entry.status === 'Approved' ? 'bg-green-500' : entry.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                      <span className="text-foreground">{entry.status}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-muted-foreground">{entry.date}</span>
                      <span className="text-muted-foreground">by {entry.by}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end">
              <button
                onClick={() => { setShowDetailsModal(false); setSelectedBooking(null) }}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Reject Booking</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Rejecting booking for {selectedBooking.user} - {selectedBooking.room}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
                className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setSelectedBooking(null) }}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
