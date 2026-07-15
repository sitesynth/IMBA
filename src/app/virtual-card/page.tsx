import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'
import { FaqAccordion } from '@/components/FaqAccordion'
import { posts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Виртуальная карта для оплаты зарубежных сервисов | IMBA',
  description: 'Зарубежная виртуальная карта Visa/Mastercard в USD, EUR и AED. Оплата ChatGPT, Netflix, Spotify, Steam, Booking из России. Выпуск за 1 минуту, пополнение криптой — российская карта не нужна.',
  alternates: { canonical: 'https://www.imba.live/virtual-card' },
  openGraph: {
    title: 'Виртуальная карта для оплаты зарубежных сервисов | IMBA',
    description: 'Зарубежная виртуальная карта Visa/Mastercard в USD, EUR и AED. ChatGPT, Netflix, Spotify, Steam, Booking из России. Выпуск за 1 минуту.',
    url: 'https://www.imba.live/virtual-card',
    siteName: 'IMBA',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: 'https://www.imba.live/og-image.png', width: 1200, height: 630 }],
  },
}

const faqItems = [
  { q: 'Чем виртуальная карта отличается от обычной?', a: 'Только отсутствием пластика. Реквизиты те же: номер, срок действия, CVV, платёжный адрес. Для онлайн-оплат этого достаточно.', color: 'var(--green-100)' },
  { q: 'Нужна ли российская карта для пополнения?', a: 'Нет. Баланс пополняется криптовалютой (USDT, BTC и другие) или банковским переводом. Никакой привязки к российской финансовой системе.', color: 'var(--paper)' },
  { q: 'Какие комиссии у виртуальной карты?', a: 'Комиссии за пополнение и конвертацию видны до подтверждения операции — без скрытых списаний. Актуальные условия — в тарифах в кабинете.', color: 'var(--green-100)' },
  { q: 'Подойдёт ли карта для подписок с автосписанием?', a: 'Да. ChatGPT Plus, Netflix, Spotify списывают оплату автоматически, пока на балансе карты есть средства.', color: 'var(--paper)' },
  { q: 'Сколько карт можно выпустить?', a: 'На бесплатном тарифе Старт — 1 карта, на Про ($9.99/мес) — 3 карты, на Бизнес ($24.99/мес) — 10 карт.', color: 'var(--green-100)' },
  { q: 'Что делать, если платёж не прошёл?', a: 'Проверьте баланс и валюту карты. Некоторые сервисы требуют платёжный адрес — он выдаётся вместе с реквизитами. Если не помогло — напишите в поддержку.', color: 'var(--paper)' },
  { q: 'Безопасно ли пользоваться виртуальной картой?', a: 'Да. Виртуальную карту нельзя потерять или скопировать в офлайне. Каждая операция видна в кабинете, блокировка — в один клик.', color: 'var(--green-100)' },
  { q: 'В каких валютах работает карта?', a: 'USD, EUR и AED. При оплате в другой валюте конвертация автоматическая, курс виден до операции.', color: 'var(--paper)' },
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
  name: 'IMBA Виртуальная карта',
  description: 'Зарубежная виртуальная карта Visa/Mastercard в USD, EUR и AED для оплаты зарубежных сервисов из России. Выпуск за 1 минуту, пополнение криптовалютой или переводом.',
  brand: { '@type': 'Brand', name: 'IMBA' },
  offers: [
    { '@type': 'Offer', name: 'Старт', price: '0', priceCurrency: 'USD', description: '1 виртуальная карта, выпуск бесплатно', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' },
    { '@type': 'Offer', name: 'Про', price: '9.99', priceCurrency: 'USD', description: '3 виртуальные карты, приоритетная поддержка', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' },
    { '@type': 'Offer', name: 'Бизнес', price: '24.99', priceCurrency: 'USD', description: '10 виртуальных карт, API доступ', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.imba.live/' },
    { '@type': 'ListItem', position: 2, name: 'Виртуальная карта', item: 'https://www.imba.live/virtual-card' },
  ],
}

const SERVICES = [
  'Netflix', 'Spotify', 'ChatGPT Plus', 'Adobe', 'Amazon', 'Apple', 'Steam', 'Booking',
  'YouTube Premium', 'Notion', 'Figma', 'GitHub', 'Claude', 'Midjourney', 'Canva', 'Microsoft 365',
]

export default function VirtualCardPage() {
  const relatedPosts = posts.filter(p => p.category === 'Карта')

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>

      <Marquee
        bg="var(--green-100)"
        items={['VISA / MASTERCARD', 'USD · EUR · AED', 'ВЫПУСК ЗА 1 МИНУТУ', 'БЕЗ РОССИЙСКОЙ КАРТЫ', 'NETFLIX · SPOTIFY · CHATGPT']}
      />

      <SiteHeader />

      {/* Hero */}
      <div className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-12 py-14 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <span className="chip mb-5 inline-block" style={{ background: 'var(--green)', borderColor: 'var(--ink)' }}>Виртуальная карта</span>
            <h1 className="display text-3xl md:text-[2.1rem] mb-6 leading-tight">
              Виртуальная карта для оплаты зарубежных сервисов
            </h1>
            <p className="text-base md:text-lg font-semibold text-ink/65 max-w-xl mb-8">
              Зарубежная виртуальная карта Visa/Mastercard в USD, EUR и AED. ChatGPT, Netflix, Spotify, Steam, Booking — всё оплачивается как обычной картой. Выпуск за минуту, без верификаций, российская карта не нужна.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register" className="pill text-base" style={{ background: '#55DB9C', color: '#111111', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>
                Выпустить карту →
              </Link>
              <Link href="#how" className="pill pill-paper text-base">Как это работает</Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blog/virtualcard.svg" alt="Виртуальная карта IMBA" className="w-56 md:w-80 shrink-0 -mt-4 md:-mt-8" />
        </div>
      </div>

      {/* Services marquee */}
      <div className="rounded-xl px-5 md:px-12 py-8" style={{ background: 'var(--green-100)' }}>
        <p className="text-center text-xs font-bold text-ink/40 uppercase tracking-widest mb-6">Работает везде, где не принимают российские карты</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
          {SERVICES.map(s => (
            <span key={s} className="chip" style={{ background: 'var(--paper)', borderColor: 'var(--ink)' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Why you need it */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl mb-4">Зачем нужна зарубежная виртуальная карта</h2>
        <p className="font-semibold text-ink/55 mb-4 text-sm md:text-base max-w-2xl leading-relaxed">
          После ухода Visa и Mastercard зарубежные сайты перестали принимать карты российских банков: не продлить ChatGPT Plus, не оплатить Netflix, не купить игру в Steam, не забронировать отель на Booking.com.
        </p>
        <p className="font-semibold text-ink/55 text-sm md:text-base max-w-2xl leading-relaxed">
          Виртуальная карта IMBA выпущена вне российской банковской системы, и у неё есть всё, что у обычной карты: <strong className="text-ink">номер, срок действия, CVV и платёжный адрес</strong>. Для любого сайта она неотличима от пластиковой Visa или Mastercard — вводишь реквизиты и платишь.
        </p>
      </section>

      {/* What you can pay for */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-5xl mb-8">Что можно оплатить виртуальной картой</h2>
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <div className="panel p-6">
            <h3 className="display text-base mb-3">AI-сервисы и подписки</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">
              ChatGPT Plus, Claude, Midjourney, Netflix, Spotify, YouTube Premium, Steam, PlayStation, Adobe, Notion — любой сервис с оплатой картой, включая автосписания. Гайды: <Link href="/blog/pay-chatgpt-from-russia" className="font-black text-ink border-b border-dotted border-ink/40">как оплатить ChatGPT</Link>, <Link href="/blog/pay-netflix-from-russia" className="font-black text-ink border-b border-dotted border-ink/40">как оплатить Netflix</Link>.
            </p>
          </div>
          <div className="panel p-6">
            <h3 className="display text-base mb-3">Покупки и путешествия</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">
              Amazon, eBay, Booking.com, Airbnb, авиабилеты на сайтах иностранных авиакомпаний, аренда авто. В поездке карта работает в паре с <Link href="/esim" className="font-black text-ink border-b border-dotted border-ink/40">eSIM IMBA</Link> — интернет и оплата из одного кабинета.
            </p>
          </div>
          <div className="panel p-6">
            <h3 className="display text-base mb-3">Работа и бизнес</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">
              Рекламные кабинеты, хостинги, домены, SaaS-инструменты, App Store Developer и Google Play Console. На тарифе Про — до 3 карт: отдельная под каждую задачу.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl text-center mb-2">Как это работает</h2>
        <p className="text-center font-semibold text-ink/55 mb-12 text-sm md:text-lg">От регистрации до первой оплаты — за 5 минут</p>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Пополни баланс', desc: 'Через USDT, BTC или банковский перевод. Российская карта не нужна — никаких ограничений ЦБ.', cta: 'Пополнить →', href: '/auth/register' },
            { step: '02', title: 'Выпусти карту', desc: 'В личном кабинете — один клик. Реквизиты: номер карты, срок, CVV, платёжный адрес — всё готово мгновенно.', cta: 'Выпустить →', href: '/auth/register' },
            { step: '03', title: 'Оплачивай везде', desc: 'Введи реквизиты на сайте сервиса как обычную карту. Работает в 190+ странах, онлайн и в подписках.', cta: 'Начать →', href: '/auth/register' },
          ].map(item => (
            <div key={item.step} className="panel p-7 flex flex-col gap-4" style={{ background: 'var(--green-100)' }}>
              <div className="flex items-start justify-between gap-2">
                <span className="display text-5xl text-ink/20">{item.step}</span>
                <Link href={item.href} className="pill pill-sm flex-shrink-0" style={{ background: '#55DB9C', color: '#111111', boxShadow: '0 4px 0 0 rgba(17,17,17,0.2)', fontSize: '12px' }}>{item.cta}</Link>
              </div>
              <h3 className="display text-xl">{item.title}</h3>
              <p className="text-sm font-semibold text-ink/65 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-5xl text-center mb-12">Почему IMBA Карта</h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {[
            { icon: '💳', title: 'Visa и Mastercard', desc: 'Принимаются везде, где принимают международные карты. Никаких ограничений по географии и категориям покупок.' },
            { icon: '⚡', title: 'Выпуск за 1 минуту', desc: 'Никаких KYC, верификаций и ожиданий. Реквизиты доступны сразу после пополнения баланса.' },
            { icon: '🌐', title: 'USD · EUR · AED', desc: 'Три валюты на выбор. Оплачивай американские сервисы в долларах, европейские — в евро.' },
            { icon: '🔒', title: 'Без привязки к России', desc: 'Пополнение через крипту или перевод. Карта зарегистрирована вне российской финансовой системы.' },
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

      {/* Comparison table */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-5xl text-center mb-10">Чем платить за зарубежные сервисы: сравнение</h2>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs text-ink/50 uppercase tracking-wider">
                <th className="pb-3 pr-3 font-semibold">Способ</th>
                <th className="pb-3 pr-3 font-semibold">Скорость</th>
                <th className="pb-3 pr-3 font-semibold">Документы</th>
                <th className="pb-3 pr-3 font-semibold">Комиссия</th>
                <th className="pb-3 font-semibold">Автосписания</th>
              </tr>
            </thead>
            <tbody className="font-semibold">
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-3 font-black">Виртуальная карта IMBA</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>1 минута</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>не нужны</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>видна до операции</td>
                <td className="py-3" style={{ color: '#6abf6e' }}>работают</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-3 font-black">Карта зарубежного банка</td>
                <td className="py-3 pr-3" style={{ color: '#c9a040' }}>поездка + недели</td>
                <td className="py-3 pr-3 text-ink/40">загранпаспорт, местный ИНН</td>
                <td className="py-3 pr-3" style={{ color: '#c9a040' }}>обслуживание банка</td>
                <td className="py-3" style={{ color: '#6abf6e' }}>работают</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-3 font-black">Посредники «оплачу за вас»</td>
                <td className="py-3 pr-3" style={{ color: '#c9a040' }}>часы</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>нет</td>
                <td className="py-3 pr-3 text-ink/40">20–30% наценки</td>
                <td className="py-3 text-ink/40">каждый раз заново</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-3 font-black">Криптовалюта напрямую</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>минуты</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>нет</td>
                <td className="py-3 pr-3" style={{ color: '#c9a040' }}>сеть + обмен</td>
                <td className="py-3 text-ink/40">почти нигде</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="rounded-xl px-5 md:px-8 py-6" style={{ background: 'var(--paper)' }}>
        <p className="text-center font-semibold text-ink/60 text-sm md:text-base">
          В подписку IMBA также входят <Link href="/" className="font-black text-ink border-b border-dotted border-ink/40 hover:opacity-70">VPN на VLESS Reality</Link> и <Link href="/esim" className="font-black text-ink border-b border-dotted border-ink/40 hover:opacity-70">eSIM для 190+ стран</Link> — один кабинет, один баланс.
        </p>
      </section>

      {/* Blog posts */}
      {relatedPosts.length > 0 && (
        <section className="rounded-xl px-5 md:px-12 py-12" style={{ background: 'var(--paper)' }}>
          <h2 className="display text-3xl md:text-5xl mb-2">Читай по теме</h2>
          <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base">Как платить за зарубежные сервисы из России</p>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {relatedPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="panel h-full flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <span className="chip" style={{ background: 'var(--green)', borderColor: 'var(--ink)' }}>{post.category}</span>
                    <span className="text-xs text-ink/40 font-semibold">{post.readTime} чтения</span>
                  </div>
                  <h3 className="text-lg font-black leading-snug group-hover:opacity-70 transition-opacity">{post.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                    <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
                    <span className="text-sm font-black group-hover:underline" style={{ color: 'var(--green)' }}>Читать →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="rounded-xl px-4 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-7xl text-center mb-2">Вопросы?</h2>
        <p className="text-center font-semibold text-ink/60 mb-10 text-sm md:text-lg">Всё о виртуальной карте</p>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl text-center py-16 px-6" style={{ background: 'var(--green)' }}>
        <h2 className="display text-4xl md:text-6xl mb-4">Готов платить везде?</h2>
        <p className="font-semibold text-lg text-ink/70 mb-8">Выпуск карты за 1 минуту. Без привязки российской карты.</p>
        <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">Выпустить карту →</Link>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  )
}
