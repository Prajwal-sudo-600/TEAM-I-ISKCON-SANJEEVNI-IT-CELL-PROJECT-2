"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/app/admin/components/admin/admin-layout'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getRooms } from '@/actions/adminroomsactions'
import { getBookings } from '@/actions/adminbookingsactions'

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [roomsRes, bookingsRes] = await Promise.all([
        getRooms(),
        getBookings()
      ])

      if (roomsRes.success) {
        setRooms(roomsRes.data || [])
      }

      if (bookingsRes.success) {
        setBookings(bookingsRes.data || [])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const getWeekDates = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      week.push(d)
    }
    return week
  }

  const weekDates = getWeekDates(currentDate)

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDateHeader = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
  }

  const formatMonthYear = () => {
    const start = weekDates[0]
    const end = weekDates[6]
    if (start.getMonth() === end.getMonth()) {
      return start.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    }
    return `${start.toLocaleDateString('en-GB', { month: 'short' })} - ${end.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`
  }

  // Helper to format 14:00:00 -> 2:00 PM
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return ''
    const [hours, minutes] = timeStr.split(':')
    const h = parseInt(hours, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }

  const getBookingsForCell = (date, roomId) => {
    const dateKey = formatDateKey(date)

    return bookings.filter(b =>
      b.date === dateKey &&
      b.rooms?.name === roomId // Note: room arg passed from map below is actually the room object if we change logic, but here we iterate names? 
      // Wait, logic check: rooms state contains objects. The map below iterates rooms.
    )
  }

  // Refined helper using IDs for robustness if possible, but rooms state has objects.
  // Let's update the grid rendering to pass room ID or Name correctly.
  const getCellBookings = (date, roomName) => {
    const dateKey = formatDateKey(date)
    return bookings.filter(b =>
      b.date === dateKey &&
      b.rooms?.name === roomName
    )
  }

  const getStatusColor = (status) => {
    // Standardize status for comparison
    const s = status?.toLowerCase()
    return s === 'approved'
      ? 'bg-primary/90 border-primary text-white'
      : 'bg-accent/90 border-accent text-white'
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Calculate Stats for Visible Week
  const getWeeklyStats = () => {
    let total = 0
    let approved = 0
    let pending = 0

    const startStr = formatDateKey(weekDates[0])
    const endStr = formatDateKey(weekDates[6])

    // Filter bookings within this week range
    const weeklyBookings = bookings.filter(b => b.date >= startStr && b.date <= endStr)

    total = weeklyBookings.length
    approved = weeklyBookings.filter(b => b.status === 'approved').length
    pending = weeklyBookings.filter(b => b.status === 'pending').length

    return { total, approved, pending }
  }

  const stats = getWeeklyStats()

  if (loading) {
    return (
      <AdminLayout title="Schedule Overview">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground animate-pulse">Loading schedule...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Schedule Overview">
      {/* Header Controls */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Today
            </button>
          </div>
          <h2 className="text-lg font-semibold text-foreground">{formatMonthYear()}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-primary"></span>
              <span className="text-sm text-muted-foreground">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-accent"></span>
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 border-b border-border bg-secondary/50">
              <div className="p-4 text-sm font-medium text-muted-foreground border-r border-border">
                Room
              </div>
              {weekDates.map((date, idx) => (
                <div
                  key={idx}
                  className={`p-4 text-center border-r border-border last:border-r-0 ${isToday(date) ? 'bg-primary/10' : ''}`}
                >
                  <p className={`text-sm font-medium ${isToday(date) ? 'text-primary' : 'text-foreground'}`}>
                    {formatDateHeader(date)}
                  </p>
                  {isToday(date) && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Room Rows */}
            {rooms.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No active rooms found. Please add rooms in Rooms Management.
              </div>
            ) : (
              rooms.map((room, roomIdx) => (
                <div key={room.id} className={`grid grid-cols-8 border-b border-border last:border-b-0 ${roomIdx % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}`}>
                  <div className="p-4 text-sm font-medium text-foreground border-r border-border flex items-start">
                    {room.name}
                  </div>
                  {weekDates.map((date, dateIdx) => {
                    const cellBookings = getCellBookings(date, room.name)
                    return (
                      <div
                        key={dateIdx}
                        className={`p-2 border-r border-border last:border-r-0 min-h-[100px] ${isToday(date) ? 'bg-primary/5' : ''}`}
                      >
                        {cellBookings.length > 0 ? (
                          cellBookings.map((booking, bIdx) => (
                            <div
                              key={booking.id}
                              className={`p-2 rounded text-xs mb-1 last:mb-0 shadow-sm border ${getStatusColor(booking.status)}`}
                              title={`${booking.purpose} (${booking.user_email})`}
                            >
                              <p className="font-bold truncate">{booking.purpose || 'No Title'}</p>
                              <p className="opacity-90 text-[10px]">
                                {formatTimeDisplay(booking.start_time)} - {formatTimeDisplay(booking.end_time)}
                              </p>
                              <p className="opacity-75 text-[10px] truncate">{booking.profiles?.full_name}</p>
                            </div>
                          ))
                        ) : (
                          <div className="h-full w-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            {/* Optional: could add a 'plus' icon to quick-add booking here */}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">This Week's Bookings</p>
          <p className="text-3xl font-bold text-foreground">
            {stats.total}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Approved Bookings</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.approved}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Pending Approvals</p>
          <p className="text-3xl font-bold text-accent">
            {stats.pending}
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
