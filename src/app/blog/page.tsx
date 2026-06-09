import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { posts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Блог — IMBA',
  description: 'Гайды и статьи про VPN, eSIM и виртуальные карты для россиян.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      <Marquee
        bg="var(--violet-100)"
        items={['eSIM В 190 СТРАНАХ', 'VPN БЕЗ ЛОГОВ', 'ВИРТУАЛЬНАЯ КАРТА', 'ОПЛАТА ВЕЗДЕ', 'БЕЗ ГРАНИЦ']}
      />

      {/* Nav */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
        <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
          <Link href="/"><Logo size="lg" /></Link>
          <div className="hidden md:flex items-center gap-7 text-sm uppercase flex-1 justify-center" style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}>
            <Link href="/#services" className="hover:opacity-60 transition-opacity">Сервисы</Link>
            <Link href="/#pricing" className="hover:opacity-60 transition-opacity">Тарифы</Link>
            <Link href="/#faq" className="hover:opacity-60 transition-opacity">Вопросы</Link>
            <Link href="/blog" className="hover:opacity-60 transition-opacity">Блог</Link>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <Link href="/auth/login" className="pill pill-paper pill-sm text-xs md:text-sm">Войти</Link>
            <Link href="/auth/register" className="pill pill-ink pill-sm text-xs md:text-sm">Открыть IMBA</Link>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <div className="rounded-xl px-5 md:px-12 py-10 md:py-14" style={{ background: 'var(--yellow)' }}>
        <div className="max-w-7xl mx-auto">
          <span className="chip mb-4" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>Блог</span>
          <h1 className="display text-4xl md:text-6xl mt-3">Гайды и новости</h1>
          <p className="mt-4 text-base md:text-lg font-medium text-ink/70 max-w-xl">
            VPN, eSIM и виртуальные карты — объясняем как это работает и как пользоваться.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="rounded-xl flex-1 px-5 md:px-12 py-10" style={{ background: 'var(--cream)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="panel h-full flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <span
                    className="chip"
                    style={{ background: post.categoryColor, borderColor: 'var(--ink)' }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-ink/40 font-semibold">{post.readTime} чтения</span>
                </div>
                <h2 className="text-lg md:text-xl font-black leading-snug group-hover:opacity-70 transition-opacity">
                  {post.title}
                </h2>
                <p className="text-sm text-ink/60 leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                  <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
                  <span className="text-sm font-black text-blue group-hover:underline">Читать →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/blog" className="hover:opacity-60">Блог</Link>
            <Link href="/privacy-policy" className="hover:opacity-60">Конфиденциальность</Link>
            <Link href="/terms" className="hover:opacity-60">Условия</Link>
          </div>
        </div>
        <div className="px-5 md:px-8 pb-6 border-t border-ink/10 pt-4">
          <p className="text-xs text-ink/40 text-center leading-relaxed">
            IMBA SRL · Reg. No. 3-102-942736 · Registered 25.08.2025 · Costa Rica, San José, Mata Redonda, Sabana Oeste, Avenida Doce Calle Noventa, ERP Lawyers Law Firm
          </p>
        </div>
      </footer>
    </div>
  )
}
