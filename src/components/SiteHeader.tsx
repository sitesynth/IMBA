'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/Logo'

function PacManBtn() {
  return (
    <Link href="/auth/register" className="pill pill-ink pill-sm imba-btn-pulse pac-btn flex items-center gap-2.5 px-4">
      <svg width="38" height="22" viewBox="0 0 58 34" fill="none">
        <g className="pac-dots">
          <circle cx="35" cy="17" r="2.5" fill="#ffffff"/>
          <circle cx="45" cy="17" r="2.5" fill="#ffffff"/>
          <circle cx="55" cy="17" r="2.5" fill="#ffffff"/>
          <circle cx="65" cy="17" r="2.5" fill="#ffffff"/>
          <circle cx="75" cy="17" r="2.5" fill="#ffffff"/>
        </g>
        <path d="M 4.88,10 A 14 14 0 0 0 4.88,24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
        <path className="pac-jaw-top" d="M 17,17 L 29.12,10 A 14 14 0 0 0 3,17" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path className="pac-jaw-bottom" d="M 17,17 L 29.12,24 A 14 14 0 0 1 3,17" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="2" fill="#ffffff"/>
      </svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
      </svg>
    </Link>
  )
}

const NAV = [
  { label: 'VPN', href: '/' },
  { label: 'eSIM', href: '/esim' },
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

        {/* Mobile: pac-man + hamburger */}
        <div className="flex md:hidden items-center gap-1.5">
          <PacManBtn />
          <button
            className="flex flex-col justify-center items-center w-7 h-7 gap-1"
            onClick={() => setOpen(o => !o)}
            aria-label="Меню"
          >
            <span className="block w-4 h-0.5 bg-ink transition-all" style={open ? { transform: 'translateY(6px) rotate(45deg)' } : {}} />
            <span className="block w-4 h-0.5 bg-ink transition-all" style={open ? { opacity: 0 } : {}} />
            <span className="block w-4 h-0.5 bg-ink transition-all" style={open ? { transform: 'translateY(-6px) rotate(-45deg)' } : {}} />
          </button>
        </div>
        {/* Desktop: Войти + pac-man */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/auth/login" className="pill pill-paper pill-sm text-sm">Войти</Link>
          <PacManBtn />
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
