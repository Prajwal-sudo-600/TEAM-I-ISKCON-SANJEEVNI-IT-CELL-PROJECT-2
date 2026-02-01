"use client"

import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarCheck,
  DoorOpen,
  Package,
  Calendar,
  User,
  LogOut
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Booking Control', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Rooms Management', href: '/admin/rooms', icon: DoorOpen },
  { name: 'Resources', href: '/admin/resources', icon: Package },
  { name: 'Schedule Overview', href: '/admin/schedule', icon: Calendar },
  { name: 'Admin Profile', href: '/admin/profile', icon: User },
]

import { logout } from '@/actions/adminProfileActions'

// ...

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (href) => {
    router.push(href)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg font-semibold">ॐ</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight">ISKCON Sanjeevani</h1>
            <p className="text-xs text-sidebar-foreground/70">IT Cell Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-white/20 text-white'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
        <p className="mt-4 text-xs text-center text-sidebar-foreground/50">
          Hare Krishna
        </p>
      </div>
    </aside>
  )
}
