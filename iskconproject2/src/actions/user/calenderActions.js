'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getCalendarBookings() {
  try {
    const supabase = await createSupabaseServerClient()

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
        rooms ( name )
      `)
      .order('date')

    if (error) {
      console.error(error)
      return { success: false, data: null }
    }

    return { success: true, data }
  } catch (e) {
    console.error(e)
    return { success: false, data: null }
  }
}