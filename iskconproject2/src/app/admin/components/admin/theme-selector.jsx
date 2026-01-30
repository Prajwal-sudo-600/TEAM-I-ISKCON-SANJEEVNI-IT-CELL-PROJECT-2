"use client"

import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Sparkles, ChevronDown } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'fancy', label: 'Fancy', icon: Sparkles },
]

export default function ThemeSelector() {
  const { theme, changeTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentTheme = themeOptions.find(t => t.value === theme) || themeOptions[0]
  const CurrentIcon = currentTheme.icon

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary border border-border rounded-lg hover:bg-muted transition-colors"
      >
        <CurrentIcon className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline text-foreground">{currentTheme.label}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-card border border-border rounded-lg shadow-lg z-50">
          {themeOptions.map((option) => {
            const Icon = option.icon
            const isActive = theme === option.value
            return (
              <button
                key={option.value}
                onClick={() => {
                  changeTheme(option.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"></span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
