'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getDashboardData() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false }

  // User bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      date,
      start_time,
      end_time,
      status,
      purpose,
      rooms(name)
    `)
    .eq('user_id', user.id)

  // Rooms count
  const { count: roomsCount } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const today = new Date().toISOString().split('T')[0]

  return {
    success: true,
    data: {
      roomsToday: roomsCount || 0,
      totalBookings: bookings?.length || 0,
      pending: bookings?.filter(b => b.status === 'pending').length || 0,
      approved: bookings?.filter(b => b.status === 'approved').length || 0,
      todaySchedule: bookings?.filter(b => b.date === today) || []
    }
  }
}
