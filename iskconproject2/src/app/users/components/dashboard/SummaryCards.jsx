'use client'

import { DoorOpen, FileText, Clock, CheckCircle } from 'lucide-react'

export default function SummaryCards({ data, loading }) {

  const summaryData = [
    {
      title: 'Available Rooms Today',
      value: data?.roomsToday ?? 0,
      icon: DoorOpen,
      color: 'bg-peacock',
    },
    {
      title: 'Your Booking Requests',
      value: data?.totalBookings ?? 0,
      icon: FileText,
      color: 'bg-saffron',
    },
    {
      title: 'Pending Approvals',
      value: data?.pending ?? 0,
      icon: Clock,
      color: 'bg-lotus',
    },
    {
      title: 'Approved Bookings',
      value: data?.approved ?? 0,
      icon: CheckCircle,
      color: 'bg-green-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item, index) => {
        const Icon = item.icon
        return (
          <div 
            key={index}
            className="bg-white rounded-xl p-5 shadow-sm border border-gold/50 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{item.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {loading ? '...' : item.value}
                </p>
              </div>
              <div className={`${item.color} p-3 rounded-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
