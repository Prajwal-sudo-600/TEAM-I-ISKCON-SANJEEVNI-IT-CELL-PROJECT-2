'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/* =========================
   GET CURRENT PROFILE
========================= */
export async function getCurrentProfile() {
    const supabase = await createSupabaseServerClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'Not authenticated' }

        // Fetch profile data
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) {
            // If profile doesn't exist, try to create one or return basic auth info
            if (error.code === 'PGRST116') {
                return {
                    success: true,
                    data: {
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || '',
                        role: 'admin', // Default display, real role is in DB
                        created_at: user.created_at
                    }
                }
            }
            return { success: false, error: error.message }
        }

        // Merge email from auth user as it might not be in profiles or could be different
        return {
            success: true,
            data: { ...profile, email: user.email }
        }

    } catch (error) {
        console.error('Error fetching profile:', error)
        return { success: false, error: 'Unexpected error' }
    }
}

/* =========================
   UPDATE PROFILE
========================= */
export async function updateProfile(formData) {
    const supabase = await createSupabaseServerClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'Unauthorized' }

        const updates = {
            full_name: formData.full_name,
            contact_number: formData.contact_number,
            address: formData.address,
            updated_at: new Date().toISOString()
        }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)

        if (error) return { success: false, error: error.message }

        revalidatePath('/admin/profile')
        return { success: true }

    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: 'Unexpected error' }
    }
}

/* =========================
   UPDATE EMAIL
========================= */
export async function updateEmail(newEmail) {
    const supabase = await createSupabaseServerClient()

    try {
        const { error } = await supabase.auth.updateUser({ email: newEmail })
        if (error) return { success: false, error: error.message }

        return { success: true, message: 'Confirmation link sent to new email' }

    } catch (error) {
        return { success: false, error: 'Unexpected error' }
    }
}

/* =========================
   UPDATE PASSWORD
========================= */
export async function updatePassword(currentPassword, newPassword) {
    // Note: Supabase updateUser doesn't require current password if logged in, 
    // but good practice might involve re-auth if strict security needed. 
    // For now, we proceed with direct update.

    const supabase = await createSupabaseServerClient()

    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) return { success: false, error: error.message }

        return { success: true }

    } catch (error) {
        return { success: false, error: 'Unexpected error' }
    }
}

/* =========================
   GET USER STATS
========================= */
export async function getUserStats() {
    const supabase = await createSupabaseServerClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'Unauthorized' }

        // We are assuming admin wants stats for ALL bookings or THEIR bookings?
        // Usually Admin Profile shows system stats or their own activity.
        // Let's assume Admin wants to see Global Stats since they are Admin.

        // Count total
        const { count: total, error: err1 } = await supabase
            .from('bookings').select('*', { count: 'exact', head: true })

        const { count: pending, error: err2 } = await supabase
            .from('bookings').select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

        const { count: approved, error: err3 } = await supabase
            .from('bookings').select('*', { count: 'exact', head: true })
            .eq('status', 'approved')

        const { count: rejected, error: err4 } = await supabase
            .from('bookings').select('*', { count: 'exact', head: true })
            .eq('status', 'rejected')

        if (err1 || err2 || err3 || err4) {
            console.error(err1, err2, err3, err4)
            return { success: false, error: 'Failed to fetch stats' }
        }

        return {
            success: true,
            data: {
                total_bookings: total || 0,
                pending_bookings: pending || 0,
                approved_bookings: approved || 0,
                rejected_bookings: rejected || 0
            }
        }

    } catch (error) {
        return { success: false, error: 'Unexpected error' }
    }
}

/* =========================
   GET RECENT ACTIVITY
========================= */
export async function getUserActivity(limit = 5) {
    const supabase = await createSupabaseServerClient()

    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                id,
                status,
                created_at,
                date,
                rooms ( name )
            `)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) return { success: false, error: error.message }

        const mapped = data.map(b => ({
            id: b.id,
            status: capitalize(b.status),
            booking_date: b.date,
            room: b.rooms?.name || 'Unknown Room'
        }))

        return { success: true, data: mapped }

    } catch (error) {
        return { success: false, error: 'Unexpected error' }
    }
}

/* =========================
   LOGOUT
========================= */
export async function logout() {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
    redirect('/')
}

function capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}
