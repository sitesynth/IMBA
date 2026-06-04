import type { Metadata } from 'next'
import { Unbounded, Manrope, Archivo_Black } from 'next/font/google'
import './globals.css'

const display = Unbounded({
  weight: ['700', '800', '900'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
})

const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

// Brand wordmark — heavy squared grotesque (energy-can spirit)
const word = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-word',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IMBA — eSIM, VPN и виртуальная карта',
  description: 'Твой интернет без границ. eSIM, VPN и виртуальная карта в одном приложении для граждан РФ.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`h-full ${display.variable} ${sans.variable} ${word.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
