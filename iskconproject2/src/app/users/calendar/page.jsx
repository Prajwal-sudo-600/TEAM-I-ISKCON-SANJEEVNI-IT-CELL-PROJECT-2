'use client'

import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

const bookingsData = [
  { date: '2026-01-25', room: 'Conference Room A', time: '09:00 AM', purpose: 'Seva Meeting', status: 'approved' },
  { date: '2026-01-25', room: 'Meeting Room B', time: '02:00 PM', purpose: 'IT Training', status: 'pending' },
  { date: '2026-01-26', room: 'Hall C', time: '10:00 AM', purpose: 'Orientation', status: 'approved' },
  { date: '2026-01-27', room: 'Training Room D', time: '03:00 PM', purpose: 'Workshop', status: 'approved' },
  { date: '2026-01-28', room: 'Board Room F', time: '11:00 AM', purpose: 'Meeting', status: 'pending' },
  { date: '2026-01-30', room: 'Conference Room A', time: '04:00 PM', purpose: 'Review', status: 'approved' },
]

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 25))
  const [view, setView] = useState('week')

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

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

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

  const goToToday = () => {
    setCurrentDate(new Date(2026, 0, 24))
  }

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <BackButton />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-peacock mb-2">Calendar</h1>
          <p className="text-muted-foreground">View your bookings schedule</p>
        </div>

        {/* Calendar Header */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gold/50 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  view === 'week' ? 'bg-white text-peacock shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  view === 'day' ? 'bg-white text-peacock shadow-sm' : 'text-muted-foreground'
                }`}
              >
                Day
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="px-4 py-2 border border-peacock text-peacock rounded-lg hover:bg-peacock hover:text-white transition-all text-sm font-medium"
              >
                Today
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => view === 'week' ? navigateWeek(-1) : navigateDay(-1)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <span className="font-semibold text-foreground min-w-[180px] text-center">
                  {monthYear}
                </span>
                <button
                  onClick={() => view === 'week' ? navigateWeek(1) : navigateDay(1)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {view === 'week' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gold/50 overflow-hidden">
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b border-gold/50">
              <div className="p-3 bg-muted/30" />
              {weekDates.map((date, index) => {
                const isToday = formatDate(date) === formatDate(new Date(2026, 0, 24))
                return (
                  <div 
                    key={index}
                    className={`p-3 text-center border-l border-gold/50 ${isToday ? 'bg-peacock/5' : ''}`}
                  >
                    <p className="text-xs text-muted-foreground">{daysOfWeek[date.getDay()]}</p>
                    <p className={`text-lg font-semibold ${isToday ? 'text-peacock' : 'text-foreground'}`}>
                      {date.getDate()}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Time Slots */}
            {timeSlots.map((time, timeIndex) => (
              <div key={time} className="grid grid-cols-8 border-b border-gold/30 last:border-0">
                <div className="p-3 text-xs text-muted-foreground bg-muted/30 flex items-center justify-center">
                  {time}
                </div>
                {weekDates.map((date, dateIndex) => {
                  const bookings = getBookingsForDate(date).filter(b => b.time === time)
                  const isToday = formatDate(date) === formatDate(new Date(2026, 0, 24))
                  
                  return (
                    <div 
                      key={dateIndex}
                      className={`p-2 border-l border-gold/30 min-h-[60px] ${isToday ? 'bg-peacock/5' : ''}`}
                    >
                      {bookings.map((booking, i) => (
                        <div 
                          key={i}
                          className={`text-xs p-2 rounded mb-1 ${
                            booking.status === 'approved' 
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-saffron/20 text-saffron border border-saffron/30'
                          }`}
                        >
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
        ) : (
          /* Day View */
          <div className="bg-white rounded-xl shadow-sm border border-gold/50 overflow-hidden">
            <div className="p-4 bg-muted/30 border-b border-gold/50">
              <p className="font-semibold text-foreground text-center">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="divide-y divide-gold/30">
              {timeSlots.map((time) => {
                const bookings = getBookingsForDate(currentDate).filter(b => b.time === time)
                
                return (
                  <div key={time} className="flex">
                    <div className="w-24 p-4 text-sm text-muted-foreground bg-muted/30 flex items-start justify-center shrink-0">
                      {time}
                    </div>
                    <div className="flex-1 p-4 min-h-[80px]">
                      {bookings.length > 0 ? (
                        bookings.map((booking, i) => (
                          <div 
                            key={i}
                            className={`p-3 rounded-lg ${
                              booking.status === 'approved' 
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-saffron/20 text-saffron border border-saffron/30'
                            }`}
                          >
                            <p className="font-semibold">{booking.room}</p>
                            <p className="text-sm opacity-80">{booking.purpose}</p>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground opacity-50">
                          Available
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
            <span className="text-sm text-muted-foreground">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-saffron/20 border border-saffron/30" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
