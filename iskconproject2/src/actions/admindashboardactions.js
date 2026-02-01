'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
    const supabase = await createSupabaseServerClient({ admin: true })

    try {
        const today = new Date().toISOString().split('T')[0]

        // ... existing queries ...

        // 1. Total Bookings
        const { count: totalBookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })

        // 2. Active Rooms
        const { count: activeRooms, error: roomsError } = await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)

        // 3. Resources
        const { count: totalResources, error: resourcesError } = await supabase
            .from('resources')
            .select('*', { count: 'exact', head: true })

        // 4. Pending Requests
        const { count: pendingRequests, error: pendingError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

        // 5. Active Users (Profiles)
        const { count: activeUsers, error: usersError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        // 6. Today's Bookings
        const { count: todaysBookings, error: todayError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('date', today)

        // 7. Recent Bookings (Limit 5)
        // Fetch raw bookings first, then enrich with User data from Auth Admin
        const { data: recentBookingsRaw, error: recentError } = await supabase
            .from('bookings')
            .select(`
        id,
        user_id,
        status,
        date,
        created_at,
        rooms ( name )
      `)
            .order('created_at', { ascending: false })
            .limit(5)

        if (bookingsError || roomsError || resourcesError || pendingError || usersError || todayError || recentError) {
            console.error('Error fetching dashboard stats:', bookingsError || roomsError || resourcesError || recentError)
            return { success: false, error: 'Failed to fetch stats' }
        }

        // Enrich with User Details
        const recentBookings = await Promise.all(recentBookingsRaw.map(async (b) => {
            let userName = 'Unknown User'
            if (b.user_id) {
                const { data: { user }, error: uErr } = await supabase.auth.admin.getUserById(b.user_id)
                if (user) {
                    userName = user.user_metadata?.full_name || user.email || 'Unknown User'
                }
            }

            return {
                id: b.id,
                user: userName,
                room: b.rooms?.name || 'Unknown Room',
                date: b.date,
                status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
            }
        }))

        return {
            success: true,
            data: {
                totalBookings: totalBookings || 0,
                activeRooms: activeRooms || 0,
                totalResources: totalResources || 0,
                pendingRequests: pendingRequests || 0,
                activeUsers: activeUsers || 0,
                todaysBookings: todaysBookings || 0,
                recentBookings: recentBookings
            }
        }

    } catch (error) {
        console.error('Unexpected dashboard error:', error)
        return { success: false, error: 'Unexpected error' }
    }
}
