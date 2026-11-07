'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, BookOpen, LayoutDashboard, LifeBuoy, ListOrdered, Receipt, Tag, Wallet } from 'lucide-react'

const ITEMS = [
  { href: '/api/cabinet', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/api/cabinet/docs', label: 'Documentation', icon: BookOpen },
  { href: '/api/cabinet/pricing', label: 'Pricing', icon: Tag },
  { href: '/api/cabinet/usage', label: 'Usage', icon: BarChart3 },
  { href: '/api/cabinet/orders', label: 'Orders', icon: ListOrdered, sideOnly: true },
  { href: '/api/cabinet/topup', label: 'Top up', icon: Wallet },
  { href: '/api/cabinet/billing', label: 'Billing', icon: Receipt },
]

function openSupport() {
  document.querySelector<HTMLButtonElement>('[aria-label="Поддержка"], [aria-label="Support"]')?.click()
}

/** `side`: the left menu on desktop. `bottom`: the tab bar on phones. Support opens the chat widget. */
export function CabinetNav({ variant }: { variant: 'side' | 'bottom' }) {
  const pathname = usePathname()
  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href))

  if (variant === 'bottom') {
    const cls = 'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-extrabold'
    return (
      <>
        {ITEMS.filter((i) => !i.sideOnly).map(({ href, label, icon: Icon, exact }) => (
          <Link key={href} href={href} className={cls} style={{ color: isActive(href, exact) ? 'var(--ink)' : 'rgba(17,17,17,0.55)' }}>
            <Icon className="w-5 h-5" strokeWidth={2.5} />
            {label === 'Documentation' ? 'Docs' : label}
          </Link>
        ))}
      </>
    )
  }

  const row = 'flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-extrabold border-2 transition-colors w-full text-left'
  return (
    <nav className="flex-1 space-y-1.5" aria-label="API cabinet">
      {ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact)
        return (
          <Link
            key={href} href={href} aria-current={active ? 'page' : undefined} className={row}
            style={active
              ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
              : { borderColor: 'transparent', color: 'rgba(17,17,17,0.7)' }}
          >
            <Icon className="w-4 h-4" strokeWidth={2.5} />
            {label}
          </Link>
        )
      })}
      <button type="button" onClick={openSupport} className={`${row} hover:border-ink hover:bg-cream`} style={{ borderColor: 'transparent', color: 'rgba(17,17,17,0.7)' }}>
        <LifeBuoy className="w-4 h-4" strokeWidth={2.5} />
        Support
      </button>
    </nav>
  )
}
