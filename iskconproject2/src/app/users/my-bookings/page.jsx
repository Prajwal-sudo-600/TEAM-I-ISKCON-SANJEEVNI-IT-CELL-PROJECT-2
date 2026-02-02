'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { Filter } from 'lucide-react'
import { getMyBookings } from '@/actions/user/userBookingsActions'

const statusStyles = {
  approved: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-saffron/20 text-saffron border-saffron/30',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

const statusLabels = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
}

export default function MyBookingsPage() {
  const [filter, setFilter] = useState('all')
  const [bookingsData, setBookingsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getMyBookings()

      if (res.success && res.data) {
        const mapped = res.data.map(b => ({
          id: b.id,
          room: b.rooms?.name || 'Unknown Room',
          date: new Date(b.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          time: `${b.start_time} - ${b.end_time}`,
          purpose: b.purpose || 'General',
          status: b.status, // pending | approved | rejected
          submittedOn: new Date(b.created_at).toLocaleDateString('en-GB'),
          remarks: b.remarks,
        }))

        setBookingsData(mapped)
      }

      setLoading(false)
    }

    fetchBookings()
  }, [])

  const filteredBookings =
    filter === 'all'
      ? bookingsData
      : bookingsData.filter(b => b.status === filter)

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <BackButton />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            View all your booking requests and their status
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border mb-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />

            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}

                {status !== 'all' && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === status
                    ? 'bg-white/20 text-white'
                    : status === 'approved' ? 'bg-green-100 text-green-700'
                      : status === 'rejected' ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                    {bookingsData.filter(b => b.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {loading ? (
            <p>Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            filteredBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-card rounded-xl p-5 shadow-sm border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">
                    {booking.room}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${statusStyles[booking.status]
                      }`}
                  >
                    {statusLabels[booking.status]}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {booking.date} • {booking.time}
                </p>

                <p className="mt-2 text-sm">
                  <strong>Purpose:</strong> {booking.purpose}
                </p>

                {booking.status === 'rejected' && booking.remarks && (
                  <p className="mt-2 text-sm text-red-600">
                    <strong>Reason:</strong> {booking.remarks}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
