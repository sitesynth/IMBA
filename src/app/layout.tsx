import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Unbounded, Manrope, Archivo_Black } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'
import { RefCapture } from '@/components/RefCapture'
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

const TITLE = 'Купить VPN в России — eSIM и виртуальная карта в одной подписке | IMBA'
const DESCRIPTION = 'VPN, eSIM и виртуальная Visa/Mastercard — в одной подписке IMBA. Стабильный VPN без блокировок и логов, интернет в 190+ странах, оплата зарубежных сервисов.'
const DESCRIPTION_SHORT = 'VPN, eSIM и виртуальная Visa/Mastercard — в одной подписке IMBA. Стабильно, без блокировок и логов.'

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers()
  // x-real-host is set by the imba.run nginx proxy to preserve the original domain
  const host = hdrs.get('x-real-host') ?? hdrs.get('host') ?? 'www.imba.live'
  const proto = host.includes('localhost') ? 'http' : 'https'
  const base = `${proto}://${host}`

  return {
    metadataBase: new URL(base),
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: base },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.png',
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION_SHORT,
      siteName: 'IMBA',
      locale: 'ru_RU',
      type: 'website',
      url: base,
      images: [
        {
          url: 'https://www.imba.live/og-image.png',
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
      images: ['https://www.imba.live/og-image.png'],
    },
  }
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
      <body className="min-h-full flex flex-col">
        <Suspense><RefCapture /></Suspense>
        {children}
        <Script id="ym-init" strategy="afterInteractive">{`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=110388717','ym');
          ym(110388717,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});
        `}</Script>
        <noscript><img src="https://mc.yandex.ru/watch/110388717" style={{position:'absolute',left:'-9999px'}} alt="" /></noscript>
      </body>
    </html>
  )
}
