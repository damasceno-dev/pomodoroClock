import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pomodoro clock',
  description: 'FreeCodeCamp 25+5 Clock',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
