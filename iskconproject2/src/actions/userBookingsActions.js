'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getMyBookings() {
  try {
    const supabase = await createSupabaseServerClient()

    // Get logged-in user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('No user found')
      return { success: false, data: null }
    }

    // Fetch bookings for this user only
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        date,
        start_time,
        end_time,
        purpose,
        status,
        created_at,
        rooms ( name )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Booking fetch error:', error)
      return { success: false, data: null }
    }

    return { success: true, data }

  } catch (err) {
    console.error('Unexpected error:', err)
    return { success: false, data: null }
  }
}
