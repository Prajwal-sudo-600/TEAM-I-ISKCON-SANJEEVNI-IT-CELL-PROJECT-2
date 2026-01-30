'use client'

import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { Calendar, Clock, MapPin, Users, Monitor, Filter } from 'lucide-react'

const bookingsData = [
  {
    id: 1,
    room: 'Conference Room A',
    date: 'January 25, 2026',
    time: '09:00 AM - 10:00 AM',
    purpose: 'Morning Seva Meeting',
    resources: ['Projector', 'Whiteboard'],
    attendees: 15,
    status: 'approved',
    submittedOn: 'January 20, 2026',
  },
  {
    id: 2,
    room: 'Meeting Room B',
    date: 'January 26, 2026',
    time: '02:00 PM - 03:30 PM',
    purpose: 'IT Training Session',
    resources: ['TV Screen', 'Laptop'],
    attendees: 8,
    status: 'pending',
    submittedOn: 'January 22, 2026',
  },
  {
    id: 3,
    room: 'Hall C',
    date: 'January 27, 2026',
    time: '10:00 AM - 12:00 PM',
    purpose: 'Devotee Orientation',
    resources: ['Projector', 'Sound System', 'Stage'],
    attendees: 45,
    status: 'approved',
    submittedOn: 'January 18, 2026',
  },
  {
    id: 4,
    room: 'Training Room D',
    date: 'January 28, 2026',
    time: '03:00 PM - 05:00 PM',
    purpose: 'Workshop',
    resources: ['Computers', 'Projector'],
    attendees: 25,
    status: 'pending',
    submittedOn: 'January 23, 2026',
  },
  {
    id: 5,
    room: 'Board Room F',
    date: 'January 20, 2026',
    time: '11:00 AM - 12:00 PM',
    purpose: 'Department Meeting',
    resources: ['Video Conferencing'],
    attendees: 10,
    status: 'rejected',
    submittedOn: 'January 15, 2026',
    rejectionReason: 'Room under maintenance',
  },
  {
    id: 6,
    room: 'Conference Room A',
    date: 'January 15, 2026',
    time: '02:00 PM - 03:00 PM',
    purpose: 'Weekly Review',
    resources: ['Projector'],
    attendees: 12,
    status: 'completed',
    submittedOn: 'January 10, 2026',
  },
]

const statusStyles = {
  approved: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-saffron/20 text-saffron border-saffron/30',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  completed: 'bg-muted text-muted-foreground border-muted',
}

const statusLabels = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  completed: 'Completed',
}

export default function MyBookingsPage() {
  const [filter, setFilter] = useState('all')

  const filteredBookings = filter === 'all' 
    ? bookingsData 
    : bookingsData.filter(b => b.status === filter)

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <BackButton />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-peacock mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View all your booking requests and their status</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gold/50 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === status
                    ? 'bg-peacock text-white'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                    {bookingsData.filter(b => b.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gold/50 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No bookings found for this filter.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div 
                key={booking.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gold/50 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg text-foreground">{booking.room}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-peacock" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-peacock" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-saffron" />
                        <span>{booking.purpose}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-saffron" />
                        <span>{booking.attendees} attendees</span>
                      </div>
                    </div>

                    {/* Resources */}
                    {booking.resources.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <Monitor className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {booking.resources.map((resource) => (
                            <span 
                              key={resource}
                              className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {booking.status === 'rejected' && booking.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-sm text-red-700">
                          <strong>Reason:</strong> {booking.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submission Info */}
                  <div className="text-sm text-muted-foreground lg:text-right">
                    <p>Submitted on</p>
                    <p className="font-medium text-foreground">{booking.submittedOn}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Read-only Notice */}
        <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-gold/30">
          <p className="text-sm text-muted-foreground text-center">
            Booking details are read-only. For modifications or cancellations, please contact the IT Cell administrator.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
