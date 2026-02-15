import type { Metadata } from 'next'
import Script from 'next/script'
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
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WHQZ7VJF');`}
        </Script>
      </head>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-red-600 selection:text-white`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WHQZ7VJF"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
