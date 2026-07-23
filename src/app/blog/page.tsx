import type { Metadata } from 'next'
import Link from 'next/link'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'
import { Logo } from '@/components/Logo'
import { existsSync } from 'fs'
import { join } from 'path'
import { BlogList, type BlogListPost } from '@/components/BlogList'
import { posts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

const FEATURED_SLUG = 'vpn-russia-2026'
const AUTHOR = 'Sergey Karpov'

// Auto-detect an SVG cover for a post. Drop `cover-<slug>.svg` or `<slug>.svg`
// into public/blog/ and it appears automatically; otherwise the card falls back
// to the text-only default. Alt text uses the post title (SEO).
function coverFor(slug: string, title: string): { src: string; alt: string } | undefined {
  for (const file of [`cover-${slug}.svg`, `${slug}.svg`]) {
    if (existsSync(join(process.cwd(), 'public', 'blog', file))) {
      return { src: `/blog/${file}`, alt: title }
    }
  }
  return undefined
}

export const metadata: Metadata = {
  title: 'IMBA Blog — VPN, eSIM & Virtual Card Guides',
  description: 'Step-by-step guides on VPN protocols, eSIM setup, and paying for global services with a virtual card. Internet without borders.',
  alternates: { canonical: SITE_URL + '/blog' },
  openGraph: {
    title: 'IMBA Blog — VPN, eSIM & Virtual Card Guides',
    description: 'Practical guides: which VPN works against censorship, how to pay for ChatGPT and Netflix, eSIM for international travel.',
    type: 'website',
    url: SITE_URL + '/blog',
    images: [{ url: SITE_URL + '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    siteName: 'IMBA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMBA Blog — VPN, eSIM & Virtual Card Guides',
    description: 'Practical guides: which VPN works against censorship, how to pay for ChatGPT and Netflix, eSIM for international travel.',
    images: [SITE_URL + '/og-image.png'],
  },
}

export default function BlogPage() {
  const featured = posts.find((p) => p.slug === FEATURED_SLUG)
  const rest: BlogListPost[] = posts
    .filter((p) => p.slug !== FEATURED_SLUG)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      categoryColor: p.categoryColor,
      date: p.date,
      readTime: p.readTime,
      cover: coverFor(p.slug, p.title),
    }))
  const featuredCover = featured ? coverFor(featured.slug, featured.title) : undefined

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'IMBA Blog',
        url: SITE_URL + '/blog',
        description: 'Guides on VPN, eSIM, and virtual cards for global internet access',
        publisher: { '@type': 'Organization', '@id': SITE_URL + '/#organization', name: 'IMBA', url: SITE_URL },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE_URL + '/blog' },
        ],
      })}} />
      <Marquee
        bg="var(--violet-100)"
        items={['eSIM IN 190 COUNTRIES', 'ZERO-LOG VPN', 'VIRTUAL CARD', 'PAY ANYWHERE', 'NO BORDERS']}
      />

      <SiteHeader />

      {/* Hero */}
      <div className="rounded-xl px-5 md:px-12 py-10 md:py-14" style={{ background: 'var(--yellow)' }}>
        <div className="max-w-7xl mx-auto">
          <span className="chip mb-4" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>Blog</span>
          <h1 className="display text-4xl md:text-6xl mt-3">Guides & How-Tos</h1>
          <p className="mt-4 text-base md:text-lg font-medium text-ink/70 max-w-2xl">
            VPN, eSIM, and virtual cards: how they work and how to set them up. Step by step, tested on real devices.
          </p>
        </div>
      </div>

      {/* Featured + grid */}
      <div className="rounded-xl flex-1 px-5 md:px-12 py-10" style={{ background: 'var(--cream)' }}>
        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block max-w-7xl mx-auto mb-10">
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
              {featuredCover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredCover.src}
                  alt={featuredCover.alt}
                  className="w-full rounded-2xl group-hover:-translate-y-1 transition-transform duration-200"
                />
              )}
              <div className="flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-2">
                  {featured.category} · Featured
                </span>
                <h2 className="display text-2xl md:text-4xl mb-3 group-hover:opacity-70 transition-opacity">
                  {featured.title}
                </h2>
                <p className="text-sm md:text-base text-ink/65 leading-relaxed mb-4">{featured.excerpt}</p>
                <span className="text-xs text-ink/40 font-semibold">
                  {AUTHOR} · {featured.date} · {featured.readTime}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Filterable grid */}
        <BlogList posts={rest} />
      </div>

      {/* Community CTA */}
      <section className="rounded-xl px-5 md:px-12 py-12 text-center" style={{ background: 'var(--violet-100)' }}>
        <h2 className="display text-2xl md:text-4xl mb-3">Stay in the loop</h2>
        <p className="font-medium text-ink/70 max-w-xl mx-auto mb-6 text-sm md:text-base">
          New guides, protocol updates, and mirror links — in the IMBA Telegram channel.
          Following also unlocks 7 days of VPN free.
        </p>
        <a href="https://t.me/imba_live" target="_blank" rel="noopener" className="pill pill-ink text-base">Follow on Telegram →</a>
      </section>

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
