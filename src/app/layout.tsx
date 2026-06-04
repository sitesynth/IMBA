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
  metadataBase: new URL('https://www.imba.live'),
  title: 'IMBA — eSIM, VPN и виртуальная карта для граждан России',
  description: 'Купи eSIM для 190+ стран, подключи VPN без логов на протоколе WireGuard и получи виртуальную Visa/Mastercard для оплаты зарубежных сервисов. Всё в одном кабинете.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'IMBA — eSIM, VPN и виртуальная карта',
    description: 'eSIM для 190+ стран, VPN без логов и виртуальная Visa/Mastercard. Без границ.',
    siteName: 'IMBA',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: 'https://imba-sitesynth.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IMBA — eSIM, VPN и виртуальная карта',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMBA — eSIM, VPN и виртуальная карта',
    description: 'Твой интернет без границ.',
    images: ['https://imba-sitesynth.vercel.app/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`h-full ${display.variable} ${sans.variable} ${word.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
