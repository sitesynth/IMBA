import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      {/* Ticker */}
      <Marquee
        bg="var(--violet-100)"
        items={['eSIM IN 190 COUNTRIES', 'ZERO-LOG VPN', 'VIRTUAL CARD', 'PAY ANYWHERE', 'NO BORDERS']}
      />

      {/* Nav */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
        <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
          <Logo size="lg" />
          <div className="hidden md:flex items-center gap-7 text-sm uppercase flex-1 justify-center" style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}>
            <Link href="/#services" className="hover:opacity-60 transition-opacity">Services</Link>
            <Link href="/#pricing" className="hover:opacity-60 transition-opacity">Pricing</Link>
            <Link href="/#faq" className="hover:opacity-60 transition-opacity">FAQ</Link>
            <Link href="/blog" className="hover:opacity-60 transition-opacity">Blog</Link>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <Link href="/auth/login" className="pill pill-paper pill-sm text-xs md:text-sm">Sign In</Link>
            <Link href="/auth/register" className="pill pill-ink pill-sm text-[10px] md:text-sm">
              <span className="sm:hidden">Sign Up</span>
              <span className="hidden sm:inline">Create account</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Page content */}
      <div className="rounded-xl flex-1" style={{ background: 'var(--cream)' }}>
        {children}
      </div>

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/blog" className="hover:opacity-60">Blog</Link>
            <Link href="/privacy-policy" className="hover:opacity-60">Privacy</Link>
            <Link href="/terms" className="hover:opacity-60">Terms</Link>
            <Link href="/refund" className="hover:opacity-60"><span className="sm:hidden">Refund</span><span className="hidden sm:inline">Refund Policy</span></Link>
          </div>
        </div>
        <div className="px-5 md:px-8 pb-6 border-t border-ink/10 pt-4">
          <p className="text-xs text-ink/40 text-center leading-relaxed">
            IMBA S.R.L. · Reg. No. 3-102-942736 · Costa Rica, San José, Mata Redonda, Sabana Oeste, 12th Avenue, 19th Street
          </p>
        </div>
      </footer>
    </div>
  )
}
