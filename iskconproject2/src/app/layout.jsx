import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'ISKCON Sanjeevani IT Cell',
  description: 'ISKCON Sanjeevani Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
