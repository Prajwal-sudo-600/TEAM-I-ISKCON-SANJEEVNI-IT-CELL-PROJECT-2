"use client"

import { useState } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const rooms = [
  'Conference Hall A',
  'Conference Hall B',
  'Meeting Room 1',
  'Meeting Room 2',
  'Meeting Room 3',
  'Seminar Hall',
  'Training Room 1',
  'Training Room 2',
]

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
]

const bookingData = {
  '2026-01-20': [
    { room: 'Conference Hall A', startTime: '10:00 AM', endTime: '12:00 PM', title: 'Bhagavad Gita Study', status: 'Approved' },
    { room: 'Meeting Room 3', startTime: '2:00 PM', endTime: '4:00 PM', title: 'IT Team Sync', status: 'Approved' },
  ],
  '2026-01-21': [
    { room: 'Seminar Hall', startTime: '9:00 AM', endTime: '1:00 PM', title: 'New Devotee Orientation', status: 'Approved' },
    { room: 'Training Room 1', startTime: '3:00 PM', endTime: '5:00 PM', title: 'Volunteer Training', status: 'Approved' },
  ],
  '2026-01-22': [
    { room: 'Conference Hall B', startTime: '10:00 AM', endTime: '12:00 PM', title: 'Festival Planning', status: 'Pending' },
    { room: 'Meeting Room 1', startTime: '11:00 AM', endTime: '1:00 PM', title: 'Prasadam Committee', status: 'Approved' },
    { room: 'Meeting Room 2', startTime: '2:00 PM', endTime: '3:00 PM', title: 'Quick Standup', status: 'Approved' },
  ],
  '2026-01-23': [
    { room: 'Conference Hall A', startTime: '9:00 AM', endTime: '11:00 AM', title: 'Management Meeting', status: 'Approved' },
    { room: 'Training Room 2', startTime: '1:00 PM', endTime: '3:00 PM', title: 'Software Training', status: 'Pending' },
  ],
  '2026-01-24': [
    { room: 'Seminar Hall', startTime: '10:00 AM', endTime: '2:00 PM', title: 'Guest Lecture', status: 'Approved' },
    { room: 'Meeting Room 3', startTime: '3:00 PM', endTime: '5:00 PM', title: 'Project Review', status: 'Approved' },
    { room: 'Conference Hall A', startTime: '4:00 PM', endTime: '6:00 PM', title: 'Evening Session', status: 'Pending' },
  ],
  '2026-01-25': [
    { room: 'Conference Hall A', startTime: '8:00 AM', endTime: '10:00 AM', title: 'Morning Satsang', status: 'Approved' },
    { room: 'Training Room 1', startTime: '11:00 AM', endTime: '1:00 PM', title: 'Tech Workshop', status: 'Approved' },
  ],
  '2026-01-26': [
    { room: 'Seminar Hall', startTime: '9:00 AM', endTime: '5:00 PM', title: 'Republic Day Event', status: 'Approved' },
  ],
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 20))

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
    setCurrentDate(new Date(2026, 0, 24))
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

  const getBookingsForCell = (date, room) => {
    const dateKey = formatDateKey(date)
    const dayBookings = bookingData[dateKey] || []
    return dayBookings.filter(b => b.room === room)
  }

  const getStatusColor = (status) => {
    return status === 'Approved' 
      ? 'bg-primary/90 border-primary text-white' 
      : 'bg-accent/90 border-accent text-white'
  }

  const isToday = (date) => {
    const today = new Date(2026, 0, 24)
    return date.toDateString() === today.toDateString()
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
            {rooms.map((room, roomIdx) => (
              <div key={room} className={`grid grid-cols-8 border-b border-border last:border-b-0 ${roomIdx % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}`}>
                <div className="p-4 text-sm font-medium text-foreground border-r border-border flex items-start">
                  {room}
                </div>
                {weekDates.map((date, dateIdx) => {
                  const bookings = getBookingsForCell(date, room)
                  return (
                    <div 
                      key={dateIdx} 
                      className={`p-2 border-r border-border last:border-r-0 min-h-[80px] ${isToday(date) ? 'bg-primary/5' : ''}`}
                    >
                      {bookings.map((booking, bIdx) => (
                        <div
                          key={bIdx}
                          className={`p-2 rounded text-xs mb-1 last:mb-0 ${getStatusColor(booking.status)}`}
                        >
                          <p className="font-medium truncate">{booking.title}</p>
                          <p className="opacity-80">{booking.startTime} - {booking.endTime}</p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">This Week's Bookings</p>
          <p className="text-3xl font-bold text-foreground">
            {weekDates.reduce((sum, date) => {
              const dateKey = formatDateKey(date)
              return sum + (bookingData[dateKey]?.length || 0)
            }, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Approved Bookings</p>
          <p className="text-3xl font-bold text-green-600">
            {weekDates.reduce((sum, date) => {
              const dateKey = formatDateKey(date)
              return sum + (bookingData[dateKey]?.filter(b => b.status === 'Approved').length || 0)
            }, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Pending Approvals</p>
          <p className="text-3xl font-bold text-accent">
            {weekDates.reduce((sum, date) => {
              const dateKey = formatDateKey(date)
              return sum + (bookingData[dateKey]?.filter(b => b.status === 'Pending').length || 0)
            }, 0)}
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
