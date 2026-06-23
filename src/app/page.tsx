import Link from 'next/link'
import { FireIcon } from '@/components/FireIcon'
import { Marquee } from '@/components/Marquee'
import { LottieSticker } from '@/components/LottieSticker'
import { Logo } from '@/components/Logo'
import { AnimatedImbaLogo } from '@/components/AnimatedImbaLogo'
import { RainbowImbaLogo } from '@/components/RainbowImbaLogo'
import { SkyBackground } from '@/components/SkyBackground'
import { FaqAccordion } from '@/components/FaqAccordion'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      {/* Top ticker — full width, no rounding */}
      <Marquee
        bg="var(--violet-100)"
        items={['eSIM В 190 СТРАНАХ', 'VPN БЕЗ ЛОГОВ', 'ВИРТУАЛЬНАЯ КАРТА', 'ОПЛАТА ВЕЗДЕ', 'БЕЗ ГРАНИЦ']}
      />

      {/* Nav + Hero combined white block */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
        <Logo size="lg" />
        <div className="hidden md:flex items-center gap-7 text-sm uppercase flex-1 justify-center" style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}>
          <a href="#services" className="hover:opacity-60 transition-opacity">Сервисы</a>
          <a href="#pricing" className="hover:opacity-60 transition-opacity">Тарифы</a>
          <a href="#faq" className="hover:opacity-60 transition-opacity">Вопросы</a>
          <Link href="/blog" className="hover:opacity-60 transition-opacity">Блог</Link>
        </div>
        <Link href="/auth/register" className="pill pill-ink pill-sm imba-btn-pulse pac-btn flex items-center gap-2.5 px-4">
          <svg width="38" height="22" viewBox="0 0 58 34" fill="none">
            {/* dots stream: 5 total, last 2 outside viewBox, animate left into mouth */}
            <g className="pac-dots">
              <circle cx="35" cy="17" r="2.5" fill="#ffffff"/>
              <circle cx="45" cy="17" r="2.5" fill="#ffffff"/>
              <circle cx="55" cy="17" r="2.5" fill="#ffffff"/>
              <circle cx="65" cy="17" r="2.5" fill="#ffffff"/>
              <circle cx="75" cy="17" r="2.5" fill="#ffffff"/>
            </g>
            {/* static back arc: 60° CCW from upper-left→leftmost→lower-left */}
            <path d="M 4.88,10 A 14 14 0 0 0 4.88,24"
              stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"/>
            {/* top jaw = lip line + upper arc, one path — no junction gap */}
            <path className="pac-jaw-top"
              d="M 17,17 L 29.12,10 A 14 14 0 0 0 3,17"
              stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {/* bottom jaw = lip line + lower arc, one path */}
            <path className="pac-jaw-bottom"
              d="M 17,17 L 29.12,24 A 14 14 0 0 1 3,17"
              stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="2" fill="#ffffff"/>
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative px-4 md:px-5 pt-2 pb-10">
        <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-ink" style={{ minHeight: 'min(55vh, 720px)' }}>
          {/* Blue background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(130% 100% at 50% 35%, #5AA0FF 0%, #2E7DF6 45%, #1452C9 100%)',
            }}
          />

          {/* Mega wordmark — animated swirl clipped to IMBA letterforms */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ minHeight: 'min(55vh, 720px)' }}>
            <h1
              aria-label="IMBA"
              style={{
                position: 'relative',
                width: 'min(74vw, 860px)',
                height: 'auto',
                aspectRatio: '1419.1 / 470.8',
                filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.55)) drop-shadow(3px 3px 0 rgba(0,0,0,0.35))',
              }}
            >
              <RainbowImbaLogo style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              <AnimatedImbaLogo height={0} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }} />
            </h1>
          </div>

          {/* Lottie stickers */}
          <LottieSticker name="keys"   size={88}  className="sticker md:hidden" style={{ zIndex: 20, top: '6%',    left: '4%',  ['--rot' as string]: '-12deg', animationDelay: '0s' }} />
          <LottieSticker name="plane"  size={76}  className="sticker md:hidden" style={{ zIndex: 20, top: '6%',    right: '4%', ['--rot' as string]: '10deg',  animationDelay: '0.8s' }} />
          <LottieSticker name="cards"  size={88}  className="sticker md:hidden" style={{ zIndex: 20, bottom: '6%', left: '4%',  ['--rot' as string]: '8deg',   animationDelay: '1.4s' }} />
          <LottieSticker name="lock"   size={76}  className="sticker md:hidden" style={{ zIndex: 20, bottom: '6%', right: '4%', ['--rot' as string]: '-8deg',  animationDelay: '0.4s' }} />
          <LottieSticker name="keys"   size={180} className="sticker hidden md:block" style={{ zIndex: 20, top: '8%',    left: '3%',  ['--rot' as string]: '-12deg', animationDelay: '0s' }} />
          <LottieSticker name="plane"  size={160} className="sticker hidden md:block" style={{ zIndex: 20, top: '12%',   right: '3%', ['--rot' as string]: '10deg',  animationDelay: '0.8s' }} />
          <LottieSticker name="cards"  size={176} className="sticker hidden md:block" style={{ zIndex: 20, bottom: '8%', left: '4%',  ['--rot' as string]: '8deg',   animationDelay: '1.4s' }} />
          <LottieSticker name="lock"   size={160} className="sticker hidden md:block" style={{ zIndex: 20, bottom: '12%', right: '3%', ['--rot' as string]: '-8deg', animationDelay: '0.4s' }} />
        </div>

        {/* Subhead + CTA below blob */}
        <div className="text-center mt-10 fade-up">
          {/* Visually hidden H1 for SEO — visual heading is the animated logo above */}
          <h1 className="sr-only">eSIM, VPN и виртуальная карта для граждан России — IMBA</h1>
          <h2 className="display text-4xl md:text-6xl mb-5">
            Твой интернет.<br />Без границ.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-ink/70 max-w-xl mx-auto mb-8">
            eSIM для поездок, VPN для свободы и виртуальная карта для оплаты
            зарубежных сервисов. Всё в одном приложении.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">IMBAНУТЬСЯ →</Link>
            <Link href="#services" className="pill pill-paper text-base">Как это работает</Link>
          </div>
        </div>
      </section>
      </div>{/* end Nav+Hero white block */}

      {/* Stats marquee */}
      <Marquee
        bg="var(--yellow)"
        items={['190+ СТРАН', '50+ VPN-СЕРВЕРОВ', '0 ₽ ЗА ОТКРЫТИЕ', 'VISA / MASTERCARD', 'АКТИВАЦИЯ ЗА 1 МИНУТУ']}
      />

      {/* Services */}
      <section id="services" className="rounded-xl px-5 md:px-12 py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-5xl md:text-7xl text-center mb-4">Три сервиса.<br />Один кабинет.</h2>
        <p className="text-center text-lg font-semibold text-ink/60 mb-14">Управляй всем из одного места</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              lottie: 'plane', tag: 'eSIM', bg: 'var(--violet-100)',
              title: 'Мобильный интернет',
              desc: 'Купи eSIM для любой страны. Активация по QR за минуту, без поиска местной симки.',
              points: ['190+ стран', 'Активация по QR', 'Тарифы от 3 ГБ'],
            },
            {
              lottie: 'lock', tag: 'VPN', bg: 'var(--blue-100)',
              title: 'Свобода и защита',
              desc: 'Доступ к Instagram, LinkedIn и YouTube. VLESS Reality и WireGuard — быстро, без логов, работает в России.',
              points: ['VLESS Reality / WireGuard', '50+ серверов', 'Без логов'],
            },
            {
              lottie: 'cards', tag: 'Карта', bg: 'var(--green-100)',
              title: 'Оплата везде',
              desc: 'Виртуальная Visa/Mastercard для Netflix, Spotify, ChatGPT и других зарубежных сервисов.',
              points: ['Visa / Mastercard', 'USD / EUR / AED', 'Моментальный выпуск'],
            },
          ].map((s) => (
            <div key={s.tag} className="panel flex items-stretch gap-4 md:gap-5 p-4 md:p-7" style={{ background: s.bg }}>
              <div className="flex-1 flex flex-col">
                <span className="chip bg-paper mb-3 md:mb-4 w-fit">{s.tag}</span>
                <h3 className="display text-lg md:text-2xl mb-2 md:mb-3">{s.title}</h3>
                <p className="font-medium text-ink/75 mb-3 md:mb-4 leading-relaxed text-xs md:text-sm">{s.desc}</p>
                <ul className="space-y-1.5 md:space-y-2 font-bold text-xs md:text-sm mt-auto">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-ink" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center">
                <LottieSticker name={s.lottie} size={72} className="md:hidden" />
                <LottieSticker name={s.lottie} size={140} className="hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="rounded-xl px-3 md:px-12 py-10 md:py-16 overflow-hidden" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-7xl text-center mb-3 md:mb-4">Простые тарифы</h2>
        <p className="text-center text-sm md:text-lg font-semibold text-ink/60 mb-8 md:mb-14">Плати только за то, что используешь</p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Старт', price: 'Бесплатно', bg: 'var(--paper)', feats: ['1 eSIM профиль', 'VPN базовый (5 серверов)', '1 виртуальная карта'], cta: 'Начать' },
            { name: 'Про', price: '$9.99/мес', bg: 'var(--yellow)', hot: true, feats: ['5 eSIM профилей', 'VPN Pro (50+ серверов)', '3 виртуальные карты', 'Приоритетная поддержка'], cta: 'Подключить Про' },
            { name: 'Бизнес', price: '$24.99/мес', bg: 'var(--violet-100)', feats: ['Безлимит eSIM', 'VPN безлимит', '10 виртуальных карт', 'API доступ'], cta: 'Связаться' },
          ].map((p) => (
            <div key={p.name} className="panel relative flex flex-col p-5 md:p-7" style={{ background: p.bg }}>
              {p.hot && (
                <span className="chip bg-ink absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1" style={{ color: '#fff' }}>
                  <FireIcon size={28} /> Популярный
                </span>
              )}
              <div className="display text-lg md:text-xl mb-1 md:mb-2">{p.name}</div>
              <div className="display text-2xl md:text-4xl mb-4 md:mb-6">{p.price}</div>
              <ul className="space-y-2.5 font-semibold text-sm mb-7 flex-1">
                {p.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ink" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className={`pill w-full justify-center ${p.hot ? 'pill-ink' : 'pill-paper'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="rounded-xl px-4 md:px-12 py-10 md:py-16" style={{ background: 'var(--blue-100)' }}>
        <h2 className="display text-3xl md:text-7xl text-center mb-2">Вопросы?</h2>
        <p className="text-center font-semibold text-ink/60 mb-8 md:mb-12 text-sm md:text-lg">Ответы на всё что тебя беспокоит</p>

        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={[
            { q: 'Что такое eSIM?', a: 'eSIM — это электронная SIM-карта, встроенная в твой телефон. Не нужно идти в салон: купи тариф, отсканируй QR — и уже в сети.', color: 'var(--violet-100)' },
            { q: 'Работает ли VPN в России?', a: 'Да. Мы используем протокол VLESS Reality — он неотличим от обычного HTTPS-трафика. 50+ серверов в 30+ странах, без логов.', color: 'var(--blue-100)' },
            { q: 'Для чего виртуальная карта?', a: 'Для оплаты Netflix, Spotify, ChatGPT Plus, Adobe, Amazon и любых других зарубежных сервисов, которые не принимают российские карты.', color: 'var(--green-100)' },
            { q: 'Нужно ли привязывать российскую карту?', a: 'Нет. Карту для пополнения не требуем. Пополнение через криптовалюту или переводом.', color: 'var(--paper)' },
            { q: 'Мои данные в безопасности?', a: 'Мы не храним логи. VPN работает по принципу zero-knowledge — мы физически не можем узнать что ты делал в сети.', color: 'var(--violet-100)' },
          ]} />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl text-center py-16 px-6" style={{ background: 'var(--green)' }}>
        <div className="flex justify-center mb-4">
          <LottieSticker name="rocket" size={120} />
        </div>
        <h2 className="display text-4xl md:text-6xl mb-4">Готов начать?</h2>
        <p className="font-semibold text-lg text-ink/70 mb-8">Регистрация за минуту. Без привязки карты.</p>
        <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">IMBAНУТЬСЯ →</Link>
      </section>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Что такое eSIM?', acceptedAnswer: { '@type': 'Answer', text: 'eSIM — это электронная SIM-карта, встроенная в твой телефон. Не нужно идти в салон: купи тариф, отсканируй QR — и уже в сети. IMBA поддерживает eSIM в 190+ странах с активацией за 1 минуту.' } },
          { '@type': 'Question', name: 'Работает ли VPN в России?', acceptedAnswer: { '@type': 'Answer', text: 'Да. IMBA использует два протокола: VLESS Reality (для Москвы и СПб — неотличим от HTTPS для ТСПУ) и WireGuard (для регионов). 50+ серверов в 30+ странах, без логов.' } },
          { '@type': 'Question', name: 'Для чего нужна виртуальная карта IMBA?', acceptedAnswer: { '@type': 'Answer', text: 'Виртуальная Visa/Mastercard от IMBA предназначена для оплаты Netflix, Spotify, ChatGPT Plus, Adobe, Amazon и других зарубежных сервисов, которые не принимают российские карты.' } },
          { '@type': 'Question', name: 'Нужно ли привязывать российскую карту для пополнения?', acceptedAnswer: { '@type': 'Answer', text: 'Нет. Российская карта не требуется. Пополнение доступно через криптовалюту или денежным переводом.' } },
          { '@type': 'Question', name: 'Мои данные в безопасности?', acceptedAnswer: { '@type': 'Answer', text: 'IMBA не хранит логи активности. VPN работает по принципу zero-knowledge — провайдер физически не может знать, что вы делали в сети.' } },
        ],
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { '@context': 'https://schema.org', '@type': 'Product', '@id': 'https://www.imba.live/#plan-start', name: 'IMBA Старт', description: 'Бесплатный тариф: 1 eSIM профиль, базовый VPN (5 серверов), 1 виртуальная карта.', brand: { '@type': 'Brand', name: 'IMBA' }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' } },
        { '@context': 'https://schema.org', '@type': 'Product', '@id': 'https://www.imba.live/#plan-pro', name: 'IMBA Про', description: '5 eSIM профилей, VPN Pro (50+ серверов), 3 виртуальные карты, приоритетная поддержка.', brand: { '@type': 'Brand', name: 'IMBA' }, offers: { '@type': 'Offer', price: '9.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' } },
        { '@context': 'https://schema.org', '@type': 'Product', '@id': 'https://www.imba.live/#plan-business', name: 'IMBA Бизнес', description: 'Безлимит eSIM, VPN безлимит, 10 виртуальных карт, API-доступ.', brand: { '@type': 'Brand', name: 'IMBA' }, offers: { '@type': 'Offer', price: '24.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' } },
      ])}} />

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
