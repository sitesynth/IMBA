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
  title: 'IMBA COMBO — eSIM, VPN и виртуальная карта. Интернет без границ.',
  description: 'eSIM для 190+ стран, VPN без логов (VLESS Reality и WireGuard) и виртуальная Visa/Mastercard для оплаты Netflix, Spotify, ChatGPT и других зарубежных сервисов. Всё в одном кабинете.',
  alternates: { canonical: 'https://www.imba.live' },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'IMBA COMBO — eSIM, VPN и виртуальная карта. Интернет без границ.',
    description: 'eSIM для 190+ стран, VPN без логов и виртуальная Visa/Mastercard. Интернет без границ.',
    siteName: 'IMBA',
    locale: 'ru_RU',
    type: 'website',
    url: 'https://www.imba.live',
    images: [
      {
        url: 'https://www.imba.live/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IMBA COMBO — eSIM, VPN и виртуальная карта. Интернет без границ.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMBA COMBO — eSIM, VPN и виртуальная карта. Интернет без границ.',
    description: 'eSIM для 190+ стран, VPN без логов и виртуальная Visa/Mastercard. Интернет без границ.',
    images: ['https://www.imba.live/og-image.png'],
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.imba.live/#organization',
  name: 'IMBA',
  legalName: 'IMBA SRL',
  url: 'https://www.imba.live',
  logo: { '@type': 'ImageObject', url: 'https://www.imba.live/favicon.png', width: 512, height: 512 },
  foundingDate: '2025',
  description: 'eSIM для 190+ стран, VPN без логов и виртуальная Visa/Mastercard. Интернет без границ.',
  contactPoint: { '@type': 'ContactPoint', email: 'hello@imba.live', contactType: 'customer support', availableLanguage: ['Russian'] },
  address: { '@type': 'PostalAddress', streetAddress: 'Mata Redonda, Sabana Oeste, Avenida Doce Calle Noventa', addressLocality: 'San José', addressCountry: 'CR' },
  identifier: { '@type': 'PropertyValue', name: 'Registro Nacional de Costa Rica', value: '3-102-942736' },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.imba.live/#website',
  name: 'IMBA',
  url: 'https://www.imba.live',
  description: 'IMBA COMBO — eSIM, VPN и виртуальная карта. Интернет без границ.',
  inLanguage: 'ru',
  publisher: { '@id': 'https://www.imba.live/#organization' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`h-full ${display.variable} ${sans.variable} ${word.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="IMBA" />
        <meta name="theme-color" content="#111111" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
