import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Vamalinc Cakes',
  description: 'Order custom cakes online',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#f9a8d4',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <ThemeProvider>
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}