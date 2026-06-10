'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { clearAdminToken, getAdminToken } from '@/lib/admin-api'

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  const NAV_GROUPS = [
    {
      title: 'Overview',
      items: [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/stats', label: 'Statistics' },
      ],
    },
    {
      title: 'Management',
      items: [
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/plans', label: 'Plans' },
        { href: '/admin/transactions', label: 'Transactions' },
        { href: '/admin/support', label: 'Support' },
      ],
    },
    {
      title: 'Billing',
      items: [
        { href: '/admin/subscriptions', label: 'Subscriptions' },
        { href: '/admin/invoices', label: 'Invoices' },
        { href: '/admin/notifications', label: 'Notifications' },
        { href: '/admin/referrals', label: 'Referral Programs' },
      ],
    },
  ]

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <Link href="/admin" className="font-bold text-gray-900">
          IMBA <span className="text-gray-400">Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>
      <nav className="flex-1 py-4 space-y-4 px-2 overflow-y-auto">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname.startsWith(item.href) && (pathname === item.href || pathname.startsWith(item.href + '/'))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
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
          <div className="px-2 py-4 border-t border-gray-100 bg-white">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-red-500 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span className="font-bold text-gray-900">IMBA Admin</span>
        </header>
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
