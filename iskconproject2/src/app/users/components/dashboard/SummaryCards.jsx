'use client'

import { DoorOpen, FileText, Clock, CheckCircle } from 'lucide-react'

const summaryData = [
  {
    title: 'Available Rooms Today',
    value: '12',
    icon: DoorOpen,
    color: 'bg-peacock',
  },
  {
    title: 'Your Booking Requests',
    value: '5',
    icon: FileText,
    color: 'bg-saffron',
  },
  {
    title: 'Pending Approvals',
    value: '2',
    icon: Clock,
    color: 'bg-lotus',
  },
  {
    title: 'Approved Bookings',
    value: '8',
    icon: CheckCircle,
    color: 'bg-green-600',
  },
]

export default function SummaryCards() {
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
                <p className="text-3xl font-bold text-foreground mt-2">{item.value}</p>
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
