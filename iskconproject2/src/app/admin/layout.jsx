'use client'

import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
