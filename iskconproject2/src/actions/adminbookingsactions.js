'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'


export async function approveBooking(bookingId) {
    // 🔑 MUST be admin to bypass RLS
    const supabase = await createSupabaseServerClient({ admin: true })

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'approved', remarks: null })
        .eq('id', bookingId)

    if (error) {
        console.error('Approve error:', error)
        return { success: false }
    }

    // keep your history logic as-is
    await supabase.from('booking_history').insert({
        booking_id: bookingId,
        status: 'approved',
        changed_by: 'Admin',
    })

    revalidatePath('/admin/bookings')
    return { success: true }
}


export async function rejectBooking(bookingId, reason) {
    // 🔑 MUST be admin to bypass RLS
    const supabase = await createSupabaseServerClient({ admin: true })

    const { error } = await supabase
        .from('bookings')
        .update({
            status: 'rejected',
            remarks: reason,
        })
        .eq('id', bookingId)

    if (error) {
        console.error('Reject error:', error)
        return { success: false }
    }

    // keep your history logic as-is
    await supabase.from('booking_history').insert({
        booking_id: bookingId,
        status: 'rejected',
        changed_by: 'Admin',
        remarks: reason,
    })

    revalidatePath('/admin/bookings')
    return { success: true }
}


export async function deleteBooking(bookingId) {
    // 🔑 MUST be admin to bypass RLS
    const supabase = await createSupabaseServerClient({ admin: true })

    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

    if (error) {
        console.error('Delete error:', error)
        return { success: false }
    }

    // We likely want to log this deletion in history or audit logs if possible, 
    // but the table row is gone. 
    // In a real app we might soft-delete. 
    // For now we just hard delete as requested.

    revalidatePath('/admin/bookings')
    return { success: true }
}


export async function getBookings() {
    try {
        const supabase = await createSupabaseServerClient({ admin: true })

        const { data, error } = await supabase
            .from('bookings')
            .select(`
        id,
        user_id,
        date,
        start_time,
        end_time,
        purpose,
        status,
        remarks,
        created_at,
        profiles (
          full_name
        ),
        rooms (
          name
        ),
        booking_history (
          status,
          changed_by,
          changed_at
        )
      `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Admin booking fetch error:', error.message, error.details, error.hint)
            return { success: false, data: [] }
        }

        // Fetch all users to map emails/names
        const { data: { users }, error: usersError } =
            await supabase.auth.admin.listUsers({ perPage: 1000 })

        if (usersError) {
            console.error('User list fetch error:', usersError)
        }

        const userMap = new Map((users || []).map(u => [u.id, u]))

        const enrichedData = data.map(booking => {
            const user = userMap.get(booking.user_id)
            const profileName = booking.profiles?.full_name

            const finalName =
                profileName ||
                user?.user_metadata?.full_name ||
                user?.email ||
                'Unknown User'

            const email = user?.email || ''

            return {
                ...booking,
                profiles: {
                    ...(booking.profiles || {}),
                    full_name: finalName,
                },
                user_email: email,
            }
        })

        return { success: true, data: enrichedData }
    } catch (err) {
        console.error('Unexpected admin booking error:', err)
        return { success: false, data: [] }
    }
}
