'use client'

import { useState, useEffect, createContext, useContext } from 'react'

const SessionContext = createContext(null)

const defaultUser = {
  id: '1',
  name: 'Radha Krishna Das',
  email: 'radhakrishna@iskconsanjeevani.org',
  department: 'IT Cell',
  role: 'user',
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate session check
    const checkSession = () => {
      const storedUser = typeof window !== 'undefined' 
        ? localStorage.getItem('iskcon_user') 
        : null
      
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        // Auto-login for demo purposes
        setUser(defaultUser)
      }
      setLoading(false)
    }

    checkSession()
  }, [])

  const login = (userData) => {
    setUser(userData || defaultUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('iskcon_user', JSON.stringify(userData || defaultUser))
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('iskcon_user')
    }
  }

  return (
    <SessionContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    return {
      user: defaultUser,
      loading: false,
      login: () => {},
      logout: () => {},
    }
  }
  return context
}

export default useSession
