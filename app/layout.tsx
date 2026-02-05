import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './lenis.css'
import { AuthProvider } from '@/context/AuthContext'
import { TransitionProvider } from '@/context/TransitionContext'
import SmoothScroll from '@/components/SmoothScroll'
import CursorFollower from '@/components/CursorFollower'
import Preloader from '@/components/Preloader'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Byride | Malaysia Used Car Selling Platform',
  description: 'Secondhand & Used Cars for sales in Malaysia',
  verification: {
    google: 'luRZuw8gEWczq95pP6A1TPXYOTXEWuuymluQUYLQgTo',
  },
  other: {
    'geo.region': 'MY',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-MY" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-red-600 selection:text-white`}>
        <AuthProvider>
          <TransitionProvider>
            <SmoothScroll>
              <Preloader />
              <CursorFollower />
              {children}
            </SmoothScroll>
            <SpeedInsights />
          </TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
