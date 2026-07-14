'use client'

import { useState } from 'react'
import Link from 'next/link'

export type BlogListPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  date: string
  readTime: string
  cover?: { src: string; alt: string }
}

const FILTERS: { key: string; label: string; match: string[] }[] = [
  { key: 'all', label: 'Все', match: [] },
  { key: 'vpn', label: 'VPN', match: ['VPN'] },
  { key: 'esim', label: 'eSIM', match: ['eSIM'] },
  { key: 'card', label: 'Карта', match: ['Карта'] },
]

const AUTHOR = 'Сергей Карпов'

export function BlogList({ posts }: { posts: BlogListPost[] }) {
  const [active, setActive] = useState('all')

  const activeFilter = FILTERS.find((f) => f.key === active) ?? FILTERS[0]
  const visible = active === 'all'
    ? posts
    : posts.filter((p) => activeFilter.match.includes(p.category))

  return (
    <div className="max-w-7xl mx-auto">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className="chip transition-colors"
            style={
              active === f.key
                ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }
                : { background: 'var(--paper)', borderColor: 'var(--ink)' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {visible.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <article className="panel h-full flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-200">
              {post.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover.src}
                  alt={post.cover.alt}
                  className="w-full rounded-lg border-2 border-ink/10"
                  loading="lazy"
                />
              )}
              <div className="flex items-center justify-between">
                <span className="chip" style={{ background: post.categoryColor, borderColor: 'var(--ink)' }}>
                  {post.category}
                </span>
                <span className="text-xs text-ink/40 font-semibold">{post.readTime} чтения</span>
              </div>
              <h2 className="text-lg font-black leading-snug group-hover:opacity-70 transition-opacity">
                {post.title}
              </h2>
              <p className="text-sm text-ink/60 leading-relaxed flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                <span className="text-xs text-ink/40 font-semibold">{AUTHOR} · {post.date}</span>
                <span className="text-sm font-black text-blue group-hover:underline">Читать →</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
