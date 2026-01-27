'use client'

import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const initialNotifications = [
  {
    id: 1,
    type: 'approved',
    title: 'Booking Approved',
    message: 'Your booking for Conference Room A on Jan 25 has been approved.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Upcoming Booking',
    message: 'Reminder: You have a booking for Meeting Room B tomorrow at 10:00 AM.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'message',
    title: 'Admin Message',
    message: 'Please ensure all rooms are vacated 15 minutes before the next booking.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    type: 'rejected',
    title: 'Booking Rejected',
    message: 'Your booking for Hall C on Jan 20 was rejected due to maintenance.',
    time: '2 days ago',
    read: true,
  },
]

export default function DashboardLayout({ children }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Header 
        onNotificationClick={handleNotificationClick}
        showNotifications={showNotifications}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
