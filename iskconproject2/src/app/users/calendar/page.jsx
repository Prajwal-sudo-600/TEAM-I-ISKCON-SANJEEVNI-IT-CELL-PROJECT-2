'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCalendarBookings } from '@/actions/user/calenderActions'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  // Removed view state, default is week
  const [bookingsData, setBookingsData] = useState([])
  const [loading, setLoading] = useState(true)

  /* ---------------- FETCH BOOKINGS ---------------- */
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getCalendarBookings()
      console.log("CALENDAR BOOKINGS:", res)

      if (res.success && res.data) {
        const mapped = res.data.map(b => {
          const startHour = b.start_time.slice(0, 2)
          const ampm = Number(startHour) >= 12 ? 'PM' : 'AM'
          const hour12 = ((Number(startHour) + 11) % 12 + 1)
          const formattedTime = `${hour12.toString().padStart(2, '0')}:00 ${ampm}`

          return {
            date: b.date,
            room: b.rooms?.name || 'Room',
            time: formattedTime,
            purpose: b.purpose,
            status: b.status?.toLowerCase() || 'pending'
          }
        })

        setBookingsData(mapped)
      }

      setLoading(false)
    }

    fetchBookings()
  }, [])

  /* ---------------- DATE HELPERS ---------------- */
  const getWeekDates = (date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  const weekDates = getWeekDates(currentDate)

  const formatDate = (date) => date.toISOString().split('T')[0]

  const getBookingsForDate = (date) => {
    const dateStr = formatDate(date)
    return bookingsData.filter(b => b.date === dateStr)
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction * 7))
    setCurrentDate(newDate)
  }

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">Loading Calendar...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Calendar</h1>
          <p className="text-muted-foreground">View your bookings schedule</p>
        </div>

        {/* HEADER */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{monthYear}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button onClick={() => navigateWeek(-1)} className="p-2 hover:bg-muted rounded-full">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => navigateWeek(1)} className="p-2 hover:bg-muted rounded-full">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WEEK VIEW */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b bg-muted/30">
            <div className="p-3 text-xs font-semibold text-center border-r">Time</div>
            {weekDates.map((date, idx) => (
              <div key={idx} className="p-2 text-center border-r last:border-r-0">
                <div className="text-sm font-semibold">{daysOfWeek[date.getDay()]}</div>
                <div className="text-xs text-muted-foreground">
                  {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
          {timeSlots.map(time => (
            <div key={time} className="grid grid-cols-8 border-b">
              <div className="p-3 text-xs bg-muted/30">{time}</div>
              {weekDates.map((date, idx) => {
                const bookings = getBookingsForDate(date).filter(b => b.time === time)
                return (
                  <div key={idx} className="p-2 min-h-[60px] border-l">
                    {bookings.map((booking, i) => (
                      <div key={i}
                        className={`text-xs p-2 rounded mb-1 ${booking.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}>
                        <p className="font-medium truncate">{booking.room}</p>
                        <p className="truncate opacity-80">{booking.purpose}</p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
