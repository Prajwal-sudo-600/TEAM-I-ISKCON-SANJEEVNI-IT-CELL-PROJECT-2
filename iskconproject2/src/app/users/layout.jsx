import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata = {
  title: 'ISKCON Sanjeevani IT Cell - Room & Resource Allocation',
  description:
    'Official internal digital seva platform for ISKCON Sanjeevani IT Cell room booking and resource management',
}

export default function UsersLayout({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
