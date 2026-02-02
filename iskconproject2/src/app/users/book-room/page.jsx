'use client';

import { useEffect, useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { createBooking } from '@/actions/user/bookingsactions-user'
import { supabase } from '@/lib/supabase/client'
import { getResourcesForRoom } from '@/actions/user/userRoomResourceActions'
import { getAiSuggestions } from '@/actions/user/ai-actions'
import { toast } from 'sonner' // Assuming sonner is installed as per package.json

export default function BookRoomPage() {

  const [rooms, setRooms] = useState([])
  const [resources, setResources] = useState([])
  const [selectedResources, setSelectedResources] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // AI State
  const [showAi, setShowAi] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

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
    setShowAi(false) // Reset AI on change
    setSuggestions([])

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

  /* -------- AI SUGGESTIONS -------- */
  const fetchAiSuggestions = async () => {
    setAiLoading(true)
    const [start, end] = formData.timeSlot.split(' - ')

    const payload = {
      room_id: formData.roomId,
      date: formData.date,
      start_time: convertTo24Hour(start),
      end_time: convertTo24Hour(end),
    }

    const res = await getAiSuggestions(payload)
    if (res.success) {
      setSuggestions(res.data)
      // If no suggestions returned
      if (res.data.length === 0) {
        toast.info("No alternative slots found.")
      }
    } else {
      toast.error("Failed to get suggestions")
    }
    setAiLoading(false)
  }

  const applySuggestion = (s) => {
    // Find room ID if it changed
    // Convert 24h back to AM/PM slot string if necessary, 
    // OR mostly likely just set the values and let the user confirm.
    // Since our TimeSlots are hardcoded strings, we need to match them.

    // Simple logic: If the suggestion matches one of our predefined slots
    const formatTime = (time24) => {
      let [h, m] = time24.split(':')
      h = parseInt(h)
      const period = h >= 12 ? 'PM' : 'AM'
      if (h > 12) h -= 12
      if (h === 0) h = 12
      return `${h.toString().padStart(2, '0')}:${m} ${period}`
    }

    const startStr = formatTime(s.startTime)
    const endStr = formatTime(s.endTime)
    const slotStr = `${startStr} - ${endStr}`

    // Verify if this generated slot exists in our predefined list
    const isValidSlot = timeSlots.includes(slotStr)

    setFormData(prev => ({
      ...prev,
      roomId: s.roomId,
      date: s.date,
      timeSlot: isValidSlot ? slotStr : prev.timeSlot // Keep old if invalid, user might need to adjust
    }))

    if (!isValidSlot) {
      toast.warning(`Suggested time (${slotStr}) is not in standard slots. Please verify.`)
    } else {
      toast.success("Applied suggestion!")
    }

    setSuggestions([])
    setShowAi(false)
  }

  /* -------- SUBMIT -------- */
  const handleSubmit = async () => {
    try {
      if (!formData.roomId || !formData.date || !formData.timeSlot) {
        alert('Please fill all fields')
        return
      }

      setLoading(true)
      const [start, end] = formData.timeSlot.split(' - ')

      const payload = {
        room_id: formData.roomId,
        date: formData.date,
        start_time: convertTo24Hour(start),
        end_time: convertTo24Hour(end),
        purpose: formData.purpose || 'General Meeting',
        resources: selectedResources
      }

      const res = await createBooking(payload)

      if (res.success) {
        setSubmitted(true)
      } else {
        // alert(res.error || 'Booking failed')
        // Check if error is related to availability
        if (res.error === 'Room already booked') {
          setShowAi(true) // Trigger UI to show AI button
          toast.error("Slot unavailable. Try AI suggestions?")
        } else {
          toast.error(res.error)
        }
      }
    } catch (err) {
      console.error(err)
      alert('Unexpected error')
    } finally {
      setLoading(false)
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

        {/* AI SECTION - ONLY SHOWS ON FAILURE */}
        {showAi && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-red-700">
              <span className="font-semibold">Selected slot is unavailable.</span>
            </div>

            {suggestions.length === 0 ? (
              <button
                onClick={fetchAiSuggestions}
                disabled={aiLoading}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all font-medium shadow-md"
              >
                {aiLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                Ask AI for Alternate Slots
              </button>
            ) : (
              <div className="space-y-2 mt-2">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Sparkles size={14} className="text-purple-600" />
                  AI Suggestions:
                </p>
                {suggestions.map((s, idx) => (
                  <div key={idx} className="bg-white p-3 rounded border shadow-sm flex justify-between items-center group hover:border-purple-300 transition-colors">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-800">{s.roomName}</div>
                      <div className="text-gray-500">{s.date} • {s.startTime} - {s.endTime}</div>
                      <div className="text-xs text-indigo-600 mt-1">{s.reason}</div>
                    </div>
                    <button
                      onClick={() => applySuggestion(s)}
                      className="px-3 py-1 bg-gray-100 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded transition"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading || aiLoading}
          className="w-full bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
          Booking Request
        </button>
      </div>
    </DashboardLayout>
  )
}
