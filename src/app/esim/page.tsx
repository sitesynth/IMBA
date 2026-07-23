import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'
import { FaqAccordion } from '@/components/FaqAccordion'
import { posts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'eSIM for International Travel — Internet in 190+ Countries | IMBA',
  description: 'Travel eSIM for 190+ countries. Activate via QR in 1 minute. 5–10x cheaper than roaming. Works on iPhone and Android. 500 MB free for new users.',
  alternates: { canonical: SITE_URL + '/esim' },
  openGraph: {
    title: 'eSIM for International Travel — Internet in 190+ Countries | IMBA',
    description: 'Activate via QR in 1 minute. 5–10x cheaper than roaming. 500 MB free.',
    url: SITE_URL + '/esim',
    siteName: 'IMBA',
    locale: 'en_US',
    type: 'website',
    images: [{ url: SITE_URL + '/og-image.png', width: 1200, height: 630 }],
  },
}

const faqItems = [
  { q: 'What is an eSIM?', a: 'An eSIM is a digital SIM card built into your phone. Instead of a physical card, your carrier writes a profile remotely via a QR code. No need to visit a store or handle a plastic SIM.', color: 'var(--violet-100)' },
  { q: 'Which devices support eSIM?', a: 'iPhone XS and later (iPhone 14+ US models are eSIM-only). Android: Pixel 4+, Galaxy S21+, and most flagship phones from 2021 onward. Quick check: dial *#06# — if you see an EID number, your phone supports eSIM.', color: 'var(--paper)' },
  { q: 'How much cheaper is eSIM vs. roaming?', a: '5–10x cheaper in most destinations. Example: 10 GB in Germany costs $50–80 with carrier roaming; the same via IMBA eSIM runs $5–10. The difference is even larger in Turkey, Thailand, and UAE.', color: 'var(--violet-100)' },
  { q: 'When should I install the eSIM — before or after I land?', a: 'Before you leave — you need an internet connection to download the eSIM profile. Data usage on most plans only starts when your phone connects to a local network at your destination.', color: 'var(--paper)' },
  { q: 'Does my home SIM stay active?', a: 'Yes. The eSIM works as a second profile: your primary SIM keeps receiving calls and texts (including bank codes), while the eSIM handles data.', color: 'var(--violet-100)' },
  { q: 'What if I run out of data?', a: 'Buy a new data package in the dashboard — it activates automatically. No new QR code needed.', color: 'var(--paper)' },
  { q: 'Can I use the eSIM as a hotspot?', a: 'Yes, hotspot mode works on most plans.', color: 'var(--violet-100)' },
  { q: 'What happens to the eSIM after my trip?', a: 'The profile stays on your phone but stops consuming data. Before your next trip, buy a new package — the same profile activates again.', color: 'var(--paper)' },
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
  description: 'Travel eSIM for 190+ countries. Activate via QR in 1 minute. Your home SIM stays active.',
  brand: { '@type': 'Brand', name: 'IMBA' },
  offers: [
    { '@type': 'Offer', name: 'Start', price: '0', priceCurrency: 'USD', description: 'eSIM 500 MB for 7 days free with IMBA Telegram follow', availability: 'https://schema.org/InStock', url: SITE_URL + '/auth/register' },
    { '@type': 'Offer', name: 'Country plans', price: '3', priceCurrency: 'USD', description: 'From $3 per GB, packages from 1 GB to unlimited in 190+ countries', availability: 'https://schema.org/InStock', url: SITE_URL + '/auth/register' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'eSIM', item: SITE_URL + '/esim' },
  ],
}

export default function EsimPage() {
  const relatedPosts = posts.filter(p => p.category === 'eSIM')

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>

      <Marquee
        bg="var(--violet-100)"
        items={['190+ COUNTRIES', 'ACTIVATE IN 1 MINUTE', 'NO PHYSICAL SIM', 'iPHONE & ANDROID', '10x CHEAPER THAN ROAMING']}
      />

      <SiteHeader />

      {/* Hero */}
      <div className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-12 py-14 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <span className="chip mb-5 inline-block" style={{ background: 'var(--violet)', borderColor: 'var(--ink)' }}>eSIM</span>
            <h1 className="display text-3xl md:text-[2.1rem] mb-6 leading-tight">
              eSIM for International Travel: Internet in 190+ Countries
            </h1>
            <p className="text-base md:text-lg font-semibold text-ink/65 max-w-xl mb-8">
              Pick your destination, scan the QR code — and you&apos;re online at local rates. Up to 10x cheaper than roaming, no physical SIM card needed. Your home number stays active. New users get 500 MB free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register" className="pill text-base" style={{ background: '#C9A4FF', color: '#111111', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>
                Get eSIM →
              </Link>
              <Link href="#how" className="pill pill-paper text-base">How it works</Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blog/esim.svg" alt="IMBA eSIM" className="w-56 md:w-80 shrink-0 -mt-4 md:-mt-8" />
        </div>
      </div>

      {/* Stats strip */}
      <div className="rounded-xl px-5 md:px-12 py-8" style={{ background: 'var(--violet-100)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          {[
            { n: '190+', label: 'countries' },
            { n: '1 min', label: 'QR activation' },
            { n: '× 10', label: 'cheaper than roaming' },
            { n: '0', label: 'trips to a store' },
          ].map(s => (
            <div key={s.n}>
              <div className="display text-4xl md:text-5xl mb-1">{s.n}</div>
              <div className="text-sm font-semibold text-ink/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl text-center mb-2">eSIM vs. Roaming: the real cost</h2>
        <p className="text-center font-semibold text-ink/55 mb-10 text-sm md:text-lg max-w-2xl mx-auto">
          An eSIM is a digital SIM card built into your phone. Instead of queuing at an airport kiosk, you buy a plan online, scan a QR code — and have local internet within minutes.
        </p>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <caption className="font-black text-lg mb-4">Cost comparison: 10 GB while traveling</caption>
            <thead>
              <tr className="text-left text-xs text-ink/50 uppercase tracking-wider">
                <th className="pb-3 pr-4 font-semibold">Option</th>
                <th className="pb-3 pr-4 font-semibold">10 GB costs</th>
                <th className="pb-3 font-semibold">Setup</th>
              </tr>
            </thead>
            <tbody className="font-semibold">
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-4 font-black">Carrier roaming</td>
                <td className="py-3 pr-4" style={{ color: '#c9a040' }}>$30–80</td>
                <td className="py-3 text-ink/60">automatic, but expensive per GB</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-4 font-black">Local SIM at the airport</td>
                <td className="py-3 pr-4" style={{ color: '#c9a040' }}>$10–20</td>
                <td className="py-3 text-ink/60">queue, passport, new number</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-4 font-black">IMBA eSIM</td>
                <td className="py-3 pr-4" style={{ color: '#6abf6e' }}>$5–12</td>
                <td className="py-3" style={{ color: '#6abf6e' }}>QR in 1 minute, same number</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-5xl mb-2 text-center">Popular destinations</h2>
        <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base max-w-2xl mx-auto text-center">
          Regional plans cover multiple countries — convenient for multi-stop trips. Full list of 190+ destinations with prices is in your dashboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { flag: '\u{1F1F9}\u{1F1F7}', city: 'Turkey', tag: 'MOST POPULAR', desc: 'Istanbul, Antalya, Bodrum — online from the moment you land.', link: { href: '/blog/esim-turkey-2026', label: 'Guide: eSIM in Turkey →' } },
            { flag: '\u{1F1EF}\u{1F1F5}', city: 'Japan', tag: 'ASIA', desc: 'Tokyo, Osaka, Kyoto — fast 4G/LTE across the entire country.' },
            { flag: '\u{1F1FA}\u{1F1E6}', city: 'UAE', tag: 'DUBAI / ABU DHABI', desc: 'Reliable coverage across the Emirates, including free zones.' },
            { flag: '\u{1F1EA}\u{1F1FA}', city: 'Europe', tag: '40+ COUNTRIES', desc: 'One plan works across all EU countries — no switching needed.' },
            { flag: '\u{1F1FA}\u{1F1F8}', city: 'USA', tag: 'NORTH AMERICA', desc: 'Nationwide coverage via T-Mobile and AT&T partner networks.' },
            { flag: '\u{1F30D}', city: 'All countries', tag: '190+ DESTINATIONS', desc: 'Asia, Americas, Africa, Middle East — full list and prices in your dashboard.' },
          ].map(d => (
            <div key={d.city} className="panel p-5 flex flex-col gap-2">
              <div className="font-black text-lg">{d.flag} {d.city}</div>
              <div className="text-xs text-ink/40 font-semibold tracking-wider">{d.tag}</div>
              <p className="text-sm text-ink/60 font-semibold leading-relaxed">{d.desc}</p>
              {d.link && <Link href={d.link.href} className="text-sm font-black mt-1" style={{ color: 'var(--violet)' }}>{d.link.label}</Link>}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl text-center mb-2">How it works</h2>
        <p className="text-center font-semibold text-ink/55 mb-12 text-sm md:text-lg">Three steps from sign-up to internet</p>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Pick your destination', desc: 'In the dashboard, choose your destination country and data amount — from 1 GB to unlimited.', cta: 'Browse plans →', href: '/auth/register' },
            { step: '02', title: 'Buy a plan', desc: 'Pay via your IMBA balance. Top up with USDT, BTC, or bank transfer. No specific card required.', cta: 'Buy →', href: '/auth/register' },
            { step: '03', title: 'Activate via QR', desc: 'Scan the QR code in your phone settings — done. The eSIM profile is active and data starts flowing. No physical SIM.', cta: 'Get started →', href: '/auth/register' },
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
        <h2 className="display text-3xl md:text-5xl text-center mb-12">Why IMBA eSIM</h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {[
            { icon: '🌍', title: '190+ countries', desc: 'Europe, Asia, Middle East, Americas, Africa. There is a plan for any destination.' },
            { icon: '⚡', title: 'Active in 1 minute', desc: 'Scan the QR — done. No store visit, no hunting for a local shop, no waiting for delivery.' },
            { icon: '💰', title: 'Fraction of roaming cost', desc: 'Carrier roaming can cost $5–10 per GB. IMBA eSIM runs $0.50–1.50 per GB in most destinations.' },
            { icon: '📱', title: 'Dual SIM', desc: 'Your home number stays active. Calls and texts come through as normal on your primary SIM.' },
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

      {/* Device compatibility */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-5xl mb-8 text-center">Which phones support eSIM?</h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <div className="panel p-6">
            <h3 className="display text-lg mb-3">iPhone</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">XS and later, including SE 2020+. US iPhone 14+ models are eSIM-only — no physical SIM slot.</p>
          </div>
          <div className="panel p-6">
            <h3 className="display text-lg mb-3">Android</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">Google Pixel 4+, Samsung Galaxy S21+, and most flagship phones from 2021 onward.</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-ink/55 mt-6 max-w-2xl mx-auto text-center leading-relaxed">
          To check your phone: dial <strong className="text-ink">*#06#</strong> — if you see an EID number in the list, eSIM is supported. On iPhone: Settings, then Cellular, then Add eSIM.
        </p>
      </section>

      {/* Free trial */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--violet-100)' }}>
        <h2 className="display text-3xl md:text-5xl mb-3 text-center">Try free: eSIM 500 MB for 7 days</h2>
        <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base max-w-2xl mx-auto text-center">
          Not sure yet? Try it risk-free: sign up, follow IMBA on Telegram, and activate the Start plan — 500 MB eSIM plus VPN for 7 days. Enough for maps, messaging, and getting around on your first day abroad.
        </p>
        <div className="grid sm:grid-cols-1 gap-4 max-w-sm mx-auto mb-8">
          <a href="https://t.me/imba_live" target="_blank" rel="noopener noreferrer" className="panel p-5 hover:-translate-y-0.5 transition-transform">
            <h3 className="font-black text-base mb-1">Telegram</h3>
            <p className="text-sm text-ink/60 font-semibold">Follow IMBA on Telegram</p>
          </a>
        </div>
        <div className="text-center">
          <Link href="/auth/register" className="pill text-base" style={{ background: '#C9A4FF', color: '#111111', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>
            Get 500 MB free →
          </Link>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="rounded-xl px-5 md:px-8 py-6" style={{ background: 'var(--paper)' }}>
        <p className="text-center font-semibold text-ink/60 text-sm md:text-base">
          IMBA also includes <Link href="/" className="font-black text-ink border-b border-dotted border-ink/40 hover:opacity-70">VLESS Reality VPN</Link> and a <Link href="/virtual-card" className="font-black text-ink border-b border-dotted border-ink/40 hover:opacity-70">virtual Visa/Mastercard</Link> — one dashboard, one balance.
        </p>
      </section>

      {/* Blog posts */}
      {relatedPosts.length > 0 && (
        <section className="rounded-xl px-5 md:px-12 py-12" style={{ background: 'var(--paper)' }}>
          <h2 className="display text-3xl md:text-5xl mb-2 text-center">Read more</h2>
          <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base text-center">eSIM guides and tips</p>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {relatedPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="panel h-full flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <span className="chip" style={{ background: 'var(--violet)', borderColor: 'var(--ink)' }}>{post.category}</span>
                    <span className="text-xs text-ink/40 font-semibold">{post.readTime} read</span>
                  </div>
                  <h3 className="text-lg font-black leading-snug group-hover:opacity-70 transition-opacity">{post.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                    <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
                    <span className="text-sm font-black group-hover:underline" style={{ color: 'var(--violet)' }}>Read →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="rounded-xl px-4 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-7xl text-center mb-2">Questions?</h2>
        <p className="text-center font-semibold text-ink/60 mb-10 text-sm md:text-lg">Everything about eSIM</p>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl text-center py-16 px-6" style={{ background: 'var(--violet)' }}>
        <h2 className="display text-4xl md:text-6xl mb-4">Ready to travel?</h2>
        <p className="font-semibold text-lg text-ink/70 mb-8">Internet in any country. Active in under a minute.</p>
        <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">Get eSIM →</Link>
      </section>

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/blog" className="hover:opacity-60">Blog</Link>
            <Link href="/privacy-policy" className="hover:opacity-60">Privacy</Link>
            <Link href="/terms" className="hover:opacity-60">Terms</Link>
            <Link href="/refund" className="hover:opacity-60">Refund Policy</Link>
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
