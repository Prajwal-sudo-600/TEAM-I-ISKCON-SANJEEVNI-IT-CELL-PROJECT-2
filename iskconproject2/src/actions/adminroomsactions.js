'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Get all rooms for admin management
 * @returns {Promise<{success: boolean, data: any[] | null, error: string | null}>}
 */
export async function getRooms() {
  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching rooms:', error)
      return { success: false, data: null, error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error('Unexpected error in getRooms:', error)
    return { success: false, data: null, error: 'An unexpected error occurred' }
  }
}

/**
 * Create a new room
 * @param {{ name: string, capacity: number, type: string, status: 'Active' | 'Maintenance' }} roomData
 * @returns {Promise<{success: boolean, data: any | null, error: string | null}>}
 */
export async function createRoom(roomData) {
  try {
    const supabase = await createSupabaseServerClient()

    if (!roomData.name?.trim()) {
      return { success: false, data: null, error: 'Room name is required' }
    }

    const capacity = Number(roomData.capacity)
    if (!Number.isFinite(capacity) || capacity <= 0) {
      return { success: false, data: null, error: 'Capacity must be a positive number' }
    }

    const status = roomData.status === 'Maintenance' ? 'Maintenance' : 'Active'

    const { data: newRoom, error } = await supabase
      .from('rooms')
      .insert({
        name: roomData.name.trim(),
        capacity,
        type: roomData.type || 'Meeting',
        status,
        is_active: status === 'Active',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating room:', error)
      return { success: false, data: null, error: error.message }
    }

    revalidatePath('/admin/rooms')
    return { success: true, data: newRoom, error: null }
  } catch (error) {
    console.error('Unexpected error in createRoom:', error)
    return { success: false, data: null, error: 'An unexpected error occurred' }
  }
}

/**
 * Update an existing room
 * @param {number} roomId
 * @param {{ name?: string, capacity?: number, type?: string, status?: 'Active' | 'Maintenance' }} updates
 * @returns {Promise<{success: boolean, data: any | null, error: string | null}>}
 */
export async function updateRoom(roomId, updates) {
  try {
    const supabase = await createSupabaseServerClient()

    if (!roomId) {
      return { success: false, data: null, error: 'Room ID is required' }
    }

    const payload = { ...updates }

    if (payload.name) {
      payload.name = payload.name.trim()
    }

    if (payload.capacity !== undefined) {
      const capacity = Number(payload.capacity)
      if (!Number.isFinite(capacity) || capacity <= 0) {
        return { success: false, data: null, error: 'Capacity must be a positive number' }
      }
      payload.capacity = capacity
    }

    if (payload.status) {
      payload.status = payload.status === 'Maintenance' ? 'Maintenance' : 'Active'
      payload.is_active = payload.status === 'Active'
    }

    const { data: updatedRoom, error } = await supabase
      .from('rooms')
      .update(payload)
      .eq('id', roomId)
      .select()
      .single()

    if (error) {
      console.error('Error updating room:', error)
      return { success: false, data: null, error: error.message }
    }

    revalidatePath('/admin/rooms')
    return { success: true, data: updatedRoom, error: null }
  } catch (error) {
    console.error('Unexpected error in updateRoom:', error)
    return { success: false, data: null, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete a room
 * @param {number} roomId
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function deleteRoom(roomId) {
  try {
    const supabase = await createSupabaseServerClient()

    if (!roomId) {
      return { success: false, error: 'Room ID is required' }
    }

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId)

    if (error) {
      console.error('Error deleting room:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/rooms')
    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error in deleteRoom:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

