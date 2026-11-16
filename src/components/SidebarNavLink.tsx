'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// Left-sidebar item of the desktop dashboard: highlights the section the visitor is currently on.
export function SidebarNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname()
  const active = href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(href + '/')
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={
        'flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-extrabold border-2 transition-colors ' +
        (active ? '' : 'text-ink/70 border-transparent hover:border-ink hover:bg-cream')
      }
      style={active ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' } : undefined}
    >
      {children}
    </Link>
  )
}
