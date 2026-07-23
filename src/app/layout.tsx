import type { Metadata } from 'next'
import { Unbounded, Manrope, Archivo_Black } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'
import { RefCapture } from '@/components/RefCapture'
import './globals.css'
import { SITE_URL } from '@/lib/site'

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

const TITLE = 'IMBA — VPN, eSIM & Virtual Card. Internet Without Borders.'
const DESCRIPTION = 'VPN, eSIM, and virtual Visa/Mastercard in one subscription. VLESS Reality protocol — works in China, UAE, Turkey, and anywhere else that blocks it. 50+ servers, zero logs.'
const DESCRIPTION_SHORT = 'VPN, eSIM & virtual card in one plan. Works anywhere they try to block it. 7 days free.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION_SHORT,
    siteName: 'IMBA',
    locale: 'en_US',
    type: 'website',
    url: SITE_URL,
    images: [
      {
        url: SITE_URL + '/og-image.png',
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION_SHORT,
    images: [SITE_URL + '/og-image.png'],
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': SITE_URL + '/#organization',
  name: 'IMBA',
  legalName: 'IMBA SRL',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: SITE_URL + '/favicon.png', width: 512, height: 512 },
  foundingDate: '2025',
  description: 'eSIM for 190+ countries, no-log VPN, and virtual Visa/Mastercard. Internet without borders.',
  contactPoint: { '@type': 'ContactPoint', email: 'hello@imba.live', contactType: 'customer support', availableLanguage: ['English'] },
  address: { '@type': 'PostalAddress', streetAddress: 'Mata Redonda, Sabana Oeste, Avenida Doce Calle Noventa', addressLocality: 'San José', addressCountry: 'CR' },
  identifier: { '@type': 'PropertyValue', name: 'Registro Nacional de Costa Rica', value: '3-102-942736' },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_URL + '/#website',
  name: 'IMBA',
  url: SITE_URL,
  description: 'IMBA — VPN, eSIM, and virtual card in one subscription. Internet without borders.',
  inLanguage: 'en',
  publisher: { '@id': SITE_URL + '/#organization' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${display.variable} ${sans.variable} ${word.variable}`}>
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
      <body className="min-h-full flex flex-col">
        <Suspense><RefCapture /></Suspense>
        {children}
      </body>
    </html>
  )
}
