// Authentication utilities for ISKCON Sanjeevani IT Cell Portal

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const formatUserName = (name) => {
  if (!name) return 'Devotee'
  return name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('iskcon_user')
}

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('iskcon_user')
  return user ? JSON.parse(user) : null
}

export const clearSession = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('iskcon_user')
}
