import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'
import { posts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Сергей Карпов — автор блога IMBA: VPN, eSIM, виртуальные карты',
  description: 'Статьи Сергея Карпова в блоге IMBA: инструкции по VPN-протоколам, установке eSIM и оплате зарубежных сервисов. Все гайды проверены на реальных устройствах.',
  alternates: { canonical: 'https://www.imba.live/blog/author/sergey-karpov' },
  openGraph: {
    title: 'Сергей Карпов — автор блога IMBA',
    description: 'Статьи Сергея Карпова в блоге IMBA: инструкции по VPN-протоколам, установке eSIM и оплате зарубежных сервисов.',
    url: 'https://www.imba.live/blog/author/sergey-karpov',
    siteName: 'IMBA',
    locale: 'ru_RU',
    type: 'profile',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.imba.live/blog/author/sergey-karpov#person',
  name: 'Сергей Карпов',
  url: 'https://www.imba.live/blog/author/sergey-karpov',
  jobTitle: 'Автор блога IMBA',
  worksFor: { '@type': 'Organization', '@id': 'https://www.imba.live/#organization', name: 'IMBA', url: 'https://www.imba.live' },
  knowsAbout: ['VPN', 'VLESS Reality', 'WireGuard', 'eSIM', 'виртуальные карты', 'оплата зарубежных сервисов'],
  sameAs: [],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.imba.live/' },
    { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://www.imba.live/blog' },
    { '@type': 'ListItem', position: 3, name: 'Сергей Карпов', item: 'https://www.imba.live/blog/author/sergey-karpov' },
  ],
}

const CATEGORY_COLORS: Record<string, string> = {
  VPN: 'var(--violet)',
  eSIM: 'var(--violet)',
  'Карта': 'var(--green)',
}

export default function AuthorPage() {
  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>

      <Marquee
        bg="var(--cream)"
        items={['VPN · eSIM · КАРТА', 'БЛОГ IMBA', 'ГАЙДЫ И ИНСТРУКЦИИ', 'ПРОВЕРЕНО НА УСТРОЙСТВАХ']}
      />

      <SiteHeader />

      {/* Author hero */}
      <section className="rounded-xl px-5 md:px-12 py-14 md:py-20" style={{ background: 'var(--paper)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="text-sm font-semibold text-ink/40 hover:text-ink/70">← Блог</Link>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full shrink-0 overflow-hidden self-center md:self-start md:mt-1" style={{ border: '3px solid var(--ink)', background: 'var(--cream)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/blog/karpov.svg"
                alt="Сергей Карпов — автор блога IMBA"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 15%', transform: 'scale(1.15)' }}
              />
            </div>
            <div>
              <h1 className="display text-3xl md:text-5xl mb-6">Сергей Карпов</h1>
              <p className="text-lg md:text-xl font-semibold text-ink/65 max-w-2xl leading-relaxed">
                Пишу про VPN-протоколы, eSIM и оплату зарубежных сервисов из России. Каждую инструкцию проверяю на реальных устройствах — Windows, macOS, Android, iPhone и Android TV — перед публикацией. Слежу за изменениями блокировок и обновляю статьи, когда что-то перестаёт работать.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E-E-A-T facts */}
      <section className="rounded-xl px-5 md:px-12 py-8" style={{ background: 'var(--cream)' }}>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="display text-3xl md:text-4xl mb-1">{posts.length}</div>
            <div className="text-sm font-semibold text-ink/50">статей в блоге</div>
          </div>
          <div>
            <div className="display text-3xl md:text-4xl mb-1">3</div>
            <div className="text-sm font-semibold text-ink/50">темы: VPN, eSIM, карты</div>
          </div>
          <div>
            <div className="display text-3xl md:text-4xl mb-1">5+</div>
            <div className="text-sm font-semibold text-ink/50">устройств для тестов</div>
          </div>
        </div>
      </section>

      {/* Articles list */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-8">Все статьи</h2>
          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="panel h-full flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <span className="chip" style={{ background: CATEGORY_COLORS[post.category] ?? 'var(--cream)', borderColor: 'var(--ink)' }}>{post.category}</span>
                    <span className="text-xs text-ink/40 font-semibold">{post.readTime} чтения</span>
                  </div>
                  <h3 className="text-lg font-black leading-snug group-hover:opacity-70 transition-opacity">{post.title}</h3>
                  <p className="text-sm text-ink/60 font-semibold leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                    <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
                    <span className="text-sm font-black group-hover:underline" style={{ color: 'var(--violet)' }}>Читать →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/blog" className="hover:opacity-60">Блог</Link>
            <Link href="/privacy-policy" className="hover:opacity-60">Конфиденциальность</Link>
            <Link href="/terms" className="hover:opacity-60">Условия</Link>
            <Link href="/refund" className="hover:opacity-60">Возврат средств</Link>
          </div>
        </div>
        <div className="px-5 md:px-8 pb-6 border-t border-ink/10 pt-4">
          <p className="text-xs text-ink/40 text-center leading-relaxed">
            IMBA SRL · Reg. No. 3-102-942736 · Costa Rica, San José
          </p>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  )
}
