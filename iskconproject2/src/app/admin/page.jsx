"use client"

import { useState, useEffect } from 'react'
import AdminLayout from './components/admin/admin-layout'
import { CalendarCheck, DoorOpen, Package, Clock, TrendingUp, Users } from 'lucide-react'

const summaryCards = [
  {
    title: 'Total Bookings',
    value: 156,
    icon: CalendarCheck,
    trend: '+12%',
    color: 'bg-primary'
  },
  {
    title: 'Active Rooms',
    value: 24,
    icon: DoorOpen,
    trend: '+3',
    color: 'bg-[#1F4E79]'
  },
  {
    title: 'Resources',
    value: 89,
    icon: Package,
    trend: '+5',
    color: 'bg-[#1F4E79]/80'
  },
  {
    title: 'Pending Requests',
    value: 18,
    icon: Clock,
    trend: '-2',
    color: 'bg-accent'
  },
]

// Removed static recentBookings array


const devotionalQuotes = [
  "Service to the Lord is the highest form of devotion.",
  "In the service of the Lord, even small actions carry great significance.",
  "Through seva, we purify our hearts and minds.",
  "May every action be an offering to the Divine.",
]

import { getDashboardStats } from '@/actions/admindashboardactions'

export default function Dashboard() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Real Data States
  const [statsData, setStatsData] = useState({
    totalBookings: 0,
    activeRooms: 0,
    totalResources: 0,
    pendingRequests: 0,
    activeUsers: 0,
    todaysBookings: 0
  })
  const [recentBookingsList, setRecentBookingsList] = useState([])

  useEffect(() => {
    // Quote rotation
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % devotionalQuotes.length)
    }, 10000)

    // Fetch Real Data
    const loadData = async () => {
      setIsLoading(true)
      const res = await getDashboardStats()
      if (res.success && res.data) {
        setStatsData({
          totalBookings: res.data.totalBookings,
          activeRooms: res.data.activeRooms,
          totalResources: res.data.totalResources,
          pendingRequests: res.data.pendingRequests,
          activeUsers: res.data.activeUsers,
          todaysBookings: res.data.todaysBookings
        })
        setRecentBookingsList(res.data.recentBookings)
      }
      setIsLoading(false)
    }
    loadData()

    return () => clearInterval(interval)
  }, [])

  // Construct summary cards dynamically
  const summaryCards = [
    {
      title: 'Total Bookings',
      value: statsData.totalBookings,
      icon: CalendarCheck,
      trend: 'Lifetime',
      color: 'bg-primary'
    },
    {
      title: 'Active Rooms',
      value: statsData.activeRooms,
      icon: DoorOpen,
      trend: 'Available',
      color: 'bg-[#1F4E79]'
    },
    {
      title: 'Resources',
      value: statsData.totalResources,
      icon: Package,
      trend: 'In Stock',
      color: 'bg-[#1F4E79]/80'
    },
    {
      title: 'Pending Requests',
      value: statsData.pendingRequests,
      icon: Clock,
      trend: 'Action Needed',
      color: 'bg-accent'
    },
  ]


  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome Section */}
      <div className="mb-8 p-6 bg-card rounded-xl border border-border shadow-sm">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Hare Krishna
        </h2>
        <p className="text-lg text-foreground/90 mb-4">
          Welcome to ISKCON Sanjeevani IT Cell - Admin Dashboard
        </p>
        <p className="text-sm text-muted-foreground italic border-l-2 border-accent pl-4">
          "{devotionalQuotes[currentQuote]}"
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-foreground">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {card.trend} from last month
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
            <p className="text-sm text-muted-foreground">Latest booking requests and their status</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Room</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
                  ) : recentBookingsList.length === 0 ? (
                    <tr><td colSpan="4" className="p-4 text-center">No recent bookings</td></tr>
                  ) : (
                    recentBookingsList.map((booking) => (
                      <tr key={booking.id} className="border-b border-border/50 last:border-0">
                        <td className="py-4 text-sm text-foreground">{booking.user}</td>
                        <td className="py-4 text-sm text-foreground">{booking.room}</td>
                        <td className="py-4 text-sm text-muted-foreground">{booking.date}</td>
                        <td className="py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
            <p className="text-sm text-muted-foreground">System overview</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Active Users</span>
              </div>
              <span className="text-lg font-semibold text-foreground">{statsData.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Today's Bookings</span>
              </div>
              <span className="text-lg font-semibold text-foreground">{statsData.todaysBookings}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <DoorOpen className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Active Rooms</span>
              </div>
              <span className="text-lg font-semibold text-foreground">{statsData.activeRooms}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground">Pending Approvals</span>
              </div>
              <span className="text-lg font-semibold text-foreground">{statsData.pendingRequests}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
