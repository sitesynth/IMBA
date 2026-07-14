import type { Metadata } from 'next'
import Link from 'next/link'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'
import { Logo } from '@/components/Logo'
import { BlogList, type BlogListPost } from '@/components/BlogList'
import { posts } from '@/lib/posts'

const FEATURED_SLUG = 'vpn-russia-2026'
const AUTHOR = 'Сергей Карпов'

// Cover images with descriptive alt text (SEO). Only posts that have a rendered cover file.
const COVERS: Record<string, { src: string; alt: string }> = {
  'vpn-russia-2026': { src: '/blog/cover-vpn-russia-2026.svg', alt: 'VPN в России 2026: какой протокол реально работает — разбор IMBA' },
  'esim-russia-abroad': { src: '/blog/esim-russia-abroad.svg', alt: 'eSIM для россиян: интернет за рубежом без роуминга' },
}

export const metadata: Metadata = {
  title: 'Блог IMBA — eSIM, VPN и виртуальные карты. Интернет без границ.',
  description: 'Гайды, разборы протоколов и практические советы по VPN, eSIM и виртуальным картам. Интернет без границ с IMBA.',
  alternates: { canonical: 'https://www.imba.live/blog' },
  openGraph: {
    title: 'Блог IMBA — гайды по VPN, eSIM и виртуальным картам',
    description: 'Практические гайды: какой VPN работает в России, как оплатить ChatGPT и Netflix, eSIM для путешествий.',
    type: 'website',
    url: 'https://www.imba.live/blog',
    images: [{ url: 'https://www.imba.live/og-image.png', width: 1200, height: 630 }],
    locale: 'ru_RU',
    siteName: 'IMBA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Блог IMBA — гайды по VPN, eSIM и виртуальным картам',
    description: 'Практические гайды: какой VPN работает в России, как оплатить ChatGPT и Netflix, eSIM для путешествий.',
    images: ['https://www.imba.live/og-image.png'],
  },
}

export default function BlogPage() {
  const featured = posts.find((p) => p.slug === FEATURED_SLUG)
  const rest: BlogListPost[] = posts
    .filter((p) => p.slug !== FEATURED_SLUG)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      categoryColor: p.categoryColor,
      date: p.date,
      readTime: p.readTime,
      cover: COVERS[p.slug],
    }))
  const featuredCover = featured ? COVERS[featured.slug] : undefined

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Блог IMBA',
        url: 'https://www.imba.live/blog',
        description: 'Гайды по VPN, eSIM и виртуальным картам для пользователей из России',
        publisher: { '@type': 'Organization', '@id': 'https://www.imba.live/#organization', name: 'IMBA', url: 'https://www.imba.live' },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.imba.live/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://www.imba.live/blog' },
        ],
      })}} />
      <Marquee
        bg="var(--violet-100)"
        items={['eSIM В 190 СТРАНАХ', 'VPN БЕЗ ЛОГОВ', 'ВИРТУАЛЬНАЯ КАРТА', 'ОПЛАТА ВЕЗДЕ', 'БЕЗ ГРАНИЦ']}
      />

      <SiteHeader />

      {/* Hero */}
      <div className="rounded-xl px-5 md:px-12 py-10 md:py-14" style={{ background: 'var(--yellow)' }}>
        <div className="max-w-7xl mx-auto">
          <span className="chip mb-4" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>Блог</span>
          <h1 className="display text-4xl md:text-6xl mt-3">Гайды и инструкции</h1>
          <p className="mt-4 text-base md:text-lg font-medium text-ink/70 max-w-2xl">
            VPN, eSIM и виртуальные карты: как это работает и как пользоваться. Пошагово, проверено на реальных устройствах.
          </p>
        </div>
      </div>

      {/* Featured + grid */}
      <div className="rounded-xl flex-1 px-5 md:px-12 py-10" style={{ background: 'var(--cream)' }}>
        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block max-w-7xl mx-auto mb-8">
            <article className="panel overflow-hidden grid md:grid-cols-2 gap-0 hover:-translate-y-1 transition-transform duration-200" style={{ padding: 0 }}>
              {featuredCover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredCover.src}
                  alt={featuredCover.alt}
                  className="w-full h-full object-cover border-b-2 md:border-b-0 md:border-r-2 border-ink/10"
                />
              )}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-2">
                  {featured.category} · Главный материал
                </span>
                <h2 className="display text-2xl md:text-3xl mb-3 group-hover:opacity-70 transition-opacity">
                  {featured.title}
                </h2>
                <p className="text-sm md:text-base text-ink/65 leading-relaxed mb-4">{featured.excerpt}</p>
                <span className="text-xs text-ink/40 font-semibold">
                  {AUTHOR} · {featured.date} · {featured.readTime}
                </span>
              </div>
            </article>
          </Link>
        )}

        {/* Filterable grid */}
        <BlogList posts={rest} />
      </div>

      {/* Community CTA */}
      <section className="rounded-xl px-5 md:px-12 py-12 text-center" style={{ background: 'var(--violet-100)' }}>
        <h2 className="display text-2xl md:text-4xl mb-3">Не потеряй нас</h2>
        <p className="font-medium text-ink/70 max-w-xl mx-auto mb-6 text-sm md:text-base">
          Новые гайды, обновления протоколов и запасные адреса — в сообществе IMBA.
          Подписка также даёт 7 дней VPN бесплатно.
        </p>
        <Link href="/#free-vpn" className="pill pill-ink text-base">Получить 7 дней бесплатно →</Link>
      </section>

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/blog" className="hover:opacity-60">Блог</Link>
            <Link href="/privacy-policy" className="hover:opacity-60">Конфиденциальность</Link>
            <Link href="/terms" className="hover:opacity-60">Условия</Link>
            <Link href="/refund" className="hover:opacity-60"><span className="sm:hidden">Возврат</span><span className="hidden sm:inline">Возврат средств</span></Link>
          </div>
        </div>
        <div className="px-5 md:px-8 pb-6 border-t border-ink/10 pt-4">
          <p className="text-xs text-ink/40 text-center leading-relaxed">
            IMBA SRL · Reg. No. 3-102-942736 · Registered 25.08.2025 · Costa Rica, San José, Mata Redonda, Sabana Oeste, Avenida Doce Calle Noventa
          </p>
        </div>
      </footer>
    </div>
  )
}
