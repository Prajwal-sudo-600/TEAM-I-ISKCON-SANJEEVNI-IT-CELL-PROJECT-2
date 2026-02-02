'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from "@/lib/supabase/server";



/* ---------------- CREATE BOOKING ---------------- */
/* ---------------- CREATE BOOKING ---------------- */
export async function createBooking(bookingData) {
  try {
    const supabase = await createSupabaseServerClient()
    const adminSupabase = await createSupabaseServerClient({ admin: true })

    console.log("Incoming bookingData:", bookingData)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    /* ---- OVERLAP CHECK (FIXED) ---- */
    // Use admin client to bypass RLS and see ALL bookings
    const { data: overlapping } = await adminSupabase
      .from('bookings')
      .select('id')
      .eq('room_id', bookingData.room_id)
      .eq('date', bookingData.date)
      .in('status', ['pending', 'approved'])
      .lt('start_time', bookingData.end_time)
      .gt('end_time', bookingData.start_time)

    if (overlapping && overlapping.length > 0) {
      return { success: false, error: 'Room already booked' }
    }

    /* ---- INSERT BOOKING ---- */
    const { data: newBooking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        room_id: bookingData.room_id,
        date: bookingData.date,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        purpose: bookingData.purpose,
        status: 'pending',
        remarks: null
      })
      .select()
      .single()

    if (insertError) {
      console.error(insertError)
      return { success: false, error: insertError.message }
    }

    /* ---- SAVE RESOURCES ---- */
    if (bookingData.resources && bookingData.resources.length > 0) {
      const resourceRows = bookingData.resources.map(resourceId => ({
        booking_id: newBooking.id,
        resource_id: resourceId
      }))

      const { error: resourceError } = await supabase
        .from('booking_resources')
        .insert(resourceRows)

      if (resourceError) {
        console.error('Resource insert error:', resourceError)
      }
    }

    /* ---- HISTORY ---- */
    await supabase.from('booking_history').insert({
      booking_id: newBooking.id,
      status: 'pending',
      changed_by: 'system',
      changed_at: new Date().toISOString(),
      remarks: null
    })

    revalidatePath('/bookings')
    revalidatePath('/admin/bookings')

    return { success: true, data: newBooking }

  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Unexpected error' }
  }
}



/* ---------------- AVAILABLE ROOMS (FIXED) ---------------- */
export async function getAvailableRooms(date, startTime, endTime) {
  try {
    const supabase = await createSupabaseServerClient()
    const adminSupabase = await createSupabaseServerClient({ admin: true })

    const { data: allRooms } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_active', true)

    // Use admin client to see ALL booked rooms
    const { data: bookedRooms } = await adminSupabase
      .from('bookings')
      .select('room_id')
      .eq('date', date)
      .in('status', ['pending', 'approved'])
      .lt('start_time', endTime)
      .gt('end_time', startTime)

    const bookedIds = bookedRooms.map(b => b.room_id)
    const availableRooms = allRooms.filter(r => !bookedIds.includes(r.id))

    return { success: true, data: availableRooms }

  } catch (error) {
    console.error(error)
    return { success: false }
  }
}
