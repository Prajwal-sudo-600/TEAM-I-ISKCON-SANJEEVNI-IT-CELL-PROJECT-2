"use client"

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeSelector() {
    const { theme, changeTheme } = useTheme()

    const isDark = theme === 'dark'

    const toggleTheme = () => {
        changeTheme(isDark ? 'light' : 'dark')
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Moon className="w-5 h-5" />
            ) : (
                <Sun className="w-5 h-5 text-saffron" />
            )}
        </button>
    )
}
