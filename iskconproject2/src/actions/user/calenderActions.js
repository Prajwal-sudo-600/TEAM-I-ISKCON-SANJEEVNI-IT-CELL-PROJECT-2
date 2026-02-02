'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getCalendarBookings() {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

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
      .eq('user_id', user.id)
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