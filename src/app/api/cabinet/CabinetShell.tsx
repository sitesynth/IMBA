import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { NotificationBell } from '@/components/NotificationBell'
import { SupportWidget } from '@/components/SupportWidget'
import { ToastProvider } from '@/components/ToastProvider'
import { LocaleProvider } from '@/lib/locale-context'
import { CabinetNav } from './CabinetNav'

type Locale = 'ru' | 'en'

/**
 * The API cabinet's frame: the left menu of the IMBA app, cut down to this cabinet's own pages plus
 * Support, Messages (the bell) and Log out. No eSIM, VPN or card items.
 */
export function CabinetShell({
  email, name, locale, logoutAction, children,
}: {
  email: string
  name: string
  locale: Locale
  logoutAction: () => Promise<void>
  children: React.ReactNode
}) {
  const initials = (name || email).split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()

  return (
    <ToastProvider>
      <LocaleProvider locale={locale}>
        <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
          <Marquee bg="var(--yellow)" items={['IMBA API', 'eSIM', 'VPN', 'Sell anywhere', 'One key']} />

          {/* Phone top bar */}
          <div className="md:hidden flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--paper)' }}>
            <div className="flex items-center gap-2">
              <Logo size="sm" tone="blue" href="/api" />
              <span className="chip" style={{ background: 'var(--yellow)' }}>API</span>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <form action={logoutAction}>
                <button type="submit" className="pill pill-paper pill-sm" aria-label="Log out">
                  <LogOut className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-1 gap-1.5 min-h-0">
            <aside className="hidden md:flex w-64 flex-shrink-0 flex-col rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
              <div className="p-5 flex flex-col gap-1 flex-1">
                <div className="mb-3 px-1 flex items-center justify-between">
                  <Logo size="md" tone="blue" href="/api" />
                  <NotificationBell />
                </div>
                <div className="mb-2" />

                <CabinetNav variant="side" />

                <div className="border-t-2 border-ink pt-4 mt-2">
                  <div className="px-1 mb-3 flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 border-ink flex-shrink-0"
                      style={{ background: 'var(--yellow)' }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold truncate">{name || 'IMBA User'}</div>
                      <div className="text-xs font-semibold text-ink/50 truncate">{email}</div>
                    </div>
                  </div>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex items-center gap-3 w-full px-3.5 py-3 rounded-2xl text-sm font-extrabold text-ink/60 border-2 border-transparent hover:border-ink transition-colors"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2.5} />
                      Log out
                    </button>
                  </form>
                </div>
              </div>
            </aside>

            <main className="flex-1 rounded-xl overflow-y-auto" style={{ background: 'var(--cream)' }}>
              <div className="p-5 md:p-10 max-w-5xl mx-auto">{children}</div>
            </main>
          </div>

          {/* Phone tab bar */}
          <nav className="md:hidden rounded-xl flex items-center justify-around px-2 py-2" style={{ background: 'var(--paper)' }}>
            <CabinetNav variant="bottom" />
          </nav>

          <SupportWidget />
        </div>
      </LocaleProvider>
    </ToastProvider>
  )
}
