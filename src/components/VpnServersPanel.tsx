'use client'

import { useState } from 'react'
import { Zap, Smartphone, Download, Link, Terminal, Moon } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'
import type { VpnServer } from '@/lib/types'
import { useLocale } from '@/lib/useLocale'
import { t, type TKey } from '@/lib/t'
import type { Locale } from '@/lib/i18n-shared'

// Fallback shared credentials — used only for users without a per-user link (legacy/trial)
const WDTT_FALLBACK_PASSWORD = 'CGFxnHnHXvpb'
const WDTT_VK_HASH = 'WFNnNWAeRPkesAmtYkf40YIh-Zo-jJe_TfNeZ7jrCv8'
const WDTT_SERVER = '38.19.201.176'
const WDTT_FALLBACK_LINK = `wdtt://${WDTT_SERVER}:56000:56001:9000:${WDTT_FALLBACK_PASSWORD}:${WDTT_VK_HASH}`

// Extract password from a wdtt:// link (format: wdtt://host:port:wgport:apiport:password:hash)
function wdttPassword(link: string): string {
  const parts = link.split(':')
  return parts.length >= 6 ? parts[5] : WDTT_FALLBACK_PASSWORD
}

const URLS = {
  testflight: 'https://testflight.apple.com/join/ANm6cmDv',
  apk:     'https://github.com/SpaceNeuroX/proxy-turn-vk-android/releases/download/v1.2.5/app-universal-release.apk',
  win:     'https://github.com/IGOR7276/proxy-turn-vk-windows/releases/download/v2.1.3/wdtt.exe',
  macArm:  'https://github.com/cacggghp/vk-turn-proxy/releases/download/v1.8.3/client-darwin-arm64',
  macX64:  'https://github.com/cacggghp/vk-turn-proxy/releases/download/v1.8.3/client-darwin-amd64',
  linux:   'https://github.com/luminescq/PWDTT/releases/download/v1.2/pwdtt-linux-amd64',
  // Happ — прямые ссылки с GitHub Releases (/latest/ всегда актуальная версия)
  happStable:      'https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk',
  happBeta:        'https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ_beta.apk',
  happMirror:      'https://files-hub.com/download/android/latest?arch=universal',
  happIosStore:    'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215',
  happIosTF:       'https://testflight.apple.com/join/XMls6Ckd',
  happWinX64:      'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe',
  happWinMirror:   'https://files-hub.com/download/windows/latest?arch=x64',
  happMac:         'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.macOS.universal.dmg',
  happMacStore:    'https://apps.apple.com/us/app/happ-proxy-utility/id6504287215?platform=mac',
  happMacMirror:   'https://files-hub.com/download/macos/latest?arch=universal',
  happLinuxDeb:    'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.deb',
  happLinuxDebArm: 'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.arm64.deb',
  happLinuxRpm:    'https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.rpm',
  happGuide:       '/blog/happ-setup',
}

type Platform = 'android' | 'ios' | 'windows' | 'macos' | 'linux'

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'android', label: 'Android' },
  { id: 'ios',     label: 'iOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos',   label: 'macOS' },
  { id: 'linux',   label: 'Linux' },
]

interface Props {
  servers: VpnServer[]
  vlessMap: Record<string, string>
  serverKey: string | null
  hasActive: boolean
  wdttLink?: string | null
}

function WdttInstructions({ platform, link, locale }: { platform: Platform; link: string; locale: Locale }) {
  const password = wdttPassword(link)
  const macCmd = `sudo ./client-darwin-arm64 -server ${WDTT_SERVER}:56000 -wg-port 56001 -password ${password} -hash ${WDTT_VK_HASH}`
  if (platform === 'android') return (
    <ol className="space-y-3 text-sm font-semibold text-ink/70 mb-4">
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">1.</span>
        <div>
          <span dangerouslySetInnerHTML={{ __html: t('wdtt.download_android', locale) }} />
          <a href={URLS.apk} className="flex items-center gap-1.5 mt-1.5 pill pill-ink pill-sm w-fit text-xs">
            <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> {t('wdtt.download_apk', locale)}
          </a>
          <p className="text-xs text-ink/40 mt-1">{t('wdtt.allow_unknown', locale)}</p>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">2.</span>
        <div className="flex-1">
          <div className="mb-1" dangerouslySetInnerHTML={{ __html: t('wdtt.import_link', locale) }} />
          <div className="flex items-center gap-2 mt-2 rounded-xl px-3 py-2" style={{ background: 'var(--blue-100)' }}>
            <p className="text-xs font-mono break-all text-ink/70 flex-1 select-all">{link}</p>
            <CopyButton text={link} />
          </div>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">3.</span>
        <span dangerouslySetInnerHTML={{ __html: t('wdtt.tap_connect', locale) }} />
      </li>
    </ol>
  )

  if (platform === 'ios') return (
    <ol className="space-y-3 text-sm font-semibold text-ink/70 mb-4">
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">1.</span>
        <div>
          <span dangerouslySetInnerHTML={{ __html: t('wdtt.install_ios', locale) }} />
          <a href={URLS.testflight} className="flex items-center gap-1.5 mt-1.5 pill pill-ink pill-sm w-fit text-xs">
            <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> {t('wdtt.open_testflight', locale)}
          </a>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">2.</span>
        <div className="flex-1">
          <div className="mb-1">Settings → Server mode → <strong>SRTP-WRAP-A</strong></div>
          <div className="mb-1" dangerouslySetInnerHTML={{ __html: t('wdtt.ios_import', locale) }} />
          <div className="flex items-center gap-2 mt-2 rounded-xl px-3 py-2" style={{ background: 'var(--blue-100)' }}>
            <p className="text-xs font-mono break-all text-ink/70 flex-1 select-all">{link}</p>
            <CopyButton text={link} />
          </div>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">3.</span>
        <span dangerouslySetInnerHTML={{ __html: t('wdtt.tap_connect_en', locale) }} />
      </li>
    </ol>
  )

  if (platform === 'windows') return (
    <ol className="space-y-3 text-sm font-semibold text-ink/70 mb-4">
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">1.</span>
        <div>
          <span dangerouslySetInnerHTML={{ __html: t('wdtt.download_win', locale) }} />
          <a href={URLS.win} className="flex items-center gap-1.5 mt-1.5 pill pill-ink pill-sm w-fit text-xs">
            <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> {t('wdtt.download_exe', locale)}
          </a>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">2.</span>
        <div className="flex-1">
          <div className="mb-1" dangerouslySetInnerHTML={{ __html: t('wdtt.paste_link_win', locale) }} />
          <div className="flex items-center gap-2 mt-2 rounded-xl px-3 py-2" style={{ background: 'var(--blue-100)' }}>
            <p className="text-xs font-mono break-all text-ink/70 flex-1 select-all">{link}</p>
            <CopyButton text={link} />
          </div>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">3.</span>
        <span dangerouslySetInnerHTML={{ __html: t('wdtt.tap_connect_en', locale) }} />
      </li>
    </ol>
  )

  if (platform === 'macos') return (
    <ol className="space-y-3 text-sm font-semibold text-ink/70 mb-4">
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">1.</span>
        <div>
          {t('wdtt.download_macos', locale)}
          <div className="flex gap-2 mt-1.5 flex-wrap">
            <a href="https://imba.run/imba-vk-proxy-installer.pkg" className="flex items-center gap-1.5 pill pill-ink pill-sm w-fit text-xs">
              <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> Installer .pkg (Universal)
            </a>
            <a href={URLS.macArm} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
              <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> Apple Silicon
            </a>
            <a href={URLS.macX64} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
              <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> Intel
            </a>
          </div>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">2.</span>
        <div className="flex-1">
          <div className="mb-2">{t('wdtt.open_terminal', locale)}</div>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'var(--blue-100)' }}>
            <Terminal className="w-3.5 h-3.5 text-ink/40 shrink-0" strokeWidth={2} />
            <p className="text-xs font-mono break-all text-ink/70 flex-1 select-all">{macCmd}</p>
            <CopyButton text={macCmd} />
          </div>
          <p className="text-xs text-ink/40 mt-1">{t('wdtt.sudo_note', locale)}</p>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">3.</span>
        <span>{t('wdtt.allow_vpn_macos', locale)}</span>
      </li>
    </ol>
  )

  // linux
  return (
    <ol className="space-y-3 text-sm font-semibold text-ink/70 mb-4">
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">1.</span>
        <div>
          <span dangerouslySetInnerHTML={{ __html: t('wdtt.download_linux', locale) }} />
          <a href={URLS.linux} className="flex items-center gap-1.5 mt-1.5 pill pill-ink pill-sm w-fit text-xs">
            <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> {t('wdtt.download_amd64', locale)}
          </a>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">2.</span>
        <div className="flex-1">
          <div className="mb-2" dangerouslySetInnerHTML={{ __html: t('wdtt.chmod_run', locale) }} />
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-2" style={{ background: 'var(--blue-100)' }}>
            <Terminal className="w-3.5 h-3.5 text-ink/40 shrink-0" strokeWidth={2} />
            <p className="text-xs font-mono text-ink/70 flex-1 select-all">chmod +x pwdtt-linux-amd64 && sudo ./pwdtt-linux-amd64</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'var(--blue-100)' }}>
            <p className="text-xs font-mono break-all text-ink/70 flex-1 select-all">{link}</p>
            <CopyButton text={link} />
          </div>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-extrabold text-ink/30 w-4 shrink-0">3.</span>
        <span dangerouslySetInnerHTML={{ __html: t('wdtt.connect_tray', locale) }} />
      </li>
    </ol>
  )
}

export function VpnServersPanel({ servers, vlessMap, serverKey, hasActive, wdttLink }: Props) {
  const locale = useLocale()
  const [selectedPanel, setSelectedPanel] = useState<'happ' | 'wdtt'>('happ')
  const [platform, setPlatform] = useState<Platform>('android')
  const activeWdttLink = wdttLink ?? WDTT_FALLBACK_LINK

  const lisbonPing = servers.find((s) => {
    const city = s.city?.toLowerCase() ?? ''
    const country = s.country?.toLowerCase() ?? ''
    return city.includes('lisbon') || city.includes('лиссабон') || country.includes('portugal') || country === 'pt'
  })?.ping

  return (
    <>
      {/* WDTT panel — only when subscribed */}
      {hasActive && serverKey && selectedPanel === 'wdtt' && (
        <div className="panel" style={{ background: 'var(--paper)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-4 h-4 text-ink/50" strokeWidth={2.5} />
            <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 flex-1">
              {t('vpn.wl_heading', locale)}
            </div>
          </div>

          {/* Platform tabs */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className="px-3 py-1 rounded-lg text-xs font-extrabold transition-colors"
                style={{
                  background: platform === p.id ? 'var(--ink)' : 'var(--blue-100)',
                  color: platform === p.id ? 'var(--paper)' : 'var(--ink)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <WdttInstructions platform={platform} link={activeWdttLink} locale={locale} />

          <div className="rounded-xl px-3 py-2 text-xs font-bold" style={{ background: 'var(--green-100)', color: 'var(--ink)' }}>
            {t('vpn.wl_desc', locale)}
          </div>
        </div>
      )}

      {/* Happ instruction panel — only when subscribed */}
      {hasActive && serverKey && selectedPanel === 'happ' && (
        <div className="panel" style={{ background: 'var(--paper)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-ink/50" strokeWidth={2.5} />
                <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 flex-1">
                  {t('vpn.happ_heading', locale)}
                </div>
                <CopyButton text={serverKey} />
              </div>
              <p className="text-sm font-mono break-all text-ink/70 select-all mb-4">{serverKey}</p>

              <ol className="space-y-4 text-sm font-semibold text-ink/70 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-ink/30 w-4 shrink-0">1.</span>
                  <div className="flex-1">
                    <div className="mb-3"><span dangerouslySetInnerHTML={{ __html: t('vpn.download_happ', locale) }} /></div>

                    {/* Android */}
                    <div className="mb-3">
                      <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-1.5">Android</div>
                      <div className="flex gap-2 flex-wrap">
                        <a href={URLS.happStable} className="flex items-center gap-1.5 pill pill-ink pill-sm w-fit text-xs">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> APK Stable
                        </a>
                        <a href={URLS.happBeta} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> APK Beta
                        </a>
                        <a href={URLS.happMirror} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> {t('vpn.mirror', locale)}
                        </a>
                      </div>
                    </div>

                    {/* iOS */}
                    <div className="mb-3">
                      <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-1.5">iOS</div>
                      <div className="flex gap-2 flex-wrap">
                        <a href={URLS.happIosStore} className="flex items-center gap-1.5 pill pill-ink pill-sm w-fit text-xs">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> App Store
                        </a>
                        <a href={URLS.happIosTF} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> TestFlight (Beta)
                        </a>
                      </div>
                    </div>

                    {/* Windows */}
                    <div className="mb-3">
                      <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-1.5">Windows</div>
                      <div className="flex gap-2 flex-wrap">
                        <a href={URLS.happWinX64} className="flex items-center gap-1.5 pill pill-ink pill-sm w-fit text-xs">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> Setup x64 .exe
                        </a>
                        <a href={URLS.happWinMirror} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> {t('vpn.mirror', locale)}
                        </a>
                      </div>
                    </div>

                    {/* macOS */}
                    <div className="mb-3">
                      <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-1.5">macOS</div>
                      <div className="flex gap-2 flex-wrap">
                        <a href={URLS.happMac} className="flex items-center gap-1.5 pill pill-ink pill-sm w-fit text-xs">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> .dmg (Universal)
                        </a>
                        <a href={URLS.happMacStore} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> Mac App Store
                        </a>
                        <a href={URLS.happMacMirror} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> {t('vpn.mirror', locale)}
                        </a>
                      </div>
                    </div>

                    {/* Linux */}
                    <div className="mb-2">
                      <div className="text-xs font-extrabold uppercase tracking-widest text-ink/40 mb-1.5">Linux</div>
                      <div className="flex gap-2 flex-wrap">
                        <a href={URLS.happLinuxDeb} className="flex items-center gap-1.5 pill pill-ink pill-sm w-fit text-xs">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> .deb x64
                        </a>
                        <a href={URLS.happLinuxDebArm} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> .deb arm64
                        </a>
                        <a href={URLS.happLinuxRpm} className="flex items-center gap-1.5 pill pill-paper pill-sm w-fit text-xs border-2 border-ink/20">
                          <Download className="w-3.5 h-3.5" strokeWidth={2.5} /> .rpm x64
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-ink/40 mt-2">
                      {t('vpn.not_in_store', locale)}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-ink/30 w-4 shrink-0">2.</span>
                  <div dangerouslySetInnerHTML={{ __html: t('vpn.happ_step1', locale) }} />
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-ink/30 w-4 shrink-0">3.</span>
                  <div>{t('vpn.happ_mux', locale)}</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-ink/30 w-4 shrink-0">4.</span>
                  <div>{t('vpn.happ_connect', locale)}</div>
                </li>
              </ol>

              <div className="rounded-xl px-3 py-2 text-xs font-bold mb-3" style={{ background: 'var(--yellow)', color: 'var(--ink)' }}>
                {t('vpn.happ_mux_warning', locale)}
              </div>
              <a href={URLS.happGuide} className="flex items-center gap-1.5 text-xs font-bold text-ink/50 hover:text-ink transition-colors">
                <Link className="w-3.5 h-3.5" strokeWidth={2.5} /> {t('vpn.happ_full_guide', locale)}
              </a>
        </div>
      )}

      {/* Server grid */}
      <div>
        <h2 className="display text-2xl md:text-3xl mb-1">{t('vpn.servers', locale)}</h2>
        <p className="font-semibold text-ink/60 mb-5 text-sm">
          {hasActive ? t('vpn.servers_included', locale) : t('vpn.servers_count', locale)}
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
                <div className="flex items-center gap-2">
                  {s.ping ? (
                    <span className="chip whitespace-nowrap" style={{ background: 'var(--green-100)' }}>
                      <Zap className="w-3 h-3 shrink-0" strokeWidth={3} /> ~{s.ping} {t('vpn.ms', locale)}
                    </span>
                  ) : (
                    <span className="chip whitespace-nowrap" style={{ background: '#d0d0d0' }}>
                      <Moon className="w-3 h-3 shrink-0" strokeWidth={2.5} /> -/-
                    </span>
                  )}
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
            onClick={hasActive ? () => setSelectedPanel('wdtt') : undefined}
            className={[
              'panel text-left transition-all',
              hasActive
                ? 'cursor-pointer active:scale-[0.97] active:opacity-80'
                : 'cursor-default pointer-events-none',
            ].join(' ')}
            style={{
              background: hasActive && selectedPanel === 'wdtt' ? 'var(--blue-100)' : 'var(--paper)',
              outline: hasActive && selectedPanel === 'wdtt' ? '2px solid var(--ink)' : 'none',
              opacity: !hasActive ? 0.5 : 1,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <svg width="36" height="36" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M415.936 25.389c-17.463-.058-35.658 4.808-50.815 10.826l50.928 50.928 41.172-48.047c-11.557-9.906-26.143-13.657-41.285-13.707zm55.418 27.502l-48.23 41.326 51.103 51.103c11.281-28.396 18.536-67.452-2.873-92.43zm-114.8.213l-43.841 43.841 100.41 100.409 43.842-43.84zm17.29 27.115c9.341 9.341 9.341 24.486 0 33.828-9.342 9.341-24.487 9.341-33.828 0-9.342-9.342-9.342-24.487 0-33.828 10.59-9.11 24.611-8.938 33.828 0zm-80.668 22.644l-69.08 86.221c15.303 4.928 26.372 18.45 28.724 33.055l88.1-71.532zm136.918 33.68c9.373 9.373 9.373 24.569 0 33.941-9.373 9.373-24.569 9.373-33.942 0-9.372-9.372-9.372-24.568 0-33.941 10.715-9.097 24.617-9.054 33.942 0zm-70.436 32.803l-71.976 88.65c16.633 3.768 28.471 13.39 33.158 28.817l86.765-69.52zm-163.406 42.713c-9.016 9.016-9.016 23.36 0 32.377 9.016 9.015 23.361 9.015 32.377 0 9.016-9.016 9.016-23.36 0-32.375v-.002c-9.809-8.75-23.442-8.671-32.377 0zm-24.016 9.04L52.476 251.08l6.442 59.047c20.232 3.595 35.409-17.644 50.693-20.494 28.31-2.428 43.494-4.775 67.022.226 2.206-11.59 5.89-20.735 13.203-27.543-13.056-8.801-19.628-28.288-17.6-41.216zM34.473 252.019L18 253.039v62.883l23.021-3.881zm166.74 24.31c-9.058 9.058-9.058 23.47 0 32.527 9.057 9.058 23.468 9.058 32.525 0 9.058-9.057 9.058-23.47 0-32.527-10.288-8.909-23.711-8.552-32.525 0zm64.096 5.893c-9.058 9.057-9.058 23.47 0 32.527 9.057 9.057 23.47 9.057 32.527 0 9.057-9.057 9.057-23.47 0-32.527-10.288-8.91-23.713-8.553-32.527 0zm-18.112 38.593c-7.348 7.112-19.122 12.13-27.67 12.668 5.601 25.01 2.157 51.853.426 68.239-13.19 19.719-16.353 29.026-20.57 50.89l59.304 6.47 30.094-120.294c-18.423.36-32.556-4.15-41.584-17.973zm-49.693 149.698L193.543 494h63.135l1.049-16.918z"/>
              </svg>
              <div>
                <div className="display text-lg leading-tight">WhiteList Unblocker</div>
                <div className="text-xs font-bold text-ink/40">{locale === 'ru' ? 'Lisbon · Tele2 / МТС' : 'Lisbon · Tele2 / MTS'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lisbonPing && (
                <span className="chip text-xs whitespace-nowrap" style={{ background: 'var(--green-100)' }}>
                  <Zap className="w-3 h-3 shrink-0" strokeWidth={3} /> ~{lisbonPing} {t('vpn.ms', locale)}
                </span>
              )}
              <span className="pill pill-yellow pill-sm whitespace-nowrap">
                <Link className="w-3 h-3 shrink-0" strokeWidth={2.5} /> vkturn
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
