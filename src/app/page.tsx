import Link from 'next/link'
import { LandingPricingGrid } from '@/components/LandingPricingGrid'
import { FireIcon } from '@/components/FireIcon'
import { Marquee } from '@/components/Marquee'
import { LottieSticker } from '@/components/LottieSticker'
import { AnimatedImbaLogo } from '@/components/AnimatedImbaLogo'
import { RainbowImbaLogo } from '@/components/RainbowImbaLogo'
import { FaqAccordion } from '@/components/FaqAccordion'
import { SiteHeader } from '@/components/SiteHeader'
import { Logo } from '@/components/Logo'
import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'IMBA — VPN, eSIM & Virtual Card. Internet Without Borders.',
  description: 'VPN, eSIM, and virtual Visa/Mastercard in one subscription. VLESS Reality protocol works in China, UAE, Turkey, and anywhere else that blocks it. 50+ servers, zero logs. Try 7 days free.',
  alternates: { canonical: SITE_URL },
}

const vpnServers = [
  { id: 'de1', flag: '🇩🇪', city: 'Frankfurt',  country: 'DE', ping: 42  },
  { id: 'nl1', flag: '🇳🇱', city: 'Amsterdam',  country: 'NL', ping: 48  },
  { id: 'gb1', flag: '🇬🇧', city: 'London',     country: 'GB', ping: 55  },
  { id: 'us1', flag: '🇺🇸', city: 'New York',   country: 'US', ping: 110 },
  { id: 'fi1', flag: '🇫🇮', city: 'Helsinki',   country: 'FI', ping: 60  },
  { id: 'pt1', flag: '🇵🇹', city: 'Lisbon',     country: 'PT', ping: 77  },
  { id: 'tr1', flag: '🇹🇷', city: 'Istanbul',   country: 'TR', ping: 68  },
  { id: 'jp1', flag: '🇯🇵', city: 'Tokyo',      country: 'JP', ping: 190 },
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-3 p-3 md:gap-4 md:p-4 min-h-screen">

      <Marquee
        bg="var(--ink)"
        textColor="var(--paper)"
        items={['WORKS WORLDWIDE', 'VLESS REALITY', '7 DAYS FREE', '50+ SERVERS', 'eSIM IN 190 COUNTRIES', 'VIRTUAL CARD']}
      />

      {/* Nav + Hero */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
        <SiteHeader />

        <section className="relative px-4 md:px-5 pt-2 pb-10">
          <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-ink" style={{ minHeight: 'min(55vh, 720px)' }}>
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(130% 100% at 50% 35%, #5AA0FF 0%, #2E7DF6 45%, #1452C9 100%)' }}
            />
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
            <LottieSticker name="keys"  size={88}  className="sticker md:hidden" style={{ zIndex: 20, top: '6%',    left: '4%',  ['--rot' as string]: '-12deg', animationDelay: '0s' }} />
            <LottieSticker name="plane" size={76}  className="sticker md:hidden" style={{ zIndex: 20, top: '6%',    right: '4%', ['--rot' as string]: '10deg',  animationDelay: '0.8s' }} />
            <LottieSticker name="cards" size={88}  className="sticker md:hidden" style={{ zIndex: 20, bottom: '6%', left: '4%',  ['--rot' as string]: '8deg',   animationDelay: '1.4s' }} />
            <LottieSticker name="lock"  size={76}  className="sticker md:hidden" style={{ zIndex: 20, bottom: '6%', right: '4%', ['--rot' as string]: '-8deg',  animationDelay: '0.4s' }} />
            <LottieSticker name="keys"  size={180} className="sticker hidden md:block" style={{ zIndex: 20, top: '8%',    left: '3%',  ['--rot' as string]: '-12deg', animationDelay: '0s' }} />
            <LottieSticker name="plane" size={160} className="sticker hidden md:block" style={{ zIndex: 20, top: '12%',   right: '3%', ['--rot' as string]: '10deg',  animationDelay: '0.8s' }} />
            <LottieSticker name="cards" size={176} className="sticker hidden md:block" style={{ zIndex: 20, bottom: '8%', left: '4%',  ['--rot' as string]: '8deg',   animationDelay: '1.4s' }} />
            <LottieSticker name="lock"  size={160} className="sticker hidden md:block" style={{ zIndex: 20, bottom: '12%', right: '3%', ['--rot' as string]: '-8deg', animationDelay: '0.4s' }} />
          </div>

          <div className="text-center mt-10 fade-up">
            <h1 className="display text-4xl md:text-6xl mb-3">
              Internet Without Borders
            </h1>
            <p className="display text-xl md:text-2xl text-ink/50 mb-5">Your internet. Anywhere.</p>
            <p className="text-lg md:text-xl font-semibold text-ink/70 max-w-2xl mx-auto mb-8">
              IMBA runs on VLESS Reality — to your ISP, it looks like regular HTTPS traffic. Works in China, UAE, Turkey, and any other country that tries to block it. 7 days free, no card needed. Plus eSIM for travel and a virtual card for global payments — all in one dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">Get Started →</Link>
              <Link href="#why" className="pill pill-paper text-base">How it works</Link>
            </div>
          </div>
        </section>
      </div>

      {/* Stats marquee */}
      <Marquee
        bg="var(--yellow)"
        items={['190+ COUNTRIES', '50+ VPN SERVERS', 'FREE VIRTUAL CARD', 'VISA / MASTERCARD', 'INSTANT ACTIVATION']}
      />

      {/* Why VLESS Reality works */}
      <section id="why" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-6">Why IMBA works<br className="hidden md:block" /> when others don't</h2>
          <p className="text-base md:text-lg font-medium text-ink/75 leading-relaxed mb-4 max-w-3xl">
            Most VPN services use OpenVPN or WireGuard. Deep packet inspection (DPI) systems deployed by ISPs in China, UAE, Turkey, and other countries identify these protocols by their traffic signatures within seconds — that's why a "normal" VPN stops connecting after a week.
          </p>
          <p className="text-base md:text-lg font-medium text-ink/75 leading-relaxed mb-6 max-w-3xl">
            IMBA uses <strong>VLESS with XTLS Reality</strong>. This protocol disguises your connection as a regular HTTPS request to a legitimate website. From your ISP's perspective, you're just browsing normally. No VPN signatures — nothing to detect, nothing to block.
          </p>
          <ul className="space-y-2.5 font-semibold text-sm md:text-base mb-8">
            {[
              ['VLESS Reality', ' — primary protocol: stable on any ISP, in any country with internet censorship'],
              ['WireGuard', ' — fallback option for networks where it still works'],
              ['50+ servers in 30+ countries', ' — Berlin, Lisbon, New York and more, with latency from 42 ms'],
              ['Zero-knowledge', ' — we store no logs and have no technical ability to see your traffic'],
            ].map(([b, rest]) => (
              <li key={b} className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-ink mt-2 shrink-0" />
                <span><strong>{b}</strong>{rest}</span>
              </li>
            ))}
          </ul>

          <h3 className="display text-xl md:text-2xl mb-4">VPN protocol comparison, 2026</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-ink" style={{ color: 'var(--paper)' }}>
                  {['Protocol', 'Visible to DPI', 'Speed', 'Status in censored networks'].map((h) => (
                    <th key={h} className="px-3 py-2 border border-ink/20 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['VLESS + XTLS Reality', 'No — traffic looks like HTTPS', 'High', 'Works reliably', '#0E7A46'],
                  ['Shadowsocks',          'Partial',                         'High', 'Works with interruptions', '#A16207'],
                  ['WireGuard',            'Yes — by signature',              'High', 'Blocked in most restricted networks', '#B42318'],
                  ['OpenVPN',              'Yes — by handshake',              'Medium', 'Blocked',                  '#B42318'],
                  ['PPTP / L2TP',          'Yes',                             'Low',  'Blocked',                  '#B42318'],
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
          <h2 className="display text-3xl md:text-5xl mb-4">50+ servers. Unlimited traffic.</h2>
          <p className="text-base md:text-lg font-medium text-ink/75 leading-relaxed mb-8 max-w-3xl">
            Your account works across all servers: Frankfurt for streaming, New York for AI tools. Dedicated servers for torrents. Switch in one tap — no location limits, no data caps. Server ports run at 10 Gbps.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vpnServers.map((srv) => (
              <div key={srv.id} className="panel flex flex-col gap-1.5 p-4 md:p-5" style={{ background: 'var(--paper)' }}>
                <div className="font-black text-base md:text-lg">{srv.flag} {srv.city}</div>
                <div className="text-[11px] font-bold tracking-widest text-ink/40">{srv.country}</div>
                <span className="chip mt-2 w-fit text-xs" style={{ background: 'var(--violet-100)', borderColor: 'var(--ink)' }}>
                  {srv.ping ? `⚡ ~${srv.ping} ms` : 'VLESS Reality'}
                </span>
              </div>
            ))}
            <div className="panel flex flex-col gap-2 p-4 md:p-5 col-span-2 md:col-span-1" style={{ background: 'var(--paper)' }}>
              <div className="font-black text-base md:text-lg">+ more</div>
              <div className="text-[11px] font-bold tracking-widest text-ink/40">EUROPE · ASIA · AMERICAS</div>
              <Link href="/auth/register" className="pill pill-ink pill-sm mt-1 w-fit text-xs">
                Full list in dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free trial */}
      <section id="free-vpn" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--yellow)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-4">7 days free — no card needed</h2>
          <p className="text-base md:text-lg font-medium text-ink/75 leading-relaxed mb-8 max-w-3xl">
            Free VPNs from app stores usually mean ads, overcrowded servers, and your data being sold — that's how they cover costs. IMBA's deal is different: follow our Telegram channel and get a full week of access. Same VLESS Reality, same servers as paid plans.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl">
            <a href="https://t.me/imba_live" target="_blank" rel="noopener" className="panel p-5 hover:-translate-y-1 transition-transform duration-200" style={{ background: 'var(--paper)' }}>
              <h3 className="display text-lg mb-1">Telegram →</h3>
              <p className="text-sm font-medium text-ink/70">Follow the IMBA channel</p>
            </a>
            <Link href="/auth/register" className="panel p-5 hover:-translate-y-1 transition-transform duration-200 flex flex-col justify-center" style={{ background: 'var(--paper)' }}>
              <h3 className="display text-lg mb-1">Sign up →</h3>
              <p className="text-sm font-medium text-ink/70">Email only, activate free plan</p>
            </Link>
          </div>
          <p className="text-sm md:text-base font-medium text-ink/75 mb-6 max-w-3xl">
            How to activate: register → follow IMBA on Telegram → activate <strong>IMBA Start</strong> in your dashboard — VPN + 500 MB eSIM for 7 days. Got a promo code? Apply it in the dashboard too.
          </p>
          <Link href="/auth/register" className="pill pill-ink text-base">Get 7 Days Free →</Link>
        </div>
      </section>

      <LandingPricingGrid />

      {/* What you get */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-3xl md:text-5xl mb-8">What you get with IMBA VPN</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                t: 'Access YouTube, Netflix, and any blocked service',
                d: <>YouTube in 4K without throttling, LinkedIn, streaming platforms, social media. Everything loads instantly and stays stable — no configuration headaches.</>,
                bg: 'var(--blue-100)',
              },
              {
                t: 'Speed without drop-offs',
                d: <>XTLS uses almost no extra overhead for encryption: video calls stay crisp, games don't lag. Servers are picked for the lowest-latency routes from major locations.</>,
                bg: 'var(--green-100)',
              },
              {
                t: 'Privacy: zero logs',
                d: <>A real VPN shouldn't know anything about you. We don't record browsing history, IPs, or connection times. Pay with crypto — your account stays anonymous. Jurisdiction outside restricted territories.</>,
                bg: 'var(--violet-100)',
              },
              {
                t: 'Works on every device',
                d: <>iPhone, iPad, Android, Windows, macOS, Smart TV. Setup takes 2 minutes with our guides: <Link href="/blog/vpn-na-kompyutere" className="font-bold underline">VPN on desktop</Link> and <Link href="/blog/happ-setup" className="font-bold underline">Happ setup guide</Link>.</>,
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
          <h2 className="display text-3xl md:text-5xl mb-8">Connect in 3 steps</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: '01', t: '7 days free',
                d: <>Email only. Follow IMBA on Telegram and activate Start: VPN + 500 MB eSIM for 7 days. No card required.</>,
              },
              {
                n: '02', t: 'Install Happ',
                d: <>Available for Android, iOS, Windows, macOS, and Linux. Download the APK or use the mirror links from your dashboard. <Link href="/blog/happ-setup" className="font-bold underline">Full setup guide</Link>.</>,
              },
              {
                n: '03', t: 'Activate your subscription',
                d: <>Paste the subscription link from your dashboard, disable Mux in server settings, tap Connect. Done.</>,
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
        <h2 className="display text-4xl md:text-7xl text-center mb-4">Three services.<br />One dashboard.</h2>
        <p className="text-center text-lg font-semibold text-ink/60 mb-14">Manage everything from one place</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              lottie: 'plane', tag: 'eSIM', bg: 'var(--violet-100)', href: '/esim',
              title: 'Mobile data, anywhere',
              desc: 'Buy an eSIM for any country. Activate via QR in minutes — no hunting for a local SIM card.',
              points: ['190+ countries', 'QR activation', 'Plans from 3 GB'],
            },
            {
              lottie: 'lock', tag: 'VPN', bg: 'var(--blue-100)', href: '#pricing',
              title: 'Freedom & privacy',
              desc: 'Access Instagram, LinkedIn, YouTube, and anything else blocked in your country. VLESS Reality and WireGuard — fast, no logs.',
              points: ['VLESS Reality / WireGuard', '50+ servers', 'Zero logs'],
            },
            {
              lottie: 'cards', tag: 'Card', bg: 'var(--green-100)', href: '/virtual-card',
              title: 'Pay anywhere',
              desc: 'Virtual Visa/Mastercard for Netflix, Spotify, ChatGPT, and any other global service. Instant issuance.',
              points: ['Visa / Mastercard', 'USD / EUR / AED', 'Instant issuance'],
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
                <Link href={s.href} className="pill pill-paper pill-sm text-xs w-fit mt-4">Learn more →</Link>
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
        <h2 className="display text-3xl md:text-7xl text-center mb-3 md:mb-4">Simple pricing</h2>
        <p className="text-center text-sm md:text-lg font-semibold text-ink/60 mb-8 md:mb-14">Pay only for what you use</p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Start', price: 'Free', bg: 'var(--paper)', feats: ['1 eSIM profile', 'VPN as separate add-on', '1 virtual card'], cta: 'Get started' },
            { name: 'IMBA COMBO', price: '$9.99/mo', bg: 'var(--yellow)', hot: true, feats: ['VPN Pro included (50+ servers)', '3 eSIM profiles', '3 virtual cards', 'Everything from day one'], cta: 'Get COMBO' },
            { name: 'Business', price: '$24.99/mo', bg: 'var(--violet-100)', feats: ['Unlimited VPN included', 'Unlimited eSIM', '10 virtual cards', 'API access'], cta: 'Contact us' },
          ].map((p) => (
            <div key={p.name} className={`panel relative flex flex-col p-5 md:p-7${p.hot ? ' mt-4 md:mt-0' : ''}`} style={{ background: p.bg }}>
              {p.hot && (
                <span className="chip bg-ink absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1" style={{ color: '#fff' }}>
                  <FireIcon size={28} /> Most popular
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
          Start free: after signing up, follow IMBA on Telegram and activate the Start plan — VPN + 500 MB eSIM for 7 days. No payment, no card required. Upgrade anytime.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="rounded-xl px-4 md:px-12 py-10 md:py-16" style={{ background: 'var(--blue-100)' }}>
        <h2 className="display text-3xl md:text-7xl text-center mb-2">FAQ</h2>
        <p className="text-center font-semibold text-ink/60 mb-8 md:mb-12 text-sm md:text-lg">Answers to everything you might wonder about</p>

        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={[
            { q: 'Does IMBA VPN work in China, UAE, and Turkey?', a: 'Yes. The primary protocol is VLESS Reality, whose traffic is indistinguishable from regular HTTPS. It passes DPI systems deployed in China\'s Great Firewall, UAE, Turkey, and other highly censored networks. 50+ servers across 30+ countries.', color: 'var(--violet-100)' },
            { q: 'Is there a free VPN trial?', a: 'Yes: after signing up, follow IMBA on Telegram and activate the Start plan — 7 days free with full VPN access on VLESS Reality plus 500 MB eSIM. No ads, no data selling, no overcrowded servers.', color: 'var(--blue-100)' },
            { q: 'Will VPN slow down my internet?', a: 'Minimally. XTLS Reality adds almost no overhead: YouTube in 4K, video calls, and gaming work just like without a VPN.', color: 'var(--green-100)' },
            { q: 'Which devices are supported?', a: 'iPhone, iPad, Android, Windows, macOS, Linux, Android TV. One subscription covers multiple devices simultaneously.', color: 'var(--paper)' },
            { q: 'Do you keep logs?', a: 'No. We don\'t record browsing history, IP addresses, or connection timestamps. Zero-knowledge architecture: there\'s simply no data to hand over.', color: 'var(--violet-100)' },
            { q: 'How do I pay without a local card?', a: 'With cryptocurrency (USDT, BTC) or bank transfer. You can also issue a virtual Visa/Mastercard through IMBA and use it to pay for any global service.', color: 'var(--blue-100)' },
            { q: 'Which VPN protocol bypasses DPI censorship?', a: 'VLESS with XTLS Reality. It disguises the connection as a normal HTTPS request to a legitimate site, so DPI systems find no VPN signatures. OpenVPN and WireGuard are identified by traffic characteristics and blocked in most restricted networks.', color: 'var(--green-100)' },
            { q: 'Is using a VPN legal?', a: 'In most countries, using a VPN is fully legal. Always check local regulations if you\'re unsure. IMBA is registered in Costa Rica and operates under Costa Rican jurisdiction.', color: 'var(--paper)' },
            { q: 'What else is included in the subscription?', a: 'eSIM for 190+ countries — mobile internet when traveling, and a virtual card in USD/EUR/AED for Netflix, Spotify, ChatGPT, and more. Three services, one dashboard.', color: 'var(--violet-100)' },
          ]} />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl text-center py-16 px-6" style={{ background: 'var(--green)' }}>
        <div className="flex justify-center mb-4">
          <LottieSticker name="rocket" size={120} />
        </div>
        <h2 className="display text-4xl md:text-6xl mb-4">Ready to start?</h2>
        <p className="font-semibold text-lg text-ink/70 mb-8">Sign up in one minute. No card required.</p>
        <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">Get Started →</Link>
      </section>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Does IMBA VPN work in China, UAE, and Turkey?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The primary protocol is VLESS Reality, whose traffic is indistinguishable from regular HTTPS. It passes DPI systems in China, UAE, Turkey, and other censored networks. 50+ servers across 30+ countries.' } },
          { '@type': 'Question', name: 'Is there a free VPN trial?', acceptedAnswer: { '@type': 'Answer', text: 'Yes: follow IMBA on Telegram after signing up and activate the Start plan — 7 days free with full VPN access on VLESS Reality plus 500 MB eSIM. No ads, no data selling.' } },
          { '@type': 'Question', name: 'Will VPN slow down my internet?', acceptedAnswer: { '@type': 'Answer', text: 'Minimally. XTLS Reality adds almost no overhead: YouTube in 4K, video calls, and gaming work just like without a VPN.' } },
          { '@type': 'Question', name: 'Which devices are supported?', acceptedAnswer: { '@type': 'Answer', text: 'iPhone, iPad, Android, Windows, macOS, Linux, Android TV. One subscription covers multiple devices simultaneously.' } },
          { '@type': 'Question', name: 'Do you keep logs?', acceptedAnswer: { '@type': 'Answer', text: 'No. We don\'t record browsing history, IP addresses, or connection timestamps. Zero-knowledge architecture — there\'s simply no data to hand over.' } },
          { '@type': 'Question', name: 'How do I pay without a local card?', acceptedAnswer: { '@type': 'Answer', text: 'With cryptocurrency (USDT, BTC) or bank transfer. You can also issue a virtual Visa/Mastercard through IMBA.' } },
          { '@type': 'Question', name: 'Which VPN protocol bypasses DPI censorship?', acceptedAnswer: { '@type': 'Answer', text: 'VLESS with XTLS Reality. It disguises the connection as a normal HTTPS request to a legitimate site, so DPI systems find no VPN signatures.' } },
          { '@type': 'Question', name: 'Is using a VPN legal?', acceptedAnswer: { '@type': 'Answer', text: 'In most countries, using a VPN is fully legal. Always check local regulations. IMBA is registered in Costa Rica.' } },
          { '@type': 'Question', name: 'What else is included in the subscription?', acceptedAnswer: { '@type': 'Answer', text: 'eSIM for 190+ countries and a virtual card in USD/EUR/AED for Netflix, Spotify, ChatGPT, and more. Three services, one dashboard.' } },
        ],
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', '@id': SITE_URL + '/#plan-start',
        name: 'IMBA Start', description: 'Free plan: 1 eSIM profile, basic VPN, 1 virtual card.',
        brand: { '@type': 'Brand', name: 'IMBA' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: SITE_URL + '/auth/register' },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', '@id': SITE_URL + '/#plan-combo',
        name: 'IMBA COMBO', description: '3 eSIM profiles, VPN Pro (50+ servers), 3 virtual cards.',
        brand: { '@type': 'Brand', name: 'IMBA' },
        offers: { '@type': 'Offer', price: '9.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: SITE_URL + '/auth/register' },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'IMBA VPN',
        applicationCategory: 'VPNApplication',
        operatingSystem: 'iOS, Android, Windows, macOS, Linux, Android TV',
        description: 'VPN client running VLESS Reality — works in China, UAE, Turkey, and any censored network. Zero logs.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: SITE_URL + '/auth/register', description: '7 days free' },
        publisher: { '@type': 'Organization', '@id': SITE_URL + '/#organization' },
      })}} />

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/blog" className="hover:opacity-60">Blog</Link>
            <Link href="/privacy-policy" className="hover:opacity-60">Privacy</Link>
            <Link href="/terms" className="hover:opacity-60">Terms</Link>
            <Link href="/refund" className="hover:opacity-60"><span className="sm:hidden">Refund</span><span className="hidden sm:inline">Refund Policy</span></Link>
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
