import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site'
import { DocsContent } from './DocsContent'

export const metadata: Metadata = {
  title: 'IMBA API: sell eSIM and VPN',
  description:
    'Reseller API for IMBA: browse eSIM and VPN catalogs, top up a balance with crypto, and buy eSIM profiles and VPN keys for your own customers. Bearer keys, idempotent orders, USD prices.',
  alternates: { canonical: `${SITE_URL}/api` },
  openGraph: {
    title: 'IMBA API: sell eSIM and VPN',
    description: 'Sell eSIM and VPN to your own customers with a single API key.',
    url: `${SITE_URL}/api`,
    images: [{ url: `${SITE_URL}/og-api.png`, width: 1200, height: 630, alt: 'IMBA API' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMBA API: sell eSIM and VPN',
    images: [`${SITE_URL}/og-api.png`],
  },
}

export default function ApiDocs() {
  return (
    <div className="admin-root min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/imba-color.svg" alt="IMBA" style={{ height: '24px', width: 'auto' }} />
            <span className="text-[13px] font-semibold tracking-wide text-gray-600">API</span>
          </Link>
          <Link
            href="/auth/login?for=partner&redirect=%2Fapi%2Fcabinet"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Sign in to get a key
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <DocsContent />
      </main>
    </div>
  )
}
