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

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/available-rooms', label: 'Available Rooms', icon: DoorOpen },
  { href: '/book-room', label: 'Book Room', icon: CalendarPlus },
  { href: '/my-bookings', label: 'My Bookings', icon: ClipboardList },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/guidelines', label: 'Guidelines', icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gold min-h-[calc(100vh-4rem)] flex flex-col">
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-peacock text-white shadow-sm' 
                      : 'text-foreground hover:bg-saffron/10 hover:text-peacock'
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
      <div className="p-4 border-t border-gold">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  )
}
