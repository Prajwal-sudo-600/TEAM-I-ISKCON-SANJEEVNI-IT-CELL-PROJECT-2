"use client"

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  changeTheme: () => { },
})

export function ThemeProvider({ children }) {
  // Always force light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
    localStorage.setItem('theme', 'light')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'light', changeTheme: () => { } }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
