'use server'

import { createClient } from '@/lib/supabase/server'

export async function bookRoom(formData) {
  const supabase = createClient()

  
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Unauthorized')
  }

  
  const [startLabel, endLabel] = formData.timeSlot.split(' - ')

  const to24Hour = (time) => {
    const [t, modifier] = time.split(' ')
    let [hours, minutes] = t.split(':')
    hours = parseInt(hours, 10)

    if (modifier === 'PM' && hours !== 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0

    return `${hours.toString().padStart(2, '0')}:${minutes}:00`
  }

  const start_time = to24Hour(startLabel)
  const end_time = to24Hour(endLabel)

  
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      room_id: formData.roomId,
      user_id: user.id,
      date: formData.date,
      start_time,
      end_time,
      status: 'pending',
      purpose:
        formData.purpose === 'Other'
          ? formData.customPurpose
          : formData.purpose,
      remarks: formData.notes || null
    })
    .select('id')
    .single()

  if (bookingError) {
    console.error('Booking error:', bookingError)
    throw new Error('Failed to create booking')
  }

  
  if (formData.resources && formData.resources.length > 0) {
    const resourceRows = formData.resources.map((resource_id) => ({
      booking_id: booking.id,
      resource_id
    }))

    const { error: resourceError } = await supabase
      .from('booking_resources')
      .insert(resourceRows)

    if (resourceError) {
      console.error('Resource error:', resourceError)
      throw new Error('Booking created, but resources failed')
    }
  }

  return { success: true, booking_id: booking.id }
}