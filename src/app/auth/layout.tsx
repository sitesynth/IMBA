import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      {/* Ticker */}
      <Marquee
        bg="var(--violet-100)"
        items={['eSIM В 190 СТРАНАХ', 'VPN БЕЗ ЛОГОВ', 'ВИРТУАЛЬНАЯ КАРТА', 'ОПЛАТА ВЕЗДЕ', 'БЕЗ ГРАНИЦ']}
      />

      {/* Nav */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
        <nav className="grid grid-cols-3 items-center px-5 md:px-8 py-4 max-w-7xl mx-auto">
          <Link href="/"><Logo size="lg" /></Link>
          <div className="hidden md:flex items-center justify-center gap-7 text-sm uppercase" style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}>
            <Link href="/#services" className="hover:opacity-60 transition-opacity">Сервисы</Link>
            <Link href="/#pricing" className="hover:opacity-60 transition-opacity">Тарифы</Link>
            <Link href="/#faq" className="hover:opacity-60 transition-opacity">Вопросы</Link>
          </div>
          <div className="flex items-center justify-end gap-2.5">
            <Link href="/auth/login" className="pill pill-paper pill-sm">Войти</Link>
            <Link href="/auth/register" className="pill pill-ink pill-sm">Открыть IMBA</Link>
          </div>
        </nav>
      </div>

      {/* Page content */}
      <div className="rounded-xl flex-1" style={{ background: 'var(--cream)' }}>
        {children}
      </div>

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <p className="text-sm font-semibold text-ink/60">© 2026 IMBA. Все права защищены.</p>
          <div className="flex gap-5 text-sm font-bold">
            <a href="#" className="hover:opacity-60">Конфиденциальность</a>
            <a href="#" className="hover:opacity-60">Условия</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
