import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { posts, getPost } from '@/lib/posts'

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} — IMBA`,
    description: post.excerpt,
  }
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
        items={['eSIM В 190 СТРАНАХ', 'VPN БЕЗ ЛОГОВ', 'ВИРТУАЛЬНАЯ КАРТА', 'ОПЛАТА ВЕЗДЕ', 'БЕЗ ГРАНИЦ']}
      />

      {/* Nav */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--paper)' }}>
        <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
          <Link href="/"><Logo size="lg" /></Link>
          <div className="hidden md:flex items-center gap-7 text-sm uppercase flex-1 justify-center" style={{ fontFamily: 'var(--font-display), Impact, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }}>
            <Link href="/#services" className="hover:opacity-60 transition-opacity">Сервисы</Link>
            <Link href="/#pricing" className="hover:opacity-60 transition-opacity">Тарифы</Link>
            <Link href="/#faq" className="hover:opacity-60 transition-opacity">Вопросы</Link>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <Link href="/auth/login" className="pill pill-paper pill-sm text-xs md:text-sm">Войти</Link>
            <Link href="/auth/register" className="pill pill-ink pill-sm text-xs md:text-sm">Открыть IMBA</Link>
          </div>
        </nav>
      </div>

      {/* Article */}
      <div className="rounded-xl flex-1" style={{ background: 'var(--paper)' }}>
        <div className="max-w-2xl mx-auto px-5 md:px-8 py-10 md:py-16">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-ink/50 hover:text-ink transition-colors mb-8">
            ← Все статьи
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="chip" style={{ background: post.categoryColor, borderColor: 'var(--ink)' }}>
              {post.category}
            </span>
            <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
            <span className="text-xs text-ink/40 font-semibold">{post.readTime} чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-5">{post.title}</h1>
          <p className="text-base text-ink/60 leading-relaxed mb-8 pb-8 border-b border-ink/10">{post.excerpt}</p>

          {/* Content */}
          <div>{renderContent(post.content)}</div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl p-6 md:p-8 text-center" style={{ background: 'var(--yellow)', border: '2px solid var(--ink)' }}>
            <p className="font-black text-xl mb-2">Попробуй IMBA бесплатно</p>
            <p className="text-sm text-ink/70 mb-5">eSIM + VPN + виртуальная карта в одном приложении</p>
            <Link href="/auth/register" className="pill pill-ink">Открыть IMBA</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/privacy-policy" className="hover:opacity-60">Конфиденциальность</Link>
            <Link href="/terms" className="hover:opacity-60">Условия</Link>
          </div>
        </div>
        <div className="px-5 md:px-8 pb-6 border-t border-ink/10 pt-4">
          <p className="text-xs text-ink/40 text-center leading-relaxed">
            IMBA SRL · Reg. No. 3-102-942736 · Registered 25.08.2025 · Costa Rica, San José, Mata Redonda, Sabana Oeste, Avenida Doce Calle Noventa, ERP Lawyers Law Firm
          </p>
        </div>
      </footer>
    </div>
  )
}
