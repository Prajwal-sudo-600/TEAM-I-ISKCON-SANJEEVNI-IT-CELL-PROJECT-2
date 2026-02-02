'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getActiveRooms() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('rooms')
    .select(`
      id, 
      name, 
      capacity, 
      type, 
      room_resources (
        resources (
          name
        )
      )
    `)
    .eq('status', 'Active')   // ← FIXED
    .order('name')

  if (error) {
    console.error(error)
    return { success: false, data: null }
  }

  return { success: true, data }
}
