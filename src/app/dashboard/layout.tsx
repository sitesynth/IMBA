import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Wifi, Shield, CreditCard, Wallet, Settings, LogOut } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/auth'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { AnimatedBalance } from '@/components/AnimatedBalance'
import { NotificationBell } from '@/components/NotificationBell'
import { ToastProvider } from '@/components/ToastProvider'
import { formatMoney } from '@/lib/format'

const navItems = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard, color: 'var(--paper)' },
  { href: '/dashboard/esim', label: 'eSIM', icon: Wifi, color: 'var(--violet-100)' },
  { href: '/dashboard/vpn', label: 'VPN', icon: Shield, color: 'var(--blue-100)' },
  { href: '/dashboard/card', label: 'Карта', icon: CreditCard, color: 'var(--green-100)' },
  { href: '/dashboard/billing', label: 'Биллинг', icon: Wallet, color: 'var(--yellow-100)' },
  { href: '/dashboard/settings', label: 'Настройки', icon: Settings, color: 'var(--cream)' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const initials = (user.name || user.email)
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <ToastProvider>
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      <Marquee
        bg="var(--yellow)"
        items={['ТВОЙ КАБИНЕТ IMBA', 'eSIM · VPN · КАРТА', 'БЕЗ ГРАНИЦ', 'БЕЗ ЛИШНИХ ВОПРОСОВ', `БАЛАНС ${formatMoney(user.balance, user.currency, user.rates ?? { EUR: 0.92, RUB: 90 })}`]}
      />

      {/* Mobile top bar (above the row) */}
      <div className="md:hidden flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--paper)' }}>
        <Logo size="sm" tone="blue" href="/dashboard" />
        <div className="flex items-center gap-2">
          <NotificationBell />
          <span className="chip" style={{ background: 'var(--yellow)' }}><AnimatedBalance balance={user.balance} currency={user.currency} rates={user.rates} /></span>
          <Link href="/dashboard/settings" className="pill pill-paper pill-sm" aria-label="Настройки">
            <Settings className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <form action={logout}>
            <button type="submit" className="pill pill-paper pill-sm" aria-label="Выйти">
              <LogOut className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-1 gap-1.5 min-h-0">
        {/* Sidebar */}
        <aside
          className="hidden md:flex w-64 flex-shrink-0 flex-col rounded-xl overflow-hidden"
          style={{ background: 'var(--paper)' }}
        >
          <div className="p-5 flex flex-col gap-1 flex-1">
            <div className="mb-6 px-1 flex items-center justify-between">
              <Logo size="md" tone="blue" href="/dashboard" />
              <NotificationBell />
            </div>

            <nav className="flex-1 space-y-1.5">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-extrabold text-ink/70 border-2 border-transparent hover:border-ink hover:bg-cream transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t-2 border-ink pt-4 mt-2">
              <div className="px-1 mb-3 flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 border-ink flex-shrink-0"
                  style={{ background: 'var(--yellow)' }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold truncate">{user.name || 'IMBA User'}</div>
                  <div className="text-xs font-semibold text-ink/50 truncate">{user.email}</div>
                </div>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-3 w-full px-3.5 py-3 rounded-2xl text-sm font-extrabold text-ink/60 border-2 border-transparent hover:border-ink transition-colors"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2.5} />
                  Выйти
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 rounded-xl overflow-y-auto" style={{ background: 'var(--cream)' }}>
          <div className="p-5 md:p-10 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden rounded-xl flex items-center justify-around px-2 py-2"
        style={{ background: 'var(--paper)' }}
      >
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-ink/60"
          >
            <Icon className="w-5 h-5" strokeWidth={2.5} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
    </ToastProvider>
  )
}
