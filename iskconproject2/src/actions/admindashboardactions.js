'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
    const supabase = await createSupabaseServerClient()

    try {
        const today = new Date().toISOString().split('T')[0]

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
        // Need to join with profiles and rooms to get names
        const { data: recentBookings, error: recentError } = await supabase
            .from('bookings')
            .select(`
        id,
        status,
        date,
        created_at,
        profiles ( full_name ),
        rooms ( name )
      `)
            .order('created_at', { ascending: false })
            .limit(5)

        if (bookingsError || roomsError || resourcesError || pendingError || usersError || todayError || recentError) {
            console.error('Error fetching dashboard stats:', bookingsError || roomsError || resourcesError)
            return { success: false, error: 'Failed to fetch stats' }
        }

        /* -- Quick math for "Available Rooms" roughly --
           (Ideally we check if they are booked *right now*, but for summary stats, 
            Active Rooms is a good proxy, or Active Rooms - Occupied Now.
            Let's just use Active Rooms count for now or a static placeholder)
        */

        return {
            success: true,
            data: {
                totalBookings: totalBookings || 0,
                activeRooms: activeRooms || 0,
                totalResources: totalResources || 0,
                pendingRequests: pendingRequests || 0,
                activeUsers: activeUsers || 0,
                todaysBookings: todaysBookings || 0,
                recentBookings: recentBookings.map(b => ({
                    id: b.id,
                    user: b.profiles?.full_name || 'Unknown',
                    room: b.rooms?.name || 'Unknown',
                    date: b.date,
                    status: b.status.charAt(0).toUpperCase() + b.status.slice(1) // Capitalize
                }))
            }
        }

    } catch (error) {
        console.error('Unexpected dashboard error:', error)
        return { success: false, error: 'Unexpected error' }
    }
}
