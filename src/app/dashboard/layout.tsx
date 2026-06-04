import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Wifi, Shield, CreditCard, LogOut } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/auth'
import { Logo } from '@/components/Logo'

const navItems = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { href: '/dashboard/esim', label: 'eSIM', icon: Wifi },
  { href: '/dashboard/vpn', label: 'VPN', icon: Shield },
  { href: '/dashboard/card', label: 'Карта', icon: CreditCard },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 flex-shrink-0 border-r-2 border-ink bg-paper flex flex-col p-5 gap-1 sticky top-0 h-screen">
        <div className="mb-8 px-1"><Logo size="md" tone="blue" /></div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-extrabold text-ink/70 border-2 border-transparent hover:border-ink hover:bg-cream transition-colors"
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={2.5} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t-2 border-ink pt-4 mt-2">
          <div className="px-1 mb-3">
            <div className="text-sm font-extrabold truncate">{user.name}</div>
            <div className="text-xs font-semibold text-ink/50 truncate">{user.email}</div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3.5 py-3 rounded-2xl text-sm font-extrabold text-ink/60 border-2 border-transparent hover:border-ink transition-colors"
              style={{ ['--hover' as string]: '#FFD7D7' }}
            >
              <LogOut className="w-4.5 h-4.5" strokeWidth={2.5} />
              Выйти
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  )
}
