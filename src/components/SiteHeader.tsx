'use client'

import { useState } from 'react'
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
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="rounded-xl" style={{ background: 'var(--paper)' }}>
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
        <Logo size="lg" />

        {/* Desktop nav */}
        <div
          className="hidden md:flex items-center gap-7 text-sm uppercase flex-1 justify-center"
          style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}
        >
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="transition-opacity hover:opacity-60"
              style={isActive(href) ? { borderBottom: '2px solid var(--ink)', paddingBottom: '1px' } : {}}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile: CTA + hamburger only */}
        <div className="flex md:hidden items-center gap-1.5">
          <Link href="/auth/register" className="pill pill-ink pill-sm text-xs">Imbaнуться</Link>
          <button
            className="flex flex-col justify-center items-center w-7 h-7 gap-1"
            onClick={() => setOpen(o => !o)}
            aria-label="Меню"
          >
            <span className="block w-4 h-0.5 bg-ink transition-all" style={open ? { transform: 'translateY(3px) rotate(45deg)' } : {}} />
            <span className="block w-4 h-0.5 bg-ink transition-all" style={open ? { opacity: 0 } : {}} />
            <span className="block w-4 h-0.5 bg-ink transition-all" style={open ? { transform: 'translateY(-3px) rotate(-45deg)' } : {}} />
          </button>
        </div>
        {/* Desktop: Войти + CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/auth/login" className="pill pill-paper pill-sm text-sm">Войти</Link>
          <Link href="/auth/register" className="pill pill-ink pill-sm text-sm">Imbaнуться</Link>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden border-t border-ink/10 px-4 pb-4 pt-3 flex flex-col gap-0"
          style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}
        >
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm uppercase border-b border-ink/10 last:border-0"
              style={isActive(href) ? { textDecoration: 'underline', textUnderlineOffset: '3px' } : {}}
            >
              {label}
            </Link>
          ))}
          <Link href="/auth/login" onClick={() => setOpen(false)} className="mt-3 pill pill-paper pill-sm text-xs text-center">Войти</Link>
        </div>
      )}
    </div>
  )
}
