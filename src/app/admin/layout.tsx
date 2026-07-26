'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { clearAdminToken, getAdminToken } from '@/lib/admin-api'

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  const NAV_GROUPS = [
    {
      items: [
        { href: '/admin/stats', label: 'Statistics' },
        { href: '/admin/analytics', label: 'Traffic' },
        { href: '/admin/nodes', label: 'VPN Nodes' },
      ],
    },
    {
      items: [
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/vpn', label: 'VPN' },
        { href: '/admin/plans', label: 'Plans' },
        { href: '/admin/esim', label: 'eSIM' },
        { href: '/admin/cards', label: 'Cards' },
        { href: '/admin/payments', label: 'Payments' },
        { href: '/admin/transactions', label: 'Transactions' },
        { href: '/admin/support', label: 'Support' },
      ],
    },
    {
      items: [
        { href: '/admin/subscriptions', label: 'Subscriptions' },
        { href: '/admin/invoices', label: 'Invoices' },
        { href: '/admin/notifications', label: 'Notifications' },
        { href: '/admin/referrals', label: 'Referral Programs' },
        { href: '/admin/promocodes', label: 'Промокоды' },
      ],
    },
  ]

  return (
    <aside className="w-64 h-full flex flex-col" style={{ background: '#111' }}>
      <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/admin/stats" className="flex items-center gap-2">
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#FFD731', color: '#111', border: '2px solid rgba(255,255,255,0.15)',
            borderRadius: '8px', padding: '2px 7px', fontSize: '13px', fontWeight: 800,
            letterSpacing: '0.01em', lineHeight: 1.4,
          }}>IMBA</span>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: 500 }}>admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>
      <nav className="flex-1 py-3 px-2 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '6px 8px' }} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {group.items.map(item => {
                const active = item.href !== '/admin' && pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={active ? {
                      background: '#2E7DF6',
                      color: '#fff',
                    } : {
                      color: 'rgba(255,255,255,0.6)',
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#fff'; if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = getAdminToken()
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login')
    } else {
      setReady(true)
    }
  }, [pathname, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (!ready) return null

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  function handleLogout() {
    clearAdminToken()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-30 transition-transform duration-200
        lg:static lg:translate-x-0 lg:z-auto lg:flex lg:flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
          <div className="px-2 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#111' }}>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition"
              style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#FFD731', color: '#111', borderRadius: '6px',
            padding: '2px 7px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.01em',
          }}>IMBA</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>admin</span>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
