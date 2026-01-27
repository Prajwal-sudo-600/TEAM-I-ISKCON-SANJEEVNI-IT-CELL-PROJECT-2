"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(undefined)

const THEMES = {
  light: 'light',
  dark: 'dark',
  fancy: 'fancy'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(THEMES.light)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('iskcon-admin-theme')
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', THEMES.light)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('iskcon-admin-theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme, mounted])

  const changeTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
