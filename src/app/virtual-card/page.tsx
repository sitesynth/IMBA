import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { FaqAccordion } from '@/components/FaqAccordion'
import { posts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Виртуальная карта для Netflix, Spotify, ChatGPT — без российской карты | IMBA',
  description: 'Виртуальная Visa/Mastercard для оплаты зарубежных сервисов. Netflix, Spotify, ChatGPT Plus, Adobe, Amazon — всё работает. Выпуск за 1 минуту, без российской карты.',
  alternates: { canonical: 'https://www.imba.live/virtual-card' },
  openGraph: {
    title: 'Виртуальная карта для зарубежных сервисов | IMBA',
    description: 'Visa/Mastercard для Netflix, Spotify, ChatGPT — без российской карты. Выпуск за минуту.',
    url: 'https://www.imba.live/virtual-card',
    siteName: 'IMBA',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: 'https://www.imba.live/og-image.png', width: 1200, height: 630 }],
  },
}

const faqItems = [
  { q: 'Для чего нужна виртуальная карта IMBA?', a: 'Для оплаты зарубежных сервисов, которые не принимают российские карты: Netflix, Spotify, ChatGPT Plus, Adobe Creative Cloud, Amazon, Apple App Store, Patreon и тысячи других. Карта работает как обычная Visa/Mastercard.', color: 'var(--green-100)' },
  { q: 'Нужна ли российская карта для пополнения?', a: 'Нет. Российская карта не требуется. Баланс IMBA пополняется через криптовалюту (USDT, BTC и другие) или банковским переводом. Никаких привязок к российской финансовой системе.', color: 'var(--paper)' },
  { q: 'В каких валютах работает карта?', a: 'USD, EUR и AED. При оплате в другой валюте конвертация происходит автоматически по текущему курсу. Комиссия за конвертацию прозрачна и указана в тарифах.', color: 'var(--green-100)' },
  { q: 'Как быстро выпускается карта?', a: 'Моментально. После пополнения баланса карта выпускается за 1 минуту прямо в личном кабинете. Никаких верификаций и ожиданий — реквизиты доступны сразу.', color: 'var(--paper)' },
  { q: 'Безопасно ли использовать?', a: 'Да. Карта виртуальная — физически не существует, её нельзя потерять или украсть. Для каждой покупки ты видишь точный список операций. При необходимости карту можно заблокировать в один клик.', color: 'var(--green-100)' },
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
  description: 'Виртуальная Visa/Mastercard для оплаты Netflix, Spotify, ChatGPT Plus и других зарубежных сервисов. Выпуск за 1 минуту.',
  brand: { '@type': 'Brand', name: 'IMBA' },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://www.imba.live/auth/register',
  },
}

const SERVICES = [
  'Netflix', 'Spotify', 'ChatGPT Plus', 'Adobe', 'Amazon', 'Apple', 'Patreon', 'YouTube Premium',
  'Notion', 'Figma', 'GitHub', 'Anthropic', 'OpenAI', 'Canva', 'Dropbox', 'Microsoft 365',
]

export default function VirtualCardPage() {
  const relatedPosts = posts.filter(p => p.category === 'Карта')

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>

      <Marquee
        bg="var(--green-100)"
        items={['VISA / MASTERCARD', 'USD · EUR · AED', 'ВЫПУСК ЗА 1 МИНУТУ', 'БЕЗ РОССИЙСКОЙ КАРТЫ', 'NETFLIX · SPOTIFY · CHATGPT']}
      />

      {/* Nav */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
        <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
          <Logo size="lg" />
          <div className="hidden md:flex items-center gap-7 text-sm uppercase flex-1 justify-center" style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}>
            <Link href="/esim" className="hover:opacity-60 transition-opacity">eSIM</Link>
            <Link href="/" className="hover:opacity-60 transition-opacity">VPN</Link>
            <Link href="/virtual-card" className="transition-opacity" style={{ color: 'var(--green)' }}>Карта</Link>
            <Link href="/blog" className="hover:opacity-60 transition-opacity">Блог</Link>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <Link href="/auth/login" className="pill pill-paper pill-sm text-xs md:text-sm">Войти</Link>
            <Link href="/auth/register" className="pill pill-sm text-xs md:text-sm" style={{ background: 'var(--green)', color: 'var(--ink)', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>Выпустить карту</Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="px-5 md:px-12 py-14 md:py-20 max-w-7xl mx-auto">
          <span className="chip mb-5 inline-block" style={{ background: 'var(--green)', borderColor: 'var(--ink)' }}>Виртуальная карта</span>
          <h1 className="display text-4xl md:text-7xl mb-6 max-w-3xl">
            Карта для оплаты<br />зарубежных сервисов.
          </h1>
          <p className="text-lg md:text-xl font-semibold text-ink/65 max-w-xl mb-8">
            Visa/Mastercard в USD, EUR и AED. Netflix, Spotify, ChatGPT, Adobe — всё работает. Без российской карты, выпуск за минуту.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/auth/register" className="pill text-base" style={{ background: 'var(--green)', color: 'var(--ink)', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>
              Выпустить карту →
            </Link>
            <Link href="#how" className="pill pill-paper text-base">Как это работает</Link>
          </div>
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

      {/* How it works */}
      <section id="how" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl text-center mb-2">Как это работает</h2>
        <p className="text-center font-semibold text-ink/55 mb-12 text-sm md:text-lg">От регистрации до первой оплаты — за 5 минут</p>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Пополни баланс', desc: 'Через USDT, BTC или банковский перевод. Российская карта не нужна — никаких ограничений ЦБ.' },
            { step: '02', title: 'Выпусти карту', desc: 'В личном кабинете — один клик. Реквизиты: номер карты, срок, CVV, платёжный адрес — всё готово мгновенно.' },
            { step: '03', title: 'Оплачивай везде', desc: 'Введи реквизиты на сайте сервиса как обычную карту. Работает в 190+ странах, онлайн и в подписках.' },
          ].map(item => (
            <div key={item.step} className="panel p-7 flex flex-col gap-4" style={{ background: 'var(--green-100)' }}>
              <span className="display text-5xl text-ink/20">{item.step}</span>
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

      {/* Blog posts */}
      {relatedPosts.length > 0 && (
        <section className="rounded-xl px-5 md:px-12 py-12" style={{ background: 'var(--paper)' }}>
          <h2 className="display text-3xl md:text-5xl mb-2">Читай по теме</h2>
          <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base">Как платить за зарубежные сервисы из России</p>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
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
      <section className="rounded-xl px-4 md:px-12 py-12 md:py-16" style={{ background: 'var(--green-100)' }}>
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
    </div>
  )
}
