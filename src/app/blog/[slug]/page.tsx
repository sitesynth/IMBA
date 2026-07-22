import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'
import { Logo } from '@/components/Logo'
import { posts, getPost } from '@/lib/posts'
import { VpnKompyuterCover } from '@/components/blog/VpnKompyuterCover'

const COVERS: Record<string, () => React.ReactNode> = {
  'vpn-na-kompyutere': () => <VpnKompyuterCover />,
  'vpn-russia-2026': () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/blog/cover-vpn-russia-2026.svg" alt="Best VPN protocols in 2026: which ones work against censorship" className="w-full" style={{ marginLeft: '-8px', width: 'calc(100% + 8px)' }} />
  ),
  'esim-russia-abroad': () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/blog/esim-russia-abroad.svg" alt="eSIM for international travel: internet in 190+ countries without roaming" className="w-full" />
  ),
  'vpn-iphone': () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/blog/cover-vpn-iphone.svg" alt="VPN on iPhone in 2026: 5-minute setup guide" className="w-full" />
  ),
  'vpn-android': () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/blog/cover-vpn-android.svg" alt="VPN on Android in 2026: complete setup guide" className="w-full" />
  ),
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

const MONTH_MAP: Record<string, string> = {
  January:'01', February:'02', March:'03', April:'04', May:'05', June:'06',
  July:'07', August:'08', September:'09', October:'10', November:'11', December:'12',
}
function toIso(date: string) {
  // "July 11, 2026" → "2026-07-11"
  const m = date.match(/^(\w+)\s+(\d+),\s+(\d{4})$/)
  if (m) return `${m[3]}-${MONTH_MAP[m[1]] ?? '01'}-${m[2].padStart(2, '0')}`
  return date
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} — IMBA`,
    description: post.excerpt,
    alternates: { canonical: `https://www.imba.live/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://www.imba.live/blog/${slug}`,
      images: [{ url: post.ogImage ?? 'https://www.imba.live/og-image.png', width: 1200, height: 630 }],
      locale: 'en_US',
      siteName: 'IMBA',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage ?? 'https://www.imba.live/og-image.png'],
    },
  }
}

function extractFaq(content: string): { q: string; a: string }[] {
  const faqIdx = content.indexOf('## Частые вопросы')
  if (faqIdx === -1) return []
  const faqSection = content.slice(faqIdx)
  const lines = faqSection.split('\n')
  const items: { q: string; a: string }[] = []
  let currentQ = ''
  let currentA: string[] = []
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (currentQ && currentA.length) items.push({ q: currentQ, a: currentA.join(' ').trim() })
      currentQ = line.slice(4).trim()
      currentA = []
    } else if (currentQ && line.trim() && !line.startsWith('## ')) {
      currentA.push(line.replace(/\*\*(.+?)\*\*/g, '$1').trim())
    }
  }
  if (currentQ && currentA.length) items.push({ q: currentQ, a: currentA.join(' ').trim() })
  return items
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Table
    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[-| ]+\|$/))
      elements.push(
        <div key={key++} className="overflow-x-auto my-5">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1)
                const Tag = ri === 0 ? 'th' : 'td'
                return (
                  <tr key={ri} className={ri === 0 ? 'bg-ink text-paper' : ri % 2 === 0 ? 'bg-ink/5' : ''}>
                    {cells.map((cell, ci) => (
                      <Tag key={ci} className="px-3 py-2 border border-ink/20 text-left font-semibold whitespace-nowrap">
                        {cell.trim()}
                      </Tag>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-xl md:text-2xl font-black mt-8 mb-3">{line.slice(3)}</h2>)
      i++; continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-lg font-black mt-6 mb-2">{line.slice(4)}</h3>)
      i++; continue
    }

    // Bullet list
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={key++} className="my-3 pl-5 space-y-1.5 list-disc">
          {items.map((item, ii) => (
            <li key={ii} className="text-ink/75 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={key++} className="my-3 pl-5 space-y-1.5 list-decimal">
          {items.map((item, ii) => (
            <li key={ii} className="text-ink/75 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ol>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') { i++; continue }

    // Paragraph
    elements.push(
      <p key={key++} className="text-ink/75 leading-relaxed my-3"
        dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
      />
    )
    i++
  }

  return elements
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>
      <Marquee
        bg="var(--violet-100)"
        items={['eSIM IN 190 COUNTRIES', 'ZERO-LOG VPN', 'VIRTUAL CARD', 'PAY ANYWHERE', 'NO BORDERS']}
      />

      <SiteHeader />

      {/* Article */}
      <div className="rounded-xl flex-1" style={{ background: 'var(--paper)' }}>
        <div className="max-w-2xl mx-auto px-5 md:px-8 py-10 md:py-16">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-ink/50 hover:text-ink transition-colors mb-8">
            ← All articles
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="chip" style={{ background: post.categoryColor, borderColor: 'var(--ink)' }}>
              {post.category}
            </span>
            <Link href="/blog/author/sergey-karpov" className="text-xs text-ink/40 font-semibold hover:text-ink transition-colors">Sergey Karpov</Link>
            <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
            <span className="text-xs text-ink/40 font-semibold">{post.readTime} read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-5">{post.title}</h1>
          <p className="text-base text-ink/60 leading-relaxed mb-8">{post.excerpt}</p>

          {COVERS[slug] && <div className="mb-8">{COVERS[slug]()}</div>}

          {/* Content */}
          <div>{renderContent(post.content)}</div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl p-6 md:p-8 text-center" style={{ background: 'var(--yellow)', border: '2px solid var(--ink)' }}>
            <p className="font-black text-xl mb-2">Try IMBA free</p>
            <p className="text-sm text-ink/70 mb-5">eSIM + VPN + virtual card in one subscription</p>
            <Link href="/auth/register" className="pill pill-ink">Get started</Link>
          </div>
        </div>
      </div>

      {/* Article JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `https://www.imba.live/blog/${slug}#article`,
        headline: post.title,
        description: post.excerpt,
        url: `https://www.imba.live/blog/${slug}`,
        datePublished: toIso(post.date),
        dateModified: toIso(post.date),
        inLanguage: 'en',
        author: { '@type': 'Person', '@id': 'https://www.imba.live/blog/author/sergey-karpov#person', name: 'Sergey Karpov', url: 'https://www.imba.live/blog/author/sergey-karpov' },
        publisher: { '@type': 'Organization', '@id': 'https://www.imba.live/#organization', name: 'IMBA', logo: { '@type': 'ImageObject', url: 'https://www.imba.live/favicon.png', width: 512, height: 512 } },
        image: { '@type': 'ImageObject', url: post.ogImage ?? 'https://www.imba.live/og-image.png', width: 1200, height: 630 },
        isPartOf: { '@type': 'WebSite', '@id': 'https://www.imba.live/#website' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'IMBA', item: 'https://www.imba.live' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.imba.live/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.imba.live/blog/${slug}` },
          ],
        },
      })}} />
      {extractFaq(post.content).length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: extractFaq(post.content).map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        })}} />
      )}

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
