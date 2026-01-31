'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Get rooms with availability based on date & time
 * Output matches page.jsx roomsData exactly
 */
export async function getAvailableRooms({
  date,
  startTime,
  endTime,
}) {
  const supabase = createClient()

  // 1️⃣ Fetch all active rooms
  const { data: rooms, error: roomError } = await supabase
    .from('rooms')
    .select(`
      id,
      name,
      capacity,
      type,
      status,
      is_active,
      bookings (
        id,
        date,
        start_time,
        end_time,
        status
      )
    `)
    .eq('is_active', true)

  if (roomError) {
    console.error(roomError)
    throw new Error('Failed to fetch rooms')
  }

  // 2️⃣ Transform DB data → page.jsx format
  const formattedRooms = rooms.map((room) => {
    const hasConflict = room.bookings?.some((booking) => {
      if (booking.date !== date) return false
      if (booking.status === 'cancelled') return false

      // ⛔ Time overlap check
      return (
        booking.start_time < endTime &&
        booking.end_time > startTime
      )
    })

    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,

      // Derived amenities (customize freely)
      amenities: getAmenitiesByRoomType(room.type),

      available: !hasConflict,

      // Static placeholder (your UI already expects this)
      image: `/rooms/${room.name
        .toLowerCase()
        .replace(/\s+/g, '-')}.jpg`,
    }
  })

  return formattedRooms
}

/**
 * Helper: derive amenities from room type
 */
function getAmenitiesByRoomType(type) {
  switch (type) {
    case 'conference':
      return ['Projector', 'Whiteboard', 'AC', 'WiFi']
    case 'meeting':
      return ['TV Screen', 'Whiteboard', 'AC', 'WiFi']
    case 'hall':
      return ['Stage', 'Projector', 'Sound System', 'AC', 'WiFi']
    case 'training':
      return ['Computers', 'Projector', 'AC', 'WiFi']
    case 'board':
      return ['Video Conferencing', 'Projector', 'AC', 'WiFi']
    default:
      return ['AC', 'WiFi']
  }
}
