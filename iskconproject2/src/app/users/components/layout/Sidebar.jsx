'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  DoorOpen,
  CalendarPlus,
  ClipboardList,
  Calendar,
  BookOpen,
  LogOut
} from 'lucide-react'
import { logout } from '@/actions/user/userProfileActions'

const navItems = [
  { href: '/users', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users/available-rooms', label: 'Available Rooms', icon: DoorOpen },
  { href: '/users/book-room', label: 'Book Room', icon: CalendarPlus },
  { href: '/users/my-bookings', label: 'My Bookings', icon: ClipboardList },
  { href: '/users/calendar', label: 'Calendar', icon: Calendar },
  { href: '/users/guidelines', label: 'Guidelines', icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
