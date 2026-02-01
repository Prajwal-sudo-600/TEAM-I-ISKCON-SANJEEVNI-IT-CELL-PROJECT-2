'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Get all resources with optional history
 * Expects tables:
 * - resources: id, name, category, quantity, status, remarks, created_at, updated_at
 * - resource_history: id, resource_id, action, details, changed_by, changed_at
 * @returns {Promise<{success: boolean, data: any[] | null, error: string | null}>}
 */
export async function getResources() {
  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching resources:', JSON.stringify(error, null, 2))
      return { success: false, data: null, error: error.message }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error('Unexpected error in getResources:', error)
    return { success: false, data: null, error: 'An unexpected error occurred' }
  }
}

/**
 * Create a new resource
 * @param {{ name: string, category: string, quantity: number, remarks?: string }} resourceData
 * @returns {Promise<{success: boolean, data: any | null, error: string | null}>}
 */
export async function createResource(resourceData) {
  try {
    const supabase = await createSupabaseServerClient()

    if (!resourceData.name?.trim()) {
      return { success: false, data: null, error: 'Resource name is required' }
    }

    // Removed quantity/status/category logic as columns do not exist

    const { data: newResource, error } = await supabase
      .from('resources')
      .insert({
        name: resourceData.name.trim(),
        // remarks: resourceData.remarks?.trim() || null, // commenting out mostly-likely missing column too to be safe, unless user confirms
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating resource:', error)
      return { success: false, data: null, error: error.message }
    }

    revalidatePath('/admin/resources')
    return { success: true, data: newResource, error: null }
  } catch (error) {
    console.error('Unexpected error in createResource:', error)
    return { success: false, data: null, error: 'An unexpected error occurred' }
  }
}

/**
 * Update an existing resource
 * @param {number} resourceId
 * @param {{ name?: string }} updates
 * @returns {Promise<{success: boolean, data: any | null, error: string | null}>}
 */
export async function updateResource(resourceId, updates) {
  try {
    const supabase = await createSupabaseServerClient()

    if (!resourceId) {
      return { success: false, data: null, error: 'Resource ID is required' }
    }

    const payload = {}

    if (updates.name) {
      payload.name = updates.name.trim()
    }

    if (Object.keys(payload).length === 0) {
      return { success: true, data: null, error: null }
    }

    const { data: updatedResource, error: updateError } = await supabase
      .from('resources')
      .update(payload)
      .eq('id', resourceId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating resource:', updateError)
      return { success: false, data: null, error: updateError.message }
    }

    revalidatePath('/admin/resources')
    return { success: true, data: updatedResource, error: null }
  } catch (error) {
    console.error('Unexpected error in updateResource:', error)
    return { success: false, data: null, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete a resource
 * @param {number} resourceId
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function deleteResource(resourceId) {
  try {
    const supabase = await createSupabaseServerClient()

    if (!resourceId) {
      return { success: false, error: 'Resource ID is required' }
    }

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', resourceId)

    if (error) {
      console.error('Error deleting resource:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/resources')
    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error in deleteResource:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}


/**
 * Assign a resource to a room
 * @param {number} resourceId
 * @param {number} roomId
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function assignResourceToRoom(resourceId, roomId) {
  try {
    const supabase = await createSupabaseServerClient()

    if (!resourceId || !roomId) {
      return { success: false, error: 'Resource ID and Room ID are required' }
    }

    const { error } = await supabase
      .from('room_resources')
      .insert({
        resource_id: resourceId,
        room_id: roomId
      })

    if (error) {
      // Check for unique violation (already assigned)
      if (error.code === '23505') {
        return { success: false, error: 'Resource is already assigned to this room' }
      }
      console.error('Error assigning resource:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/resources')
    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error in assignResourceToRoom:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Remove a resource from a room
 * @param {number} resourceId
 * @param {number} roomId
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function removeResourceFromRoom(resourceId, roomId) {
  try {
    const supabase = await createSupabaseServerClient()

    if (!resourceId || !roomId) {
      return { success: false, error: 'Resource ID and Room ID are required' }
    }

    const { error } = await supabase
      .from('room_resources')
      .delete()
      .eq('resource_id', resourceId)
      .eq('room_id', roomId)

    if (error) {
      console.error('Error removing resource:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/resources')
    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error in removeResourceFromRoom:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get all room assignments for a specific resource
 * @param {number} resourceId
 * @returns {Promise<{success: boolean, data: number[], error: string | null}>}
 */
export async function getResourceAssignments(resourceId) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('room_resources')
    .select('room_id')
    .eq('resource_id', resourceId)

  if (error) {
    console.error('Error fetching assignments:', error)
    return { success: false, data: [] }
  }

  return { success: true, data: data.map(r => r.room_id) }
}
