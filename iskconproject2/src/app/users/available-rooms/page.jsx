'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { Users, Monitor, Wifi, Eye, CalendarPlus } from 'lucide-react'
import Link from 'next/link'
import { getActiveRooms } from '@/actions/user/userroomactions'
import { getAvailableRooms } from '@/actions/user/bookingsactions-user'

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
]

// Helper to parse "09:00 AM - 10:00 AM" -> { start: "09:00:00", end: "10:00:00" }
const processTimeSlot = (slot) => {
  if (!slot) return null

  const [startRaw, endRaw] = slot.split(' - ')

  const formatTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ')
    let [hours, minutes] = time.split(':')

    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12'
    } else if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12
    }

    return `${hours}:${minutes}:00`
  }

  return {
    start: formatTime(startRaw),
    end: formatTime(endRaw)
  }
}

export default function AvailableRoomsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [roomsData, setRoomsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      let res

      if (selectedTimeSlot) {
        // Filter by availability
        const { start, end } = processTimeSlot(selectedTimeSlot)
        res = await getAvailableRooms(selectedDate, start, end)
      } else {
        // Show all active rooms
        res = await getActiveRooms()
      }

      console.log("ROOMS RESPONSE:", res)

      if (res.success && res.data) {
        const mapped = res.data.map(r => ({
          id: r.id,
          name: r.name,
          capacity: r.capacity,
          amenities: r.room_resources?.map(rr => rr.resources?.name).filter(Boolean) || [],
          available: true,
        }))
        setRoomsData(mapped)
      } else {
        setRoomsData([])
      }

      setLoading(false)
    }

    fetchRooms()
  }, [selectedDate, selectedTimeSlot])


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Available Rooms</h1>
          <p className="text-muted-foreground">Browse and book rooms for your seva activities</p>
        </div>

        {/* Filters UI unchanged */}
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border mb-6">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <select value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)}>
            <option value="">All Time Slots</option>
            {timeSlots.map(slot => <option key={slot}>{slot}</option>)}
          </select>
        </div>

        {/* Cards */}
        {loading ? (
          <p>Loading rooms...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsData.map(room => (
              <div key={room.id} className="bg-card rounded-xl shadow-sm border border-border p-5">
                <h3 className="font-semibold">{room.name}</h3>
                <p>Capacity: {room.capacity}</p>

                {room.amenities.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-muted-foreground">Resources:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {room.amenities.map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-secondary/40 text-muted-foreground px-2 py-1 rounded-md">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/users/book-room?room=${room.id}&date=${selectedDate}&timeSlot=${encodeURIComponent(selectedTimeSlot)}`}
                    className="bg-saffron text-white px-3 py-2 rounded w-full text-center"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
