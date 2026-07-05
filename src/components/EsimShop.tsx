'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, X, ChevronRight } from 'lucide-react'
import type { EsimCatalog } from '@/lib/types'

const POPULAR = ['TR','TH','AE','EG','DE','JP','CN','US','SG','GE','AM','KZ','IL','IN','ID','GB','FR','IT','ES','KR']

interface Props {
  catalog: EsimCatalog
  buyEsim: (formData: FormData) => Promise<void>
}

export function EsimShop({ catalog, buyEsim }: Props) {
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [open, setOpen]         = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropRef  = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return Object.entries(catalog)
      .filter(([code, info]) =>
        info.flag !== '🌐' &&
        info.country !== code &&
        (info.country.toLowerCase().includes(q) || code.toLowerCase() === q)
      )
      .slice(0, 8)
  }, [catalog, query])

  const popular = POPULAR.filter(c => catalog[c] && catalog[c].flag !== '🌐')
  const selectedInfo = selected ? catalog[selected] : null

  function pick(code: string) {
    setSelected(code)
    setQuery('')
    setOpen(false)
  }

  function clear() {
    setSelected(null)
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-6">

      {/* ── Combobox ─────────────────────────────────────────── */}
      <div className="relative">
        <div
          className="flex items-center gap-3 rounded-2xl border-2 transition-colors px-4 py-3"
          style={{ borderColor: open || query ? 'var(--ink)' : 'var(--ink)', background: 'var(--paper)' }}
        >
          {selectedInfo ? (
            <span className="text-2xl leading-none">{selectedInfo.flag}</span>
          ) : (
            <Search className="w-5 h-5 text-ink/40 shrink-0" strokeWidth={2.5} />
          )}

          {selectedInfo ? (
            <span className="flex-1 font-extrabold text-base">{selectedInfo.country}</span>
          ) : (
            <input
              ref={inputRef}
              type="text"
              placeholder="Введи страну назначения..."
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              className="flex-1 bg-transparent font-semibold text-base focus:outline-none placeholder:text-ink/30"
            />
          )}

          {(query || selected) && (
            <button onClick={clear} className="text-ink/30 hover:text-ink transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div
            ref={dropRef}
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl border-2 border-ink/10 shadow-xl z-50 overflow-hidden"
            style={{ background: 'var(--paper)' }}
          >
            {results.map(([code, info]) => (
              <button
                key={code}
                onMouseDown={() => pick(code)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-ink/5 transition-colors text-left border-b border-ink/5 last:border-0"
              >
                <span className="text-2xl">{info.flag}</span>
                <span className="font-extrabold text-sm">{info.country}</span>
                <span className="ml-auto text-xs font-bold text-ink/40">
                  от ${Math.min(...Object.values(info.prices)).toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Packages ─────────────────────────────────────────── */}
      {selected && selectedInfo && (
        <div className="panel" style={{ background: 'var(--violet-100)' }}>
          <p className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-4">
            Пакеты данных — {selectedInfo.country}
          </p>
          <div className="space-y-2">
            {Object.entries(selectedInfo.prices).map(([gb, price]) => {
              const gbNum = Number(gb)
              const label = gbNum < 1 ? `${Math.round(gbNum * 1000)} МБ` : `${gbNum} ГБ`
              const perGb = gbNum >= 1 ? `$${(price / gbNum).toFixed(2)}/ГБ` : ''
              return (
                <form
                  key={gb}
                  action={buyEsim}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-paper hover:bg-ink/5 transition-colors cursor-pointer"
                >
                  <input type="hidden" name="country"  value={selected} />
                  <input type="hidden" name="data_gb"  value={gb} />
                  <div className="flex-1">
                    <div className="font-extrabold text-sm">{label}</div>
                    {perGb && <div className="text-xs font-bold text-ink/40">{perGb}</div>}
                  </div>
                  <span className="font-extrabold text-sm">${price.toFixed(2)}</span>
                  <button type="submit" className="pill pill-ink pill-sm">
                    Купить
                  </button>
                </form>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Popular ──────────────────────────────────────────── */}
      {!selected && (
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-3">
            Популярные направления
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {popular.map(code => {
              const info = catalog[code]
              if (!info) return null
              const cheapest = Math.min(...Object.values(info.prices))
              return (
                <button
                  key={code}
                  onClick={() => pick(code)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-transparent hover:border-ink/10 transition-all text-left"
                  style={{ background: 'var(--paper)' }}
                >
                  <span className="text-2xl shrink-0">{info.flag}</span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm truncate">{info.country}</div>
                    <div className="text-xs font-bold text-ink/40">от ${cheapest.toFixed(2)}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
