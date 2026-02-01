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
  const [view, setView] = useState('week')
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

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  const goToToday = () => setCurrentDate(new Date())

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

            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button onClick={() => setView('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${view === 'week' ? 'bg-card text-primary shadow-sm' : ''}`}>
                Week
              </button>
              <button onClick={() => setView('day')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${view === 'day' ? 'bg-card text-primary shadow-sm' : ''}`}>
                Day
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={goToToday}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground text-sm">
                Today
              </button>

              <div className="flex items-center gap-1">
                <button onClick={() => view === 'week' ? navigateWeek(-1) : navigateDay(-1)}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-semibold min-w-[180px] text-center">{monthYear}</span>
                <button onClick={() => view === 'week' ? navigateWeek(1) : navigateDay(1)}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WEEK VIEW */}
        {view === 'week' && (
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
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
        )}
      </div>
    </DashboardLayout>
  )
}
