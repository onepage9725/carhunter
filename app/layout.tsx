import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './lenis.css'
import { AuthProvider } from '@/context/AuthContext'
import SmoothScroll from '@/components/SmoothScroll'
import CursorFollower from '@/components/CursorFollower'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarHunter - Premium Used Cars',
  description: 'Find your dream car with CarHunter.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-red-600 selection:text-white`}>
        <AuthProvider>
          <SmoothScroll>
            <CursorFollower />
            {children}
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  )
}
