'use client'

import { X, CheckCircle, XCircle, MessageSquare, Clock, Check } from 'lucide-react'

const iconMap = {
  approved: CheckCircle,
  rejected: XCircle,
  message: MessageSquare,
  reminder: Clock,
}

const colorMap = {
  approved: 'text-green-600',
  rejected: 'text-destructive',
  message: 'text-peacock',
  reminder: 'text-saffron',
}

export default function NotificationPanel({ isOpen, onClose, notifications = [], onMarkAllRead }) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gold">
          <h2 className="text-lg font-semibold text-peacock">Notifications</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gold bg-muted/50">
          <button 
            onClick={onMarkAllRead}
            className="flex items-center gap-2 text-sm text-peacock hover:underline"
          >
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
          <span className="text-sm text-muted-foreground">
            {notifications.filter(n => !n.read).length} unread
          </span>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto h-[calc(100%-8rem)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-gold">
              {notifications.map((notification) => {
                const Icon = iconMap[notification.type] || MessageSquare
                const iconColor = colorMap[notification.type] || 'text-peacock'
                
                return (
                  <li 
                    key={notification.id}
                    className={`p-4 transition-colors ${
                      notification.read ? 'bg-white' : 'bg-saffron/10'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 ${iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
