'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCalendarBookings(startDate, endDate) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      date,
      start_time,
      end_time,
      status,
      purpose,
      room_id,
      rooms (
        name
      )
    `)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Calendar fetch error:', error)
    throw new Error('Failed to fetch calendar bookings')
  }

  return data
}
