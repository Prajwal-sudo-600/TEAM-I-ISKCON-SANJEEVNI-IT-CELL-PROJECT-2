'use client';

import { useEffect, useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { Send } from 'lucide-react'
import { createBooking } from '@/actions/user/bookingsactions-user'
import { supabase } from '@/lib/supabase/client'
import { getResourcesForRoom } from '@/actions/user/userRoomResourceActions'

export default function BookRoomPage() {

  const [rooms, setRooms] = useState([])
  const [resources, setResources] = useState([])
  const [selectedResources, setSelectedResources] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    roomId: '',
    date: '',
    timeSlot: '',
    purpose: '',
  })

  /* -------- RESOURCE TOGGLE -------- */
  const toggleResource = (id) => {
    setSelectedResources(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    )
  }

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
  ]

  /* -------- FETCH ROOMS -------- */
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, name')
        .eq('is_active', true)

      if (!error) setRooms(data || [])
    }

    fetchRooms()
  }, [])

  /* -------- ROOM CHANGE -------- */
  const handleRoomChange = async (roomId) => {
    setFormData({ ...formData, roomId })
    setSelectedResources([])

    if (!roomId) {
      setResources([])
      return
    }

    const res = await getResourcesForRoom(roomId)
    if (res.success) {
      setResources(res.data || [])
    }
  }

  /* -------- TIME CONVERTER -------- */
  const convertTo24Hour = (time) => {
    const [hm, period] = time.split(' ')
    let [h, m] = hm.split(':')
    h = parseInt(h)

    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0

    return `${h.toString().padStart(2, '0')}:${m}`
  }

  /* -------- SUBMIT -------- */
  const handleSubmit = async () => {
    try {
      if (!formData.roomId || !formData.date || !formData.timeSlot) {
        alert('Please fill all fields')
        return
      }

      const [start, end] = formData.timeSlot.split(' - ')

      const payload = {
        room_id: formData.roomId,
        date: formData.date,
        start_time: convertTo24Hour(start),
        end_time: convertTo24Hour(end),
        purpose: formData.purpose || 'General Meeting',
        resources: selectedResources   // 🔴 IMPORTANT
      }

      const res = await createBooking(payload)

      if (res.success) {
        setSubmitted(true)
      } else {
        alert(res.error || 'Booking failed')
      }
    } catch (err) {
      console.error(err)
      alert('Unexpected error')
    }
  }

  /* -------- SUCCESS -------- */
  if (submitted) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          <h2 className="text-2xl font-bold">Booking Submitted Successfully</h2>
          <p className="mt-4">Your request is now pending approval.</p>
        </div>
      </DashboardLayout>
    )
  }

  /* -------- FORM -------- */
  return (
    <DashboardLayout>
      <BackButton />

      <div className="max-w-xl mx-auto mt-6 space-y-4">
        <h1 className="text-xl font-bold">Book a Room</h1>

        {/* ROOM SELECT */}
        <select
          value={formData.roomId}
          onChange={(e) => handleRoomChange(e.target.value)}
          className="w-full border border-input bg-card text-foreground p-2 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>

        {/* RESOURCES CHECKBOX */}
        {resources.length > 0 && (
          <div className="border border-border rounded-xl p-3 bg-muted/50">
            <p className="font-semibold mb-2">Select Resources</p>
            {resources.map((r) => (
              <label key={r.id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedResources.includes(r.id)}
                  onChange={() => toggleResource(r.id)}
                />
                {r.name}
              </label>
            ))}
          </div>
        )}

        {/* DATE */}
        <input
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          className="w-full border border-input bg-card text-foreground p-2 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />

        {/* TIME */}
        <select
          value={formData.timeSlot}
          onChange={(e) =>
            setFormData({ ...formData, timeSlot: e.target.value })
          }
          className="w-full border p-2 rounded"
        >
          <option value="">Select Time Slot</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        {/* PURPOSE */}
        <input
          type="text"
          placeholder="Purpose"
          value={formData.purpose}
          onChange={(e) =>
            setFormData({ ...formData, purpose: e.target.value })
          }
          className="w-full border border-input bg-card text-foreground p-2 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2"
        >
          <Send size={18} />
          Submit Booking
        </button>
      </div>
    </DashboardLayout>
  )
}
