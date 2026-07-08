import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { FaqAccordion } from '@/components/FaqAccordion'
import { posts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Купить eSIM для путешествий — интернет в 190+ странах без роуминга | IMBA',
  description: 'eSIM для 190+ стран без физической SIM-карты. Активация по QR за минуту. Дешевле роуминга в 5–20 раз. Работает на iPhone и Android.',
  alternates: { canonical: 'https://www.imba.live/esim' },
  openGraph: {
    title: 'eSIM для путешествий — интернет в 190+ странах | IMBA',
    description: 'Купи eSIM, отсканируй QR — и уже в сети. Без похода в салон, без роуминга.',
    url: 'https://www.imba.live/esim',
    siteName: 'IMBA',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: 'https://www.imba.live/og-image.png', width: 1200, height: 630 }],
  },
}

const faqItems = [
  { q: 'Что такое eSIM?', a: 'eSIM — это электронная SIM-карта, встроенная в твой телефон. Не нужно идти в салон связи: купи тариф в IMBA, отсканируй QR-код — и через минуту у тебя есть локальный интернет в любой стране.', color: 'var(--violet-100)' },
  { q: 'Какие устройства поддерживают eSIM?', a: 'iPhone XS и новее, все iPhone 14+ (только eSIM, без физической SIM). Android: Google Pixel 4+, Samsung Galaxy S21+, большинство флагманов 2021 года и новее. Проверь свою модель в настройках: Общие → Об устройстве → Доступные SIM.', color: 'var(--paper)' },
  { q: 'Насколько eSIM дешевле роуминга?', a: 'В среднем в 5–20 раз. Например, 10 ГБ в Германии: роуминг МТС — около 5 000 ₽, eSIM IMBA — около 400–600 ₽. В Таиланде, Турции и ОАЭ разница ещё больше.', color: 'var(--violet-100)' },
  { q: 'Мой номер остаётся активным?', a: 'Да. eSIM — это второй профиль, твоя основная российская SIM не отключается. Звонки и SMS приходят как обычно, интернет идёт через eSIM с местным тарифом.', color: 'var(--paper)' },
  { q: 'Что делать, если заканчиваются данные?', a: 'Просто купи новый пакет в IMBA — активация та же, через QR или автоматически через приложение. Не нужно искать Wi-Fi или идти в магазин.', color: 'var(--violet-100)' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'IMBA eSIM',
  description: 'eSIM для путешественников: интернет в 190+ странах без роуминга, активация по QR за 1 минуту.',
  brand: { '@type': 'Brand', name: 'IMBA' },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://www.imba.live/auth/register',
  },
}

export default function EsimPage() {
  const relatedPosts = posts.filter(p => p.category === 'eSIM')

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>

      <Marquee
        bg="var(--violet-100)"
        items={['190+ СТРАН', 'АКТИВАЦИЯ ЗА 1 МИНУТУ', 'БЕЗ ФИЗИЧЕСКОЙ SIM', 'iPhone И ANDROID', 'ДЕШЕВЛЕ РОУМИНГА В 10×']}
      />

      {/* Nav */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
        <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
          <Logo size="lg" />
          <div className="hidden md:flex items-center gap-7 text-sm uppercase flex-1 justify-center" style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}>
            <Link href="/esim" className="transition-opacity" style={{ color: 'var(--violet-100)', WebkitTextStroke: '0.5px var(--ink)' }}>eSIM</Link>
            <Link href="/" className="hover:opacity-60 transition-opacity">VPN</Link>
            <Link href="/virtual-card" className="hover:opacity-60 transition-opacity">Карта</Link>
            <Link href="/blog" className="hover:opacity-60 transition-opacity">Блог</Link>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <Link href="/auth/login" className="pill pill-paper pill-sm text-xs md:text-sm">Войти</Link>
            <Link href="/auth/register" className="pill pill-sm text-xs md:text-sm" style={{ background: '#C9A4FF', color: '#111111', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>Получить eSIM</Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="px-5 md:px-12 py-14 md:py-20 max-w-7xl mx-auto">
          <span className="chip mb-5 inline-block" style={{ background: 'var(--violet)', borderColor: 'var(--ink)' }}>eSIM</span>
          <h1 className="display text-4xl md:text-7xl mb-6 max-w-3xl">
            eSIM для 190+ стран.<br />Интернет без роуминга.
          </h1>
          <p className="text-lg md:text-xl font-semibold text-ink/65 max-w-xl mb-8">
            Купи eSIM, отсканируй QR — и через минуту в сети. Дешевле роуминга в 5–20 раз. Работает на iPhone и Android.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/auth/register" className="pill text-base" style={{ background: '#C9A4FF', color: '#111111', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>
              Купить eSIM →
            </Link>
            <Link href="#how" className="pill pill-paper text-base">Как это работает</Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="rounded-xl px-5 md:px-12 py-8" style={{ background: 'var(--violet-100)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          {[
            { n: '190+', label: 'стран' },
            { n: '1 мин', label: 'активация по QR' },
            { n: '× 10', label: 'дешевле роуминга' },
            { n: '0', label: 'поход в салон' },
          ].map(s => (
            <div key={s.n}>
              <div className="display text-4xl md:text-5xl mb-1">{s.n}</div>
              <div className="text-sm font-semibold text-ink/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl text-center mb-2">Как это работает</h2>
        <p className="text-center font-semibold text-ink/55 mb-12 text-sm md:text-lg">Три шага от регистрации до интернета</p>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Выбери страну', desc: 'В личном кабинете выбираешь страну назначения и объём данных — от 1 ГБ до безлимита.', cta: 'Выбрать →', href: '/auth/register' },
            { step: '02', title: 'Купи тариф', desc: 'Оплата через IMBA-баланс. Пополнение криптой или переводом. Российская карта не нужна.', cta: 'Купить →', href: '/auth/register' },
            { step: '03', title: 'Активируй по QR', desc: 'Сканируешь QR в настройках телефона — и всё. Профиль eSIM активен, интернет работает. Без физической симки.', cta: 'Начать →', href: '/auth/register' },
          ].map(item => (
            <div key={item.step} className="panel p-7 flex flex-col gap-4" style={{ background: 'var(--violet-100)' }}>
              <div className="flex items-start justify-between gap-2">
                <span className="display text-5xl text-ink/20">{item.step}</span>
                <Link href={item.href} className="pill pill-sm flex-shrink-0" style={{ background: '#C9A4FF', color: '#111111', boxShadow: '0 4px 0 0 rgba(17,17,17,0.2)', fontSize: '12px' }}>{item.cta}</Link>
              </div>
              <h3 className="display text-xl">{item.title}</h3>
              <p className="text-sm font-semibold text-ink/65 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-5xl text-center mb-12">Почему IMBA eSIM</h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {[
            { icon: '🌍', title: '190+ стран', desc: 'Европа, Азия, Ближний Восток, Америка. Тариф найдётся для любого маршрута.' },
            { icon: '⚡', title: 'Активация за 1 минуту', desc: 'QR-код — и готово. Не нужно идти в салон, искать местный магазин или ждать доставки.' },
            { icon: '💰', title: 'Дешевле роуминга', desc: 'МТС, Билайн и Мегафон берут 200–500 ₽ за гигабайт. IMBA eSIM — от 40 ₽/ГБ.' },
            { icon: '📱', title: 'Второй профиль', desc: 'Российский номер остаётся активным. Звонки и SMS приходят как обычно.' },
          ].map(f => (
            <div key={f.title} className="panel p-6 flex gap-5">
              <span className="text-3xl flex-shrink-0">{f.icon}</span>
              <div>
                <h3 className="display text-lg mb-2">{f.title}</h3>
                <p className="text-sm font-semibold text-ink/60 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog posts */}
      {relatedPosts.length > 0 && (
        <section className="rounded-xl px-5 md:px-12 py-12" style={{ background: 'var(--paper)' }}>
          <h2 className="display text-3xl md:text-5xl mb-2">Читай по теме</h2>
          <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base">Гайды и советы по eSIM</p>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
            {relatedPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="panel h-full flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <span className="chip" style={{ background: 'var(--violet)', borderColor: 'var(--ink)' }}>{post.category}</span>
                    <span className="text-xs text-ink/40 font-semibold">{post.readTime} чтения</span>
                  </div>
                  <h3 className="text-lg font-black leading-snug group-hover:opacity-70 transition-opacity">{post.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                    <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
                    <span className="text-sm font-black group-hover:underline" style={{ color: 'var(--violet)' }}>Читать →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="rounded-xl px-4 md:px-12 py-12 md:py-16" style={{ background: 'var(--violet-100)' }}>
        <h2 className="display text-3xl md:text-7xl text-center mb-2">Вопросы?</h2>
        <p className="text-center font-semibold text-ink/60 mb-10 text-sm md:text-lg">Всё об eSIM</p>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl text-center py-16 px-6" style={{ background: 'var(--violet)' }}>
        <h2 className="display text-4xl md:text-6xl mb-4">Готов в путь?</h2>
        <p className="font-semibold text-lg text-ink/70 mb-8">Интернет в любой стране. Активация за минуту.</p>
        <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">Купить eSIM →</Link>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </div>
  )
}
