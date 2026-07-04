'use client'

import { useState, useMemo } from 'react'
import { Search, X, Globe } from 'lucide-react'
import type { EsimCatalog } from '@/lib/types'

const REGIONS: Record<string, string[]> = {
  'СНГ':              ['AM','AZ','GE','KZ','KG','TJ','TM','UZ','UA','MD','BY'],
  'Азия':             ['CN','JP','KR','TW','HK','MO','IN','PK','BD','LK','NP','TH','VN','ID','MY','PH','SG','MM','KH','LA','BN','MN'],
  'Ближний Восток':   ['TR','AE','IL','SA','QA','KW','BH','OM','JO','LB','IQ'],
  'Африка':           ['EG','ZA','MA','TN','DZ','NG','KE','GH','TZ','UG','ET','SN','CI'],
  'Европа':           ['DE','FR','IT','ES','GB','PT','GR','CY','AT','CH','NL','BE','SE','NO','DK','FI','PL','CZ','HU','RO','BG','HR','RS','SK','SI','LT','LV','EE','IE','IS','LU','MT','AL','BA','ME','MK'],
  'Америка':          ['US','CA','MX','BR','AR','CL','CO','PE','EC','CR','DO','GT','PA','CU'],
  'Океания':          ['AU','NZ','FJ','PG'],
}

const POPULAR = ['TR','TH','AE','EG','DE','JP','CN','US','SG','GE','AM','KZ','IL','IN','ID','GB','FR']

interface Props {
  catalog: EsimCatalog
  buyEsim: (formData: FormData) => Promise<void>
}

export function EsimShop({ catalog, buyEsim }: Props) {
  const [search, setSearch]     = useState('')
  const [region, setRegion]     = useState('Все')
  const [selected, setSelected] = useState<string | null>(null)

  const regionCodes = region === 'Все' ? null : REGIONS[region]

  const filtered = useMemo(() => {
    return Object.entries(catalog).filter(([code, info]) => {
      if (regionCodes && !regionCodes.includes(code)) return false
      if (search) {
        const q = search.toLowerCase()
        return info.country.toLowerCase().includes(q) || code.toLowerCase().includes(q)
      }
      return true
    })
  }, [catalog, search, region, regionCodes])

  const selectedInfo = selected ? catalog[selected] : null

  function selectCountry(code: string) {
    setSelected(prev => prev === code ? null : code)
  }

  return (
    <div className="space-y-5">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" strokeWidth={2.5} />
        <input
          type="text"
          placeholder="Найти страну..."
          value={search}
          onChange={e => { setSearch(e.target.value); setRegion('Все') }}
          className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-ink/10 bg-paper font-semibold text-sm focus:outline-none focus:border-ink/30 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-ink/30 hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Region tabs — hidden during search */}
      {!search && (
        <div className="flex gap-1.5 flex-wrap">
          {['Все', ...Object.keys(REGIONS)].map(r => (
            <button
              key={r}
              onClick={() => { setRegion(r); setSelected(null) }}
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors"
              style={{
                background: region === r ? 'var(--ink)' : 'var(--cream)',
                color:      region === r ? 'var(--paper)' : 'var(--ink)',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Popular chips — main screen only */}
      {region === 'Все' && !search && (
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-2">Популярные</p>
          <div className="flex gap-2 flex-wrap">
            {POPULAR.filter(c => catalog[c]).map(code => {
              const info = catalog[code]
              const isActive = selected === code
              return (
                <button
                  key={code}
                  onClick={() => selectCountry(code)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-bold transition-all"
                  style={{
                    background:  isActive ? 'var(--ink)' : 'var(--paper)',
                    color:       isActive ? 'var(--paper)' : 'var(--ink)',
                    borderColor: isActive ? 'var(--ink)' : 'transparent',
                  }}
                >
                  <span>{info.flag}</span>
                  <span>{info.country}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Package panel — shown when a country is selected */}
      {selected && selectedInfo && (
        <div className="panel" style={{ background: 'var(--violet-100)' }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-4xl">{selectedInfo.flag}</span>
            <div className="flex-1">
              <div className="display text-2xl">{selectedInfo.country}</div>
              <div className="text-xs font-bold text-ink/50">Выбери объём данных</div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="p-1.5 rounded-xl text-ink/30 hover:text-ink hover:bg-ink/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(selectedInfo.prices).map(([gb, price]) => (
              <form key={gb} action={buyEsim} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-paper border-2 border-transparent hover:border-ink/10 transition-colors">
                <input type="hidden" name="country" value={selected} />
                <input type="hidden" name="data_gb"  value={gb} />
                <div>
                  <div className="font-extrabold text-sm">
                    {Number(gb) < 1 ? `${Math.round(Number(gb) * 1000)} МБ` : `${Number(gb)} ГБ`}
                  </div>
                  <div className="text-xs font-bold text-ink/40">
                    {Number(gb) >= 1 ? `~$${(price / Number(gb)).toFixed(2)}/ГБ` : ''}
                  </div>
                </div>
                <button className="pill pill-ink pill-sm">
                  ${price.toFixed(2)}
                </button>
              </form>
            ))}
          </div>
        </div>
      )}

      {/* Country grid */}
      <div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-ink/40">
            <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
            <p className="font-bold">Страна не найдена</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-3">
              {search ? `Результаты: ${filtered.length}` : region === 'Все' ? 'Все страны' : region}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filtered.map(([code, info]) => {
                const cheapest = Math.min(...Object.values(info.prices))
                const isActive  = selected === code
                return (
                  <button
                    key={code}
                    onClick={() => selectCountry(code)}
                    className="text-left rounded-2xl px-3 py-3 border-2 transition-all hover:scale-[1.02]"
                    style={{
                      background:  isActive ? 'var(--ink)'   : 'var(--paper)',
                      color:       isActive ? 'var(--paper)' : 'var(--ink)',
                      borderColor: isActive ? 'var(--ink)'   : 'transparent',
                    }}
                  >
                    <div className="text-2xl mb-1">{info.flag}</div>
                    <div className="font-extrabold text-xs leading-tight">{info.country}</div>
                    <div className="text-xs font-bold mt-1" style={{ opacity: 0.5 }}>
                      от ${cheapest.toFixed(2)}
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
