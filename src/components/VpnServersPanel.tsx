'use client'

import { useState } from 'react'
import { Zap, Smartphone, Download, Link } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'
import type { VpnServer } from '@/lib/types'

const WDTT_PASSWORD = 'CGFxnHnHXvpb'
const WDTT_VK_HASH = 'WFNnNWAeRPkesAmtYkf40YIh-Zo-jJe_TfNeZ7jrCv8'
const WDTT_SERVER = '38.19.201.176'
const WDTT_LINK = `wdtt://${WDTT_SERVER}:56000:56001:9000:${WDTT_PASSWORD}:${WDTT_VK_HASH}`
const VK_PROXY_IPA = 'https://github.com/anton48/vk-turn-proxy-ios/releases/download/v1.0-build163/VKTurnProxy.ipa'

interface Props {
  servers: VpnServer[]
  vlessMap: Record<string, string>
  serverKey: string | null
  hasActive: boolean
}

export function VpnServersPanel({ servers, vlessMap, serverKey, hasActive }: Props) {
  const [selectedPanel, setSelectedPanel] = useState<'happ' | 'wdtt'>('happ')

  const lisbonPing = servers.find(
    (s) => s.city?.toLowerCase().includes('lisbon') || s.country?.toLowerCase().includes('portugal')
  )?.ping

  return (
    <>
      {/* Happ / WDTT instruction panel */}
      {hasActive && serverKey && (
        <div className="panel" style={{ background: 'var(--paper)' }}>
          {selectedPanel === 'happ' ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-ink/50" strokeWidth={2.5} />
                <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 flex-1">
                  Happ — подписка
                </div>
                <CopyButton text={serverKey} />
              </div>
              <p className="text-sm font-mono break-all text-ink/70 select-all mb-3">{serverKey}</p>
              <ol className="space-y-1 text-sm font-semibold text-ink/70 mb-3">
                <li>1. Скачай <strong>Happ</strong> (iOS / Android)</li>
                <li>2. Открой → «Добавить подписку» → вставь ссылку выше</li>
                <li>3. Подключись к серверу одним нажатием</li>
              </ol>
              <div className="rounded-xl px-3 py-2 text-xs font-bold" style={{ background: 'var(--yellow)', color: 'var(--ink)' }}>
                ⚠️ В настройках сервера в Happ обязательно отключи <strong>Mux</strong> — иначе VPN не будет работать.
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-ink/50" strokeWidth={2.5} />
                <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 flex-1">
                  WhiteList Unblocker — инструкция
                </div>
              </div>
              <ol className="space-y-3 text-sm font-semibold text-ink/70 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-ink/30 w-4 shrink-0">1.</span>
                  <div>
                    Скачай приложение <strong>VK Turn Proxy</strong> для iOS:
                    <a
                      href={VK_PROXY_IPA}
                      className="flex items-center gap-1.5 mt-1.5 pill pill-ink pill-sm w-fit text-xs"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Скачать IPA
                    </a>
                    <p className="text-xs text-ink/40 mt-1">Установи через Sideloadly или AltStore</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-ink/30 w-4 shrink-0">2.</span>
                  <div className="flex-1">
                    <div className="mb-1">В приложении: Settings → Server mode → <strong>SRTP-WRAP-A</strong></div>
                    <div className="mb-1">Затем нажми внизу <strong>«Import from connection link»</strong> и вставь:</div>
                    <div className="flex items-center gap-2 mt-2 rounded-xl px-3 py-2" style={{ background: 'var(--blue-100)' }}>
                      <p className="text-xs font-mono break-all text-ink/70 flex-1 select-all">{WDTT_LINK}</p>
                      <CopyButton text={WDTT_LINK} />
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-ink/30 w-4 shrink-0">3.</span>
                  <span>Нажми <strong>Connect</strong> — работает на всех операторах РФ включая Tele2</span>
                </li>
              </ol>
              <div className="rounded-xl px-3 py-2 text-xs font-bold" style={{ background: 'var(--green-100)', color: 'var(--ink)' }}>
                ✓ Трафик идёт через VK — оператор видит звонок ВКонтакте, не VPN
              </div>
            </>
          )}
        </div>
      )}

      {/* Server grid */}
      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">Серверы</h2>
        <p className="font-semibold text-ink/60 mb-5 text-sm">
          {hasActive ? 'Входят в подписку' : '5 локаций включены в тариф'}
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {servers.map((s) => {
            const vlessUri = s.host ? vlessMap[s.host] : undefined
            return (
              <div
                key={s.id}
                className="panel"
                style={{ background: 'var(--paper)' }}
                onClick={() => setSelectedPanel('happ')}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{s.flag}</span>
                  <div>
                    <div className="display text-lg leading-tight">{s.city}</div>
                    <div className="text-xs font-bold text-ink/40">{s.country}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {s.ping ? (
                    <span className="chip" style={{ background: 'var(--green-100)' }}>
                      <Zap className="w-3 h-3" strokeWidth={3} /> ~{s.ping} мс
                    </span>
                  ) : <span />}
                  {hasActive && vlessUri ? (
                    <CopyButton text={vlessUri} label="v2box" className="pill pill-paper pill-sm text-xs" />
                  ) : (
                    <span className="text-xs font-bold text-ink/20">—</span>
                  )}
                </div>
              </div>
            )
          })}

          {/* WhiteList Unblocker special card */}
          <button
            onClick={() => setSelectedPanel('wdtt')}
            className="panel text-left transition-all"
            style={{
              background: selectedPanel === 'wdtt' ? 'var(--blue-100)' : 'var(--paper)',
              outline: selectedPanel === 'wdtt' ? '2px solid var(--ink)' : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🛡️</span>
              <div>
                <div className="display text-lg leading-tight">WhiteList Unblocker</div>
                <div className="text-xs font-bold text-ink/40">Lisbon · Tele2 / МТС</div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              {lisbonPing ? (
                <span className="chip" style={{ background: 'var(--green-100)' }}>
                  <Zap className="w-3 h-3" strokeWidth={3} /> ~{lisbonPing} мс
                </span>
              ) : <span />}
              <span className="chip text-xs" style={{ background: 'var(--yellow)' }}>
                <Link className="w-3 h-3" strokeWidth={2.5} /> VK TURN
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
