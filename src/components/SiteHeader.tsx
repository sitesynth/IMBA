'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/Logo'

const NAV = [
  { label: 'eSIM', href: '/esim' },
  { label: 'VPN', href: '/' },
  { label: 'Карта', href: '/virtual-card' },
  { label: 'Блог', href: '/blog' },
]

export function SiteHeader() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
        <Logo size="lg" />
        <div
          className="hidden md:flex items-center gap-7 text-sm uppercase flex-1 justify-center"
          style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}
        >
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="transition-opacity hover:opacity-60"
              style={isActive(href) ? {
                borderBottom: '2px solid var(--ink)',
                paddingBottom: '1px',
              } : {}}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <Link href="/auth/login" className="pill pill-paper pill-sm text-xs md:text-sm">Войти</Link>
          <Link href="/auth/register" className="pill pill-ink pill-sm text-xs md:text-sm">Открыть IMBA</Link>
        </div>
      </nav>
    </div>
  )
}
