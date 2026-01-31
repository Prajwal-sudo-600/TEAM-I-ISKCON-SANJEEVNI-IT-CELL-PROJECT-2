'use server'

import { supabase } from '@/lib/supabase'

export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      date,
      start_time,
      end_time,
      status,
      purpose,
      remarks,
      created_at,
      users (
        full_name,
        email
      ),
      rooms (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function approveBooking(id) {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'Approved' })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function rejectBooking(id, remarks) {
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'Rejected',
      remarks
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
