'use client'
import { useState } from 'react'

type FaqItem = { q: string; a: string; color: string }

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const [wobbling, setWobbling] = useState<number | null>(null)

  function toggle(i: number) {
    const opening = open !== i
    setOpen(opening ? i : null)
    if (opening) {
      setWobbling(i)
      setTimeout(() => setWobbling(null), 520)
    }
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-2xl border-2 border-ink overflow-hidden${wobbling === i ? ' wobble' : ''}`}
          style={{ background: item.color }}
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between px-4 md:px-6 py-4 md:py-5 cursor-pointer select-none text-left"
          >
            <span className="display text-sm md:text-xl" style={{ textWrap: 'wrap' as never }}>{item.q}</span>
            <span
              className="text-xl md:text-2xl font-black flex-shrink-0 ml-3 transition-transform duration-300"
              style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
            >
              +
            </span>
          </button>
          <div className={`faq-body${open === i ? ' open' : ''}`}>
            <div>
              <p className="px-4 md:px-6 pb-4 md:pb-6 font-semibold text-ink/75 leading-relaxed text-sm md:text-base">
                {item.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
