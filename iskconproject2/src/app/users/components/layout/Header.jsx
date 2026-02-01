'use client'

import { useState } from 'react'
import { User, ChevronDown, LogOut, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRouter } from "next/navigation";
import Link from 'next/link'



const pageNames = {
  '/': 'Dashboard',
  '/available-rooms': 'Available Rooms',
  '/book-room': 'Book Room',
  '/my-bookings': 'My Bookings',
  '/calendar': 'Calendar',
  '/guidelines': 'Guidelines',
  '/users/profile': 'Profile',
}

export default function Header({ onNotificationClick, showNotifications, notifications, onMarkAllRead }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const pathname = usePathname()
  const pageTitle = pageNames[pathname] || 'Dashboard'

  const unreadCount = notifications?.filter(n => !n.read).length || 0
  const router = useRouter();


  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Logo & Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">OM</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-semibold text-foreground leading-tight">ISKCON Sanjeevani</h1>
            <p className="text-xs text-muted-foreground">IT Cell Portal</p>
          </div>
        </div>
        <div className="hidden sm:block h-8 w-px bg-border mx-2" />
        <h2 className="hidden sm:block text-lg font-medium text-foreground">{pageTitle}</h2>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground">Devotee</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {
            showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50 py-2">
                  <Link
                    href="/users/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="w-4 h-4 text-primary" />
                    Profile Settings
                  </Link>
                </div>
              </>
            )
          }
        </div >
      </div >


    </header >
  )
}
