import Link from 'next/link'
import { FireIcon } from '@/components/FireIcon'
import { Marquee } from '@/components/Marquee'
import { LottieSticker } from '@/components/LottieSticker'
import { AnimatedImbaLogo } from '@/components/AnimatedImbaLogo'
import { RainbowImbaLogo } from '@/components/RainbowImbaLogo'
import { SkyBackground } from '@/components/SkyBackground'
import { FaqAccordion } from '@/components/FaqAccordion'
import { SiteHeader } from '@/components/SiteHeader'
import { Logo } from '@/components/Logo'

export const revalidate = 60

const COUNTRY_NAMES: Record<string, string> = {
  DE: 'ГЕРМАНИЯ', PT: 'ПОРТУГАЛИЯ', US: 'США', NL: 'НИДЕРЛАНДЫ', FR: 'ФРАНЦИЯ',
  GB: 'ВЕЛИКОБРИТАНИЯ', FI: 'ФИНЛЯНДИЯ', PL: 'ПОЛЬША', TR: 'ТУРЦИЯ', JP: 'ЯПОНИЯ',
  SG: 'СИНГАПУР', AE: 'ОАЭ',
}

type VpnServer = { id: string; city: string; country: string; flag: string; ping?: number }

const FALLBACK_SERVERS: VpnServer[] = [
  { id: 'nl1', city: 'Амстердам', country: 'NL', flag: '🇳🇱' },
  { id: 'de1', city: 'Франкфурт', country: 'DE', flag: '🇩🇪' },
  { id: 'us1', city: 'Нью-Йорк', country: 'US', flag: '🇺🇸' },
  { id: 'fi1', city: 'Хельсинки', country: 'FI', flag: '🇫🇮' },
  { id: 'gb1', city: 'Лондон', country: 'GB', flag: '🇬🇧' },
  { id: 'tr1', city: 'Стамбул', country: 'TR', flag: '🇹🇷' },
  { id: 'jp1', city: 'Токио', country: 'JP', flag: '🇯🇵' },
]

async function fetchVpnServers(): Promise<VpnServer[]> {
  try {
    const res = await fetch(`${process.env.IMBA_API_URL}/v1/me/vpn/servers`, { next: { revalidate: 60 } })
    if (!res.ok) return FALLBACK_SERVERS
    const data = await res.json()
    return data.length > 0 ? data : FALLBACK_SERVERS
  } catch {
    return FALLBACK_SERVERS
  }
}

export default async function LandingPage() {
  const vpnServers = await fetchVpnServers()
  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      {/* Top ticker — full width, no rounding */}
      <Marquee
        bg="var(--violet-100)"
        items={['РАБОТАЕТ В РОССИИ', 'VLESS REALITY', '7 ДНЕЙ БЕСПЛАТНО', '50+ СЕРВЕРОВ', 'eSIM В 190 СТРАНАХ', 'ВИРТУАЛЬНАЯ КАРТА']}
      />

      {/* Nav + Hero combined white block */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
      <SiteHeader />

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
            <div
              role="img"
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
            </div>
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
          <h1 className="display text-4xl md:text-6xl mb-3">
            VPN, который работает<br />в России
          </h1>
          <p className="display text-xl md:text-2xl text-ink/50 mb-5">Твой интернет. Без границ.</p>
          <p className="text-lg md:text-xl font-semibold text-ink/70 max-w-2xl mx-auto mb-8">
            Купить впн сегодня — значит купить протокол, который не отвалится завтра. IMBA работает на VLESS Reality: для оператора твой трафик неотличим от обычного HTTPS. 7 дней бесплатно за подписку на соцсети, карта не нужна. А ещё eSIM для поездок и виртуальная карта для зарубежных подписок — в одном кабинете.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">IMBAНУТЬСЯ →</Link>
            <Link href="#why" className="pill pill-paper text-base">Как это работает</Link>
          </div>
        </div>
      </section>
      </div>{/* end Nav+Hero white block */}

      {/* Stats marquee */}
      <Marquee
        bg="var(--yellow)"
        items={['190+ СТРАН', '50+ VPN-СЕРВЕРОВ', '0 ₽ ЗА ОТКРЫТИЕ', 'VISA / MASTERCARD', 'АКТИВАЦИЯ ЗА 1 МИНУТУ']}
      />

      {/* Why VLESS Reality works */}
      <section id="why" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-6">Почему IMBA стабилен,<br className="hidden md:block" /> когда другие отваливаются</h2>
          <p className="text-base md:text-lg font-medium text-ink/75 leading-relaxed mb-4 max-w-3xl">
            Большинство VPN-сервисов работают на OpenVPN и WireGuard. Системы анализа трафика (DPI)
            узнают эти протоколы по сигнатурам за секунды — поэтому «обычный» VPN живёт неделю,
            а потом просто перестаёт подключаться.
          </p>
          <p className="text-base md:text-lg font-medium text-ink/75 leading-relaxed mb-6 max-w-3xl">
            IMBA использует <strong>VLESS с XTLS Reality</strong>. Этот протокол маскирует соединение
            под обычный HTTPS-запрос к легитимному сайту: со стороны оператора ты просто открываешь
            очередную страницу. Никаких VPN-сигнатур — нечего распознавать и нечего ограничивать.
          </p>
          <ul className="space-y-2.5 font-semibold text-sm md:text-base mb-8">
            {[
              ['VLESS Reality', ' — основной протокол: стабилен на МТС, Мегафоне, Билайне, Tele2 и домашнем интернете'],
              ['WireGuard', ' — запасной вариант для сетей, где он ещё работает'],
              ['50+ серверов в 30+ странах', ' — Берлин, Лиссабон, Нью-Йорк и другие локации с пингом от 77 мс'],
              ['Zero-knowledge', ' — мы не храним логи и физически не видим, что ты делаешь в сети'],
            ].map(([b, rest]) => (
              <li key={b} className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-ink mt-2 shrink-0" />
                <span><strong>{b}</strong>{rest}</span>
              </li>
            ))}
          </ul>

          <h3 className="display text-xl md:text-2xl mb-4">Сравнение VPN-протоколов для России, 2026</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-ink" style={{ color: 'var(--paper)' }}>
                  {['Протокол', 'Виден для DPI', 'Скорость', 'Статус в РФ, 2026'].map((h) => (
                    <th key={h} className="px-3 py-2 border border-ink/20 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['VLESS + XTLS Reality', 'Нет — трафик как HTTPS', 'Высокая', 'Работает стабильно', '#0E7A46'],
                  ['Shadowsocks', 'Частично', 'Высокая', 'Работает с перебоями', '#A16207'],
                  ['WireGuard', 'Да — по сигнатуре', 'Высокая', 'Ограничен у большинства операторов', '#B42318'],
                  ['OpenVPN', 'Да — по хэндшейку', 'Средняя', 'Не работает', '#B42318'],
                  ['PPTP / L2TP', 'Да', 'Низкая', 'Не работает', '#B42318'],
                ].map(([proto, dpi, speed, status, color], ri) => (
                  <tr key={proto} className={ri % 2 === 1 ? 'bg-ink/5' : ''}>
                    <td className="px-3 py-2 border border-ink/20 font-black whitespace-nowrap">{proto}</td>
                    <td className="px-3 py-2 border border-ink/20 font-semibold">{dpi}</td>
                    <td className="px-3 py-2 border border-ink/20 font-semibold">{speed}</td>
                    <td className="px-3 py-2 border border-ink/20 font-black whitespace-nowrap" style={{ color }}>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Servers */}
      <section id="servers" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--violet-100)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-4">Серверы IMBA: безлимитный трафик, локации по всему миру</h2>
          <p className="text-base md:text-lg font-medium text-ink/75 leading-relaxed mb-8 max-w-3xl">
            Ваш аккаунт работает на всех серверах: Берлин для стриминга, Нью-Йорк для нейронок. Отдельные серверы для торрентов. Переключение — в один тап, лимитов на смену локаций и ограничение трафика нет. Скорость портов серверов 10 Gbps.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vpnServers.map((srv) => (
              <div key={srv.id} className="panel flex flex-col gap-1.5 p-4 md:p-5" style={{ background: 'var(--paper)' }}>
                <div className="font-black text-base md:text-lg">{srv.flag} {srv.city}</div>
                <div className="text-[11px] font-bold tracking-widest text-ink/40">{srv.country} · {COUNTRY_NAMES[srv.country] ?? srv.country}</div>
                <span className="chip mt-2 w-fit text-xs" style={{ background: 'var(--violet-100)', borderColor: 'var(--ink)' }}>
                  {srv.ping ? `⚡ ~${srv.ping} мс` : 'VLESS Reality'}
                </span>
              </div>
            ))}
            <div className="panel flex flex-col gap-2 p-4 md:p-5 col-span-2 md:col-span-1" style={{ background: 'var(--paper)' }}>
              <div className="font-black text-base md:text-lg">+ другие</div>
              <div className="text-[11px] font-bold tracking-widest text-ink/40">ЕВРОПА · АЗИЯ · АМЕРИКА</div>
              <Link href="/auth/register" className="pill pill-ink pill-sm mt-1 w-fit text-xs">
                Список в кабинете →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free VPN */}
      <section id="free-vpn" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--yellow)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-4">Бесплатный VPN на 7 дней</h2>
          <p className="text-base md:text-lg font-medium text-ink/75 leading-relaxed mb-8 max-w-3xl">
            «Бесплатный VPN» из сторов обычно означает рекламу, перегруженные серверы и продажу твоих
            данных — так он и окупается. У IMBA другая сделка, честная: подпишись на наши соцсети —
            получи неделю полного доступа. Тот же VLESS Reality, те же серверы, что и на платных тарифах.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl">
            <a href="https://vk.com/club239876488" target="_blank" rel="noopener" className="panel p-5 hover:-translate-y-1 transition-transform duration-200" style={{ background: 'var(--paper)' }}>
              <h3 className="display text-lg mb-1">ВКонтакте →</h3>
              <p className="text-sm font-medium text-ink/70">Вступи в сообщество IMBA</p>
            </a>
            <a href="https://telegram.dog/imba_live" target="_blank" rel="noopener" className="panel p-5 hover:-translate-y-1 transition-transform duration-200" style={{ background: 'var(--paper)' }}>
              <h3 className="display text-lg mb-1">Telegram →</h3>
              <p className="text-sm font-medium text-ink/70">Подпишись на канал IMBA</p>
            </a>
          </div>
          <p className="text-sm md:text-base font-medium text-ink/75 mb-6 max-w-3xl">
            Как активировать: зарегистрируйся → подпишись на ВКонтакте или Telegram → в кабинете активируй
            <strong> IMBA Старт</strong> — VPN и eSIM 500 МБ на 7 дней. Есть промокод? Он тоже применяется в кабинете.
          </p>
          <Link href="/auth/register" className="pill pill-ink text-base">Получить 7 дней бесплатно →</Link>
        </div>
      </section>

      {/* What you get */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-8">Что ты получаешь с IMBA VPN</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                t: 'Доступ к YouTube и привычным сервисам',
                d: <>YouTube в 4K без замедлений, LinkedIn, зарубежные сайты и стриминги. Всё открывается сразу и работает стабильно — без танцев с настройками.</>,
                bg: 'var(--blue-100)',
              },
              {
                t: 'Скорость без просадок',
                d: <>XTLS почти не тратит ресурсы на шифрование: видеозвонок не рассыпается, игра не лагает. Серверы выбраны по маршрутам с минимальным пингом из России.</>,
                bg: 'var(--green-100)',
              },
              {
                t: 'Приватность: никаких логов',
                d: <>Надёжный VPN не должен знать о тебе ничего. Мы не записываем историю, IP и время подключений. Оплата криптой — аккаунт не привязан к личности. Юрисдикция — вне РФ.</>,
                bg: 'var(--violet-100)',
              },
              {
                t: 'Работает на всех устройствах',
                d: <>iPhone и iPad, Android, Windows, macOS, Smart TV. Настройка за 2 минуты по гайдам: <Link href="/blog/vpn-na-kompyutere" className="font-bold underline">VPN на компьютере</Link> и <Link href="/blog/happ-setup" className="font-bold underline">настройка Happ</Link>.</>,
                bg: 'var(--cream)',
              },
            ].map((c) => (
              <div key={c.t} className="panel p-5 md:p-7" style={{ background: c.bg }}>
                <h3 className="display text-lg md:text-xl mb-2">{c.t}</h3>
                <p className="text-sm md:text-base font-medium text-ink/75 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 steps */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-8">Как подключить VPN — 3 шага</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: '01', t: '7 дней бесплатно',
                d: <>Нужен только email. Подпишись на ВКонтакте или Telegram IMBA — и активируй Старт: VPN и eSIM 500 МБ на 7 дней. Карта не требуется.</>,
              },
              {
                n: '02', t: 'Установи Happ',
                d: <>Приложение для Android, iOS, Windows, macOS и Linux. В RU App Store и Google Play его нет — качай APK или с зеркала по ссылкам из кабинета. <Link href="/blog/happ-setup" className="font-bold underline">Полная инструкция</Link>.</>,
              },
              {
                n: '03', t: 'Активируй подписку',
                d: <>Вставь ссылку подписки из кабинета, отключи Mux в настройках сервера, нажми «Подключить». Всё.</>,
              },
            ].map((s) => (
              <div key={s.n} className="panel p-5 md:p-7" style={{ background: 'var(--paper)' }}>
                <span className="chip bg-ink mb-3 w-fit" style={{ color: '#fff' }}>{s.n}</span>
                <h3 className="display text-lg mb-2">{s.t}</h3>
                <p className="text-sm font-medium text-ink/75 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="rounded-xl px-5 md:px-12 py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-4xl md:text-7xl text-center mb-4">Три сервиса.<br />Один кабинет.</h2>
        <p className="text-center text-lg font-semibold text-ink/60 mb-14">Управляй всем из одного места</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              lottie: 'plane', tag: 'eSIM', bg: 'var(--violet-100)', href: '/esim',
              title: 'Мобильный интернет',
              desc: 'Купи eSIM для любой страны. Активация по QR за минуту, без поиска местной симки.',
              points: ['190+ стран', 'Активация по QR', 'Тарифы от 3 ГБ'],
            },
            {
              lottie: 'lock', tag: 'VPN', bg: 'var(--blue-100)', href: '#pricing',
              title: 'Свобода и защита',
              desc: 'Доступ к Instagram*, LinkedIn и YouTube. VLESS Reality и WireGuard — быстро, без логов, работает в России.',
              points: ['VLESS Reality / WireGuard', '50+ серверов', 'Без логов'],
            },
            {
              lottie: 'cards', tag: 'Карта', bg: 'var(--green-100)', href: '/virtual-card',
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
                <ul className="space-y-1.5 md:space-y-2 font-bold text-xs md:text-sm">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-ink" /> {p}
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="pill pill-paper pill-sm text-xs w-fit mt-4">Подробнее →</Link>
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
            { name: 'Старт', price: 'Бесплатно', bg: 'var(--paper)', feats: ['1 eSIM профиль', 'VPN по отдельной подписке', '1 виртуальная карта'], cta: 'Начать' },
            { name: 'IMBA COMBO', price: '$9.99/мес', bg: 'var(--yellow)', hot: true, feats: ['VPN Pro включён (50+ серверов)', '3 eSIM профиля', '3 виртуальные карты', 'Всё с первого дня'], cta: 'Подключить COMBO' },
            { name: 'Бизнес', price: '$24.99/мес', bg: 'var(--violet-100)', feats: ['VPN безлимит включён', 'Безлимит eSIM', '10 виртуальных карт', 'API доступ'], cta: 'Связаться' },
          ].map((p) => (
            <div key={p.name} className={`panel relative flex flex-col p-5 md:p-7${p.hot ? ' mt-4 md:mt-0' : ''}`} style={{ background: p.bg }}>
              {p.hot && (
                <span className="chip bg-ink absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1" style={{ color: '#fff' }}>
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
        <p className="text-center text-sm md:text-base font-medium text-ink/60 mt-8 max-w-3xl mx-auto">
          Начни бесплатно: после регистрации подпишись на ВКонтакте или Telegram IMBA — и активируй Старт
          с VPN и eSIM 500 МБ на 7 дней. Без вложений и привязки карты. Апгрейд в любой момент.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="rounded-xl px-4 md:px-12 py-10 md:py-16" style={{ background: 'var(--blue-100)' }}>
        <h2 className="display text-3xl md:text-7xl text-center mb-2">Частые вопросы о VPN</h2>
        <p className="text-center font-semibold text-ink/60 mb-8 md:mb-12 text-sm md:text-lg">Ответы на всё что тебя беспокоит</p>

        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={[
            { q: 'Работает ли IMBA VPN в России?', a: 'Да. Основной протокол — VLESS Reality, его трафик неотличим от обычного HTTPS. Работает на МТС, Мегафоне, Билайне, Tele2 и домашнем интернете — в Москве, Питере и регионах. 50+ серверов в 30+ странах.', color: 'var(--violet-100)' },
            { q: 'Есть ли бесплатный VPN у IMBA?', a: 'Да: после регистрации подпишись на ВКонтакте или Telegram IMBA — и получи тариф Старт бесплатно на 7 дней: VPN на том же VLESS Reality плюс eSIM 500 МБ. Без рекламы, продажи данных и перегруженных серверов.', color: 'var(--blue-100)' },
            { q: 'VPN замедлит интернет?', a: 'Незначительно. XTLS Reality почти не добавляет накладных расходов: YouTube в 4K, звонки и игры работают как без VPN.', color: 'var(--green-100)' },
            { q: 'На каких устройствах работает?', a: 'iPhone, iPad, Android, Windows, macOS, Linux, Android TV. Одна подписка — несколько устройств одновременно.', color: 'var(--paper)' },
            { q: 'Вы храните логи?', a: 'Нет. Ни историю, ни IP, ни время подключений. Архитектура zero-knowledge: данных, которые можно было бы выдать, у нас просто нет.', color: 'var(--violet-100)' },
            { q: 'Как оплатить без зарубежной карты?', a: 'Криптовалютой (USDT, BTC) или переводом. А внутри IMBA можно выпустить виртуальную карту Visa/Mastercard — и оплачивать ей любые зарубежные сервисы.', color: 'var(--blue-100)' },
            { q: 'Какой протокол VPN не определяется в России?', a: 'VLESS с XTLS Reality. Он маскирует соединение под обычный HTTPS-запрос к легитимному сайту, поэтому системы DPI не находят VPN-сигнатур. OpenVPN и WireGuard определяются по характерным признакам трафика и работают нестабильно.', color: 'var(--green-100)' },
            { q: 'Законно ли пользоваться VPN в России?', a: 'Использование VPN в России не запрещено — штрафов для пользователей нет. Ограничения касаются владельцев сервисов и рекламы VPN, а не тех, кто им пользуется.', color: 'var(--paper)' },
            { q: 'Что ещё входит в подписку?', a: 'eSIM для 190+ стран — интернет в поездках без роуминга, и виртуальная карта в USD/EUR/AED для Netflix, Spotify, ChatGPT. Три сервиса, один кабинет.', color: 'var(--violet-100)' },
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
          { '@type': 'Question', name: 'Работает ли IMBA VPN в России?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Основной протокол — VLESS Reality, его трафик неотличим от обычного HTTPS. Работает на МТС, Мегафоне, Билайне, Tele2 и домашнем интернете — в Москве, Питере и регионах.' } },
          { '@type': 'Question', name: 'Есть ли бесплатный VPN у IMBA?', acceptedAnswer: { '@type': 'Answer', text: 'Да: после регистрации подпишитесь на ВКонтакте или Telegram IMBA — и получите тариф Старт бесплатно на 7 дней: VPN на VLESS Reality плюс eSIM 500 МБ. Без рекламы и продажи данных.' } },
          { '@type': 'Question', name: 'VPN замедлит интернет?', acceptedAnswer: { '@type': 'Answer', text: 'Незначительно. XTLS Reality почти не добавляет накладных расходов: YouTube в 4K, звонки и игры работают как без VPN.' } },
          { '@type': 'Question', name: 'На каких устройствах работает IMBA VPN?', acceptedAnswer: { '@type': 'Answer', text: 'iPhone, iPad, Android, Windows, macOS, Linux, Android TV. Одна подписка — несколько устройств одновременно.' } },
          { '@type': 'Question', name: 'Вы храните логи?', acceptedAnswer: { '@type': 'Answer', text: 'Нет. Ни историю, ни IP-адреса, ни время подключений. Архитектура zero-knowledge: данных, которые можно было бы выдать, просто нет.' } },
          { '@type': 'Question', name: 'Как оплатить VPN без зарубежной карты?', acceptedAnswer: { '@type': 'Answer', text: 'Криптовалютой (USDT, BTC) или банковским переводом. Внутри IMBA можно выпустить виртуальную карту Visa/Mastercard для оплаты зарубежных сервисов.' } },
          { '@type': 'Question', name: 'Какой протокол VPN не определяется в России?', acceptedAnswer: { '@type': 'Answer', text: 'VLESS с XTLS Reality — он маскирует соединение под обычный HTTPS-запрос, поэтому системы DPI не находят VPN-сигнатур. OpenVPN и WireGuard определяются по признакам трафика и работают нестабильно.' } },
          { '@type': 'Question', name: 'Законно ли пользоваться VPN в России?', acceptedAnswer: { '@type': 'Answer', text: 'Использование VPN в России не запрещено — штрафов для пользователей нет. Ограничения касаются владельцев сервисов и рекламы VPN, а не тех, кто им пользуется.' } },
          { '@type': 'Question', name: 'Что ещё входит в подписку?', acceptedAnswer: { '@type': 'Answer', text: 'eSIM для 190+ стран — интернет в поездках без роуминга, и виртуальная карта в USD/EUR/AED для Netflix, Spotify, ChatGPT. Три сервиса, один кабинет.' } },
        ],
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', '@id': 'https://www.imba.live/#plan-start', name: 'IMBA Старт', description: 'Бесплатный тариф: 1 eSIM профиль, базовый VPN (5 серверов), 1 виртуальная карта.', brand: { '@type': 'Brand', name: 'IMBA' }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', '@id': 'https://www.imba.live/#plan-pro', name: 'IMBA Про', description: '5 eSIM профилей, VPN Pro (50+ серверов), 3 виртуальные карты, приоритетная поддержка.', brand: { '@type': 'Brand', name: 'IMBA' }, offers: { '@type': 'Offer', price: '9.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', '@id': 'https://www.imba.live/#plan-business', name: 'IMBA Бизнес', description: 'Безлимит eSIM, VPN безлимит, 10 виртуальных карт, API-доступ.', brand: { '@type': 'Brand', name: 'IMBA' }, offers: { '@type': 'Offer', price: '24.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'IMBA VPN',
        applicationCategory: 'VPNApplication',
        operatingSystem: 'iOS, Android, Windows, macOS, Linux, Android TV',
        description: 'VPN-клиент на протоколе VLESS Reality — стабильная работа в России на МТС, Мегафоне, Билайне, Tele2. Без логов.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register', description: '7 дней бесплатно' },
        publisher: { '@type': 'Organization', '@id': 'https://www.imba.live/#organization' },
      })}} />

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
          <p className="text-[10px] text-ink/30 text-center leading-relaxed mt-2">
            *Meta Platforms Inc. признана экстремистской организацией, её деятельность запрещена на территории РФ.
          </p>
        </div>
      </footer>
    </div>
  )
}
