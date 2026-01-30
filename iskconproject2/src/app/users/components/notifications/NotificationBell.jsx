'use client'

import { Bell } from 'lucide-react'

export default function NotificationBell({ unreadCount = 0, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="w-5 h-5 text-peacock" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-saffron rounded-full animate-pulse" />
      )}
    </button>
  )
}
