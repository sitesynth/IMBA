'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// Bottom-bar tab of the mobile dashboard: highlights the section the visitor is currently on.
export function MobileNavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname()
  const active = href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(href + '/')
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold border-2 transition-colors"
      style={
        active
          ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
          : { background: 'transparent', color: 'rgba(17,17,17,0.6)', borderColor: 'transparent' }
      }
    >
      {children}
    </Link>
  )
}
