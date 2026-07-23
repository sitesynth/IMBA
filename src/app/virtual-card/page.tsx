import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'
import { FaqAccordion } from '@/components/FaqAccordion'
import { posts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Virtual Visa/Mastercard for Global Payments | IMBA',
  description: 'Virtual Visa/Mastercard in USD, EUR, and AED. Pay for ChatGPT, Netflix, Spotify, Steam, Amazon from anywhere. Issue in 1 minute, fund with crypto or bank transfer.',
  alternates: { canonical: SITE_URL + '/virtual-card' },
  openGraph: {
    title: 'Virtual Visa/Mastercard for Global Payments | IMBA',
    description: 'Virtual card in USD, EUR, AED. ChatGPT, Netflix, Spotify, Steam, Amazon. Issue in 1 minute.',
    url: SITE_URL + '/virtual-card',
    siteName: 'IMBA',
    locale: 'en_US',
    type: 'website',
    images: [{ url: SITE_URL + '/og-image.png', width: 1200, height: 630 }],
  },
}

const faqItems = [
  { q: 'How is a virtual card different from a regular card?', a: 'Only the absence of plastic. The credentials are identical: card number, expiry date, CVV, and billing address. For online payments, this is everything you need.', color: 'var(--green-100)' },
  { q: 'How do I fund the card?', a: 'Via cryptocurrency (USDT, BTC, and others) or bank transfer. No specific card or bank account required.', color: 'var(--paper)' },
  { q: 'What are the fees?', a: 'All fees for top-up and conversion are shown before you confirm — no hidden charges. Current rates are in the Tariffs section of your dashboard.', color: 'var(--green-100)' },
  { q: 'Does it work for recurring subscriptions?', a: 'Yes. ChatGPT Plus, Netflix, Spotify, and other services with automatic billing will charge the card as long as it has a sufficient balance.', color: 'var(--paper)' },
  { q: 'How many cards can I have?', a: 'On the free Start plan — 1 card. On Pro ($9.99/mo) — 3 cards. On Business ($24.99/mo) — 10 cards.', color: 'var(--green-100)' },
  { q: 'What if a payment fails?', a: 'Check your balance and card currency. Some services require a billing address — it is provided with your card details. If the problem persists, contact IMBA support.', color: 'var(--paper)' },
  { q: 'Is the virtual card secure?', a: 'Yes. A virtual card cannot be physically lost or skimmed. Every transaction is visible in your dashboard, and you can block the card instantly with one click.', color: 'var(--green-100)' },
  { q: 'What currencies are supported?', a: 'USD, EUR, and AED. If you pay in a different currency, conversion is automatic and the exchange rate is shown before the transaction.', color: 'var(--paper)' },
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
  name: 'IMBA Virtual Card',
  description: 'Virtual Visa/Mastercard in USD, EUR, and AED for global online payments. Issue in 1 minute, fund with crypto or bank transfer.',
  brand: { '@type': 'Brand', name: 'IMBA' },
  offers: [
    { '@type': 'Offer', name: 'Start', price: '0', priceCurrency: 'USD', description: '1 virtual card, free to issue', availability: 'https://schema.org/InStock', url: SITE_URL + '/auth/register' },
    { '@type': 'Offer', name: 'Pro', price: '9.99', priceCurrency: 'USD', description: '3 virtual cards, priority support', availability: 'https://schema.org/InStock', url: SITE_URL + '/auth/register' },
    { '@type': 'Offer', name: 'Business', price: '24.99', priceCurrency: 'USD', description: '10 virtual cards, API access', availability: 'https://schema.org/InStock', url: SITE_URL + '/auth/register' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name: 'Virtual Card', item: SITE_URL + '/virtual-card' },
  ],
}

const SERVICES = [
  'Netflix', 'Spotify', 'ChatGPT Plus', 'Adobe', 'Amazon', 'Apple', 'Steam', 'Booking',
  'YouTube Premium', 'Notion', 'Figma', 'GitHub', 'Claude', 'Midjourney', 'Canva', 'Microsoft 365',
]

export default function VirtualCardPage() {
  const relatedPosts = posts.filter(p => p.category === 'Card')

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>

      <Marquee
        bg="var(--green-100)"
        items={['VISA / MASTERCARD', 'USD · EUR · AED', 'ISSUE IN 1 MINUTE', 'FUND WITH CRYPTO', 'NETFLIX · SPOTIFY · CHATGPT']}
      />

      <SiteHeader />

      {/* Hero */}
      <div className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-12 py-14 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <span className="chip mb-5 inline-block" style={{ background: 'var(--green)', borderColor: 'var(--ink)' }}>Virtual Card</span>
            <h1 className="display text-3xl md:text-[2.1rem] mb-6 leading-tight">
              Virtual Visa/Mastercard for Global Payments
            </h1>
            <p className="text-base md:text-lg font-semibold text-ink/65 max-w-xl mb-8">
              A virtual Visa or Mastercard in USD, EUR, or AED — issued in under a minute, funded via crypto or bank transfer. Works for ChatGPT, Netflix, Spotify, Steam, Amazon, and any other service that accepts international cards.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register" className="pill text-base" style={{ background: '#55DB9C', color: '#111111', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>
                Issue card →
              </Link>
              <Link href="#how" className="pill pill-paper text-base">How it works</Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blog/virtualcard.svg" alt="IMBA Virtual Card" className="w-56 md:w-80 shrink-0 -mt-4 md:-mt-8" />
        </div>
      </div>

      {/* Services marquee */}
      <div className="rounded-xl px-5 md:px-12 py-8" style={{ background: 'var(--green-100)' }}>
        <p className="text-center text-xs font-bold text-ink/40 uppercase tracking-widest mb-6">Works wherever international cards are accepted</p>
        <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
          {SERVICES.map(s => (
            <span key={s} className="chip" style={{ background: 'var(--paper)', borderColor: 'var(--ink)' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Why you need it */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl mb-4 text-center">When your card gets declined abroad</h2>
        <p className="font-semibold text-ink/55 mb-4 text-sm md:text-base max-w-2xl mx-auto text-center leading-relaxed">
          Cards from certain countries or banks get declined by global services — not because of your credit, but because of where the card was issued. Sanctioned banks, restricted regions, and currency mismatches all trigger payment failures.
        </p>
        <p className="font-semibold text-ink/55 text-sm md:text-base max-w-2xl mx-auto text-center leading-relaxed">
          The IMBA virtual card is issued by IMBA SRL in Costa Rica — outside any restricted banking system. To any payment processor, it looks like a standard international card with a <strong className="text-ink">card number, expiry date, CVV, and billing address</strong>. Enter the details and pay.
        </p>
      </section>

      {/* What you can pay for */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-5xl mb-8 text-center">What you can pay for</h2>
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <div className="panel p-6">
            <h3 className="display text-base mb-3">Streaming & AI tools</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">
              ChatGPT Plus, Claude, Midjourney, Netflix, Spotify, YouTube Premium, Steam, PlayStation, Adobe, Notion — any service with card payments, including recurring subscriptions. Guides: <Link href="/blog/pay-chatgpt-from-russia" className="font-black text-ink border-b border-dotted border-ink/40">pay for ChatGPT</Link>, <Link href="/blog/pay-netflix-from-russia" className="font-black text-ink border-b border-dotted border-ink/40">subscribe to Netflix</Link>.
            </p>
          </div>
          <div className="panel p-6">
            <h3 className="display text-base mb-3">Shopping & travel</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">
              Amazon, eBay, Booking.com, Airbnb, international airlines, car rental. While traveling, the card works alongside <Link href="/esim" className="font-black text-ink border-b border-dotted border-ink/40">IMBA eSIM</Link> — internet and payments from one dashboard.
            </p>
          </div>
          <div className="panel p-6">
            <h3 className="display text-base mb-3">Business & tools</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">
              Ad accounts, hosting, domains, SaaS tools, App Store Developer, Google Play Console. On the Pro plan — up to 3 cards: one for each purpose.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl text-center mb-2">How it works</h2>
        <p className="text-center font-semibold text-ink/55 mb-12 text-sm md:text-lg">From sign-up to first payment in 5 minutes</p>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Top up your balance', desc: 'Via USDT, BTC, or bank transfer. No specific card or bank required.', cta: 'Top up →', href: '/auth/register' },
            { step: '02', title: 'Issue your card', desc: 'One click in the dashboard. Card number, expiry, CVV, and billing address are ready instantly.', cta: 'Issue →', href: '/auth/register' },
            { step: '03', title: 'Pay anywhere', desc: 'Enter the card details on any website as you would with any card. Works in 190+ countries, online and for subscriptions.', cta: 'Get started →', href: '/auth/register' },
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
        <h2 className="display text-3xl md:text-5xl text-center mb-12">Why IMBA Card</h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {[
            { icon: '💳', title: 'Visa and Mastercard', desc: 'Accepted everywhere international cards are accepted. No geographic or category restrictions.' },
            { icon: '⚡', title: 'Issued in 1 minute', desc: 'No KYC, no verification delays. Card details are available immediately after you fund your balance.' },
            { icon: '🌐', title: 'USD · EUR · AED', desc: 'Three currencies. Pay for US services in dollars, European services in euros.' },
            { icon: '🔒', title: 'Issued in Costa Rica', desc: 'IMBA SRL is registered in Costa Rica, outside any restricted banking system. Funded via crypto or transfer.' },
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
        <h2 className="display text-3xl md:text-5xl text-center mb-10">Payment options compared</h2>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs text-ink/50 uppercase tracking-wider">
                <th className="pb-3 pr-3 font-semibold">Option</th>
                <th className="pb-3 pr-3 font-semibold">Speed</th>
                <th className="pb-3 pr-3 font-semibold">Documents</th>
                <th className="pb-3 pr-3 font-semibold">Fee</th>
                <th className="pb-3 font-semibold">Auto-billing</th>
              </tr>
            </thead>
            <tbody className="font-semibold">
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-3 font-black">IMBA Virtual Card</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>1 minute</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>none</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>shown before transaction</td>
                <td className="py-3" style={{ color: '#6abf6e' }}>works</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-3 font-black">Foreign bank card</td>
                <td className="py-3 pr-3" style={{ color: '#c9a040' }}>trip + weeks</td>
                <td className="py-3 pr-3 text-ink/40">passport, local tax ID</td>
                <td className="py-3 pr-3" style={{ color: '#c9a040' }}>bank maintenance fee</td>
                <td className="py-3" style={{ color: '#6abf6e' }}>works</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-3 font-black">Payment intermediary</td>
                <td className="py-3 pr-3" style={{ color: '#c9a040' }}>hours</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>none</td>
                <td className="py-3 pr-3 text-ink/40">20–30% markup</td>
                <td className="py-3 text-ink/40">manual each time</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-3 font-black">Crypto direct</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>minutes</td>
                <td className="py-3 pr-3" style={{ color: '#6abf6e' }}>none</td>
                <td className="py-3 pr-3" style={{ color: '#c9a040' }}>network + exchange</td>
                <td className="py-3 text-ink/40">almost nowhere</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="rounded-xl px-5 md:px-8 py-6" style={{ background: 'var(--paper)' }}>
        <p className="text-center font-semibold text-ink/60 text-sm md:text-base">
          IMBA also includes <Link href="/" className="font-black text-ink border-b border-dotted border-ink/40 hover:opacity-70">VLESS Reality VPN</Link> and <Link href="/esim" className="font-black text-ink border-b border-dotted border-ink/40 hover:opacity-70">eSIM for 190+ countries</Link> — one dashboard, one balance.
        </p>
      </section>

      {/* Blog posts */}
      {relatedPosts.length > 0 && (
        <section className="rounded-xl px-5 md:px-12 py-12" style={{ background: 'var(--paper)' }}>
          <h2 className="display text-3xl md:text-5xl mb-2 text-center">Read more</h2>
          <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base text-center">Guides to paying for global services</p>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {relatedPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="panel h-full flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <span className="chip" style={{ background: 'var(--green)', borderColor: 'var(--ink)' }}>{post.category}</span>
                    <span className="text-xs text-ink/40 font-semibold">{post.readTime} read</span>
                  </div>
                  <h3 className="text-lg font-black leading-snug group-hover:opacity-70 transition-opacity">{post.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                    <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
                    <span className="text-sm font-black group-hover:underline" style={{ color: 'var(--green)' }}>Read →</span>
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
        <p className="text-center font-semibold text-ink/60 mb-10 text-sm md:text-lg">Everything about the virtual card</p>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl text-center py-16 px-6" style={{ background: 'var(--green)' }}>
        <h2 className="display text-4xl md:text-6xl mb-4">Ready to pay anywhere?</h2>
        <p className="font-semibold text-lg text-ink/70 mb-8">Issue your card in 1 minute. No documentation required.</p>
        <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">Issue card →</Link>
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
