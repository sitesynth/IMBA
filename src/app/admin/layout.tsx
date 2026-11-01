'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { clearAdminToken, getAdminToken } from '@/lib/admin-api'
import { useResizableWidth } from '@/lib/useResizableWidth'
import {
  Activity, ArrowLeftRight, BarChart3, Bell, CreditCard, FileText, Layers, LifeBuoy, LogOut, Megaphone,
  Repeat, Server, Share2, Shield, ShoppingBag, Smartphone, Tags, Ticket, Users, Wallet, X,
  type LucideIcon,
} from 'lucide-react'

type NavItem = { href: string; label: string; icon: LucideIcon }

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Обзор',
    items: [
      { href: '/admin/stats', label: 'Статистика', icon: BarChart3 },
      { href: '/admin/analytics', label: 'Трафик', icon: Activity },
      { href: '/admin/nodes', label: 'VPN-ноды', icon: Server },
    ],
  },
  {
    title: 'Клиенты',
    items: [
      { href: '/admin/users', label: 'Пользователи', icon: Users },
      { href: '/admin/buyers', label: 'Покупатели', icon: ShoppingBag },
      { href: '/admin/support', label: 'Поддержка', icon: LifeBuoy },
      { href: '/admin/notifications', label: 'Уведомления', icon: Bell },
    ],
  },
  {
    title: 'Продукты',
    items: [
      { href: '/admin/vpn', label: 'VPN', icon: Shield },
      { href: '/admin/esim', label: 'eSIM', icon: Smartphone },
      { href: '/admin/cards', label: 'Карты', icon: CreditCard },
      { href: '/admin/tariffs', label: 'Тарифы', icon: Tags },
      { href: '/admin/plans', label: 'Планы', icon: Layers },
    ],
  },
  {
    title: 'Деньги',
    items: [
      { href: '/admin/payments', label: 'Платежи', icon: Wallet },
      { href: '/admin/transactions', label: 'Транзакции', icon: ArrowLeftRight },
      { href: '/admin/subscriptions', label: 'Подписки', icon: Repeat },
      { href: '/admin/invoices', label: 'Счета', icon: FileText },
      { href: '/admin/promocodes', label: 'Промокоды', icon: Ticket },
    ],
  },
  {
    title: 'Маркетинг',
    items: [
      { href: '/admin/ads', label: 'Реклама', icon: Megaphone },
      { href: '/admin/referrals', label: 'Реферальные программы', icon: Share2 },
    ],
  },
]

function AdminSidebar({ onClose, width, onLogout }: { onClose?: () => void; width: number; onLogout: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="h-full flex flex-col" style={{ width, background: '#F3F0E9', borderRight: '1px solid rgba(17,17,17,0.1)' }}>
      <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(17,17,17,0.08)' }}>
        <Link href="/admin/stats" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/imba-color.svg" alt="IMBA" style={{ height: '24px', width: 'auto' }} />
          <span className="text-[13px] font-semibold tracking-wide text-gray-600">admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-600" aria-label="Закрыть меню">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto px-2.5 py-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14.5px] font-semibold transition-colors ${
                      active
                        ? 'bg-[#2E7DF6] text-white shadow-sm'
                        : 'text-gray-700 hover:bg-black/[0.06] hover:text-gray-950'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} strokeWidth={2.1} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-2.5 py-3" style={{ borderTop: '1px solid rgba(17,17,17,0.08)' }}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" strokeWidth={2.1} />
          Выйти
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { width: sidebarWidth, startDrag: startSidebarDrag } = useResizableWidth('admin.sidebarWidth', 256, 200, 420)

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
    <div className="admin-root h-screen overflow-hidden bg-gray-50 flex">
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
          <AdminSidebar onClose={() => setSidebarOpen(false)} width={sidebarWidth} onLogout={handleLogout} />
        </div>
      </div>

      {/* drag to resize the menu */}
      <div
        onMouseDown={startSidebarDrag}
        title="Drag to resize"
        className="hidden lg:block w-1.5 -ml-0.5 shrink-0 cursor-col-resize hover:bg-blue-400/40 active:bg-blue-400/60 transition-colors z-10"
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="lg:hidden px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: '#F3F0E9', borderBottom: '1px solid rgba(17,17,17,0.07)' }}>
          <button onClick={() => setSidebarOpen(o => !o)} className="p-1" style={{ color: 'rgba(17,17,17,0.4)' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/imba-color.svg" alt="IMBA" style={{ height: '18px', width: 'auto' }} />
          <span style={{ color: 'rgba(17,17,17,0.35)', fontSize: '12px', fontWeight: 600 }}>admin</span>
        </header>
        <main className="relative flex-1 min-h-0 p-4 sm:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
