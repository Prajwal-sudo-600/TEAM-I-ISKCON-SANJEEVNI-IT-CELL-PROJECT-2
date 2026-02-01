'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getResourcesForRoom(roomId) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('room_resources')
    .select(`
      resources (
        id,
        name
      )
    `)
    .eq('room_id', roomId)

  if (error) {
    console.error(error)
    return { success: false, data: [] }
  }

  // Flatten response
  const resources = data.map(r => r.resources)

  return { success: true, data: resources }
}
