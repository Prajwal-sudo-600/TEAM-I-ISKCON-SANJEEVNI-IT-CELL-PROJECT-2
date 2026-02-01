"use server"

import AdminLayout from '@/app/admin/components/admin/admin-layout'
import { getBookings } from '@/actions/adminbookingsactions'
import BookingsClient from './BookingsClient'

function formatBookingDate(bookingDate) {
  if (!bookingDate) return ''
  const date = new Date(bookingDate)
  if (Number.isNaN(date.getTime())) return String(bookingDate)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function BookingsPage() {
  const { data } = await getBookings()

  const bookings =
    data?.map((booking) => ({
      id: booking.id,
      user: booking.profiles?.full_name || "Unknown User", // ✅ Mapped from join
      email: "",        // ✅ Mapped from join
      room: booking.rooms?.name || "Unknown Room",         // ✅ Mapped from join
      date: formatBookingDate(booking.booking_date),
      time:
        booking.start_time && booking.end_time
          ? `${booking.start_time} - ${booking.end_time}`
          : '',
      purpose: booking.purpose,
      status: booking.status,
      remarks: booking.remarks,
      history: (booking.booking_history || []).map((entry) => ({
        status: entry.status,
        date: entry.changed_at
          ? new Date(entry.changed_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          : '',
        by: entry.changed_by,
      })),
    })) || []

  return (
    <AdminLayout title="Booking Control">
      <BookingsClient initialBookings={bookings} />
    </AdminLayout>
  )
}

