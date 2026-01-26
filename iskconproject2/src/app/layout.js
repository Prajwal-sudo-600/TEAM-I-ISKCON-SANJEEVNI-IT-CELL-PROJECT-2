import './globals.css'
import { Poppins } from 'next/font/google'

// Poppins setup for JS (string weights)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400','600','700'], // safe weights
})

export const metadata = {
  title: 'Login Page',
  description: 'Glassmorphism Login Page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  )
}
