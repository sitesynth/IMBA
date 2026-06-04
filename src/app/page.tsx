import Link from 'next/link'
import { Marquee } from '@/components/Marquee'
import { LottieSticker } from '@/components/LottieSticker'
import { Logo } from '@/components/Logo'
import { AnimatedImbaLogo } from '@/components/AnimatedImbaLogo'
import { RainbowImbaLogo } from '@/components/RainbowImbaLogo'
import { SkyBackground } from '@/components/SkyBackground'

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
      <nav className="flex items-center justify-between px-5 md:px-8 py-4 max-w-7xl mx-auto">
        <Logo size="lg" />
        <div className="hidden md:flex items-center gap-7 text-sm uppercase" style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}>
          <a href="#services" className="hover:opacity-60 transition-opacity">Сервисы</a>
          <a href="#pricing" className="hover:opacity-60 transition-opacity">Тарифы</a>
          <a href="#faq" className="hover:opacity-60 transition-opacity">Вопросы</a>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/auth/login" className="pill pill-paper pill-sm">Войти</Link>
          <Link href="/auth/register" className="pill pill-ink pill-sm">Открыть IMBA</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-5 pt-2 pb-10">
        <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-ink" style={{ minHeight: 'min(78vh, 720px)' }}>
          {/* Blue background */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(130% 100% at 50% 35%, #5AA0FF 0%, #2E7DF6 45%, #1452C9 100%)',
            }}
          />

          {/* Mega wordmark — animated swirl clipped to IMBA letterforms */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ minHeight: 'min(78vh, 720px)' }}>
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

          {/* Lottie stickers — z-20 above logo, original positions */}
          <LottieSticker name="keys"   size={132} className="sticker" style={{ zIndex: 20, top: '9%',   left: '6%',  ['--rot' as string]: '-12deg', animationDelay: '0s' }} />
          <LottieSticker name="plane"  size={116} className="sticker" style={{ zIndex: 20, top: '16%',  right: '8%', ['--rot' as string]: '10deg',  animationDelay: '0.8s' }} />
          <LottieSticker name="cards"  size={128} className="sticker" style={{ zIndex: 20, bottom: '12%', left: '10%', ['--rot' as string]: '8deg',  animationDelay: '1.4s' }} />
          <LottieSticker name="lock"   size={116} className="sticker" style={{ zIndex: 20, bottom: '18%', right: '7%', ['--rot' as string]: '-8deg', animationDelay: '0.4s' }} />
        </div>

        {/* Subhead + CTA below blob */}
        <div className="text-center mt-10 fade-up">
          <h2 className="display text-4xl md:text-6xl mb-5">
            Твой интернет.<br />Без границ.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-ink/70 max-w-xl mx-auto mb-8">
            eSIM для поездок, VPN для свободы и виртуальная карта для оплаты
            зарубежных сервисов. Всё в одном приложении.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/register" className="pill pill-ink text-base">Начать бесплатно →</Link>
            <Link href="#services" className="pill pill-paper text-base">Как это работает</Link>
          </div>
        </div>
      </section>

      {/* Stats marquee */}
      <div className="max-w-7xl w-full mx-auto">
        <Marquee
          bg="var(--yellow)"
          items={['190+ СТРАН', '50+ VPN-СЕРВЕРОВ', '0 ₽ ЗА ОТКРЫТИЕ', 'VISA / MASTERCARD', 'АКТИВАЦИЯ ЗА 1 МИНУТУ']}
        />
      </div>

      {/* Services */}
      <section id="services" className="max-w-7xl w-full mx-auto rounded-xl px-5 md:px-12 py-16" style={{ background: 'var(--paper)' }}>
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
              desc: 'Доступ к Instagram, LinkedIn и YouTube. Протокол WireGuard — быстро и без логов.',
              points: ['WireGuard', '50+ серверов', 'Без логов'],
            },
            {
              lottie: 'cards', tag: 'Карта', bg: 'var(--green-100)',
              title: 'Оплата везде',
              desc: 'Виртуальная Visa/Mastercard для Netflix, Spotify, ChatGPT и других зарубежных сервисов.',
              points: ['Visa / Mastercard', 'USD / EUR / AED', 'Моментальный выпуск'],
            },
          ].map((s) => (
            <div key={s.tag} className="panel flex items-stretch gap-5" style={{ background: s.bg }}>
              <div className="flex-1 flex flex-col">
                <span className="chip bg-paper mb-4 w-fit">{s.tag}</span>
                <h3 className="display text-2xl mb-3">{s.title}</h3>
                <p className="font-medium text-ink/75 mb-4 leading-relaxed text-sm">{s.desc}</p>
                <ul className="space-y-2 font-bold text-sm mt-auto">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-ink" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center">
                <LottieSticker name={s.lottie} size={140} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl w-full mx-auto rounded-xl px-5 md:px-12 py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-5xl md:text-7xl text-center mb-4">Простые тарифы</h2>
        <p className="text-center text-lg font-semibold text-ink/60 mb-14">Плати только за то, что используешь</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Старт', price: 'Бесплатно', bg: 'var(--paper)', feats: ['1 eSIM профиль', 'VPN базовый (5 серверов)', '1 виртуальная карта'], cta: 'Начать' },
            { name: 'Про', price: '$9.99/мес', bg: 'var(--yellow)', hot: true, feats: ['5 eSIM профилей', 'VPN Pro (50+ серверов)', '3 виртуальные карты', 'Приоритетная поддержка'], cta: 'Подключить Про' },
            { name: 'Бизнес', price: '$24.99/мес', bg: 'var(--violet-100)', feats: ['Безлимит eSIM', 'VPN безлимит', '10 виртуальных карт', 'API доступ'], cta: 'Связаться' },
          ].map((p) => (
            <div key={p.name} className="panel relative flex flex-col" style={{ background: p.bg }}>
              {p.hot && (
                <span className="chip bg-ink absolute -top-3.5 left-1/2 -translate-x-1/2" style={{ color: '#fff' }}>
                  🔥 Популярный
                </span>
              )}
              <div className="display text-xl mb-2">{p.name}</div>
              <div className="display text-4xl mb-6">{p.price}</div>
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

      {/* CTA */}
      <section className="max-w-7xl w-full mx-auto rounded-xl text-center py-16 px-6" style={{ background: 'var(--green)' }}>
        <div className="flex justify-center mb-4">
          <LottieSticker name="rocket" size={120} />
        </div>
        <h2 className="display text-4xl md:text-6xl mb-4">Готов начать?</h2>
        <p className="font-semibold text-lg text-ink/70 mb-8">Регистрация за минуту. Без привязки карты.</p>
        <Link href="/auth/register" className="pill pill-ink text-base">Открыть IMBA →</Link>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto rounded-xl" style={{ background: 'var(--paper)' }}>
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
