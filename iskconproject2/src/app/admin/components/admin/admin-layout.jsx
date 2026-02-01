"use client"

import Sidebar from './sidebar'
import Header from './header'

export default function AdminLayout({ children, title = "Dashboard" }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
