'use client'

import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { Users, Monitor, Wifi, Calendar, Eye, CalendarPlus } from 'lucide-react'
import Link from 'next/link'

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
]

const roomsData = [
  {
    id: 1,
    name: 'Conference Room A',
    capacity: 20,
    amenities: ['Projector', 'Whiteboard', 'AC', 'WiFi'],
    available: true,
    image: '/rooms/conference-a.jpg',
  },
  {
    id: 2,
    name: 'Meeting Room B',
    capacity: 10,
    amenities: ['TV Screen', 'Whiteboard', 'AC', 'WiFi'],
    available: true,
    image: '/rooms/meeting-b.jpg',
  },
  {
    id: 3,
    name: 'Hall C',
    capacity: 50,
    amenities: ['Stage', 'Projector', 'Sound System', 'AC', 'WiFi'],
    available: false,
    image: '/rooms/hall-c.jpg',
  },
  {
    id: 4,
    name: 'Training Room D',
    capacity: 30,
    amenities: ['Computers', 'Projector', 'AC', 'WiFi'],
    available: true,
    image: '/rooms/training-d.jpg',
  },
  {
    id: 5,
    name: 'Small Meeting Room E',
    capacity: 6,
    amenities: ['TV Screen', 'Whiteboard', 'AC'],
    available: true,
    image: '/rooms/small-e.jpg',
  },
  {
    id: 6,
    name: 'Board Room F',
    capacity: 15,
    amenities: ['Video Conferencing', 'Projector', 'AC', 'WiFi'],
    available: true,
    image: '/rooms/board-f.jpg',
  },
]

export default function AvailableRoomsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <BackButton />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-peacock mb-2">Available Rooms</h1>
          <p className="text-muted-foreground">Browse and book rooms for your seva activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gold/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Select Time Slot</label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all bg-white"
              >
                <option value="">All Time Slots</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomsData.map((room) => (
            <div 
              key={room.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
                room.available ? 'border-gold/50' : 'border-destructive/30 opacity-75'
              }`}
            >
              {/* Room Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-peacock/10 to-saffron/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-peacock/10 flex items-center justify-center mb-2">
                    <Users className="w-8 h-8 text-peacock" />
                  </div>
                  <p className="text-sm text-muted-foreground">Capacity: {room.capacity}</p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-lg">{room.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    room.available 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {room.available ? 'Available' : 'Booked'}
                  </span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 3).map((amenity) => (
                    <span 
                      key={amenity}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                    >
                      {amenity === 'WiFi' && <Wifi className="w-3 h-3" />}
                      {amenity === 'Projector' && <Monitor className="w-3 h-3" />}
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                      +{room.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-peacock text-peacock rounded-lg hover:bg-peacock hover:text-white transition-all text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    View Schedule
                  </button>
                  {room.available && (
                    <Link 
                      href={`/book-room?room=${room.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-saffron text-white rounded-lg hover:bg-saffron/90 transition-all text-sm font-medium"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      Book
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
