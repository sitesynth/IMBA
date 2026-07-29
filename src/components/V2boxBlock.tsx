import { Monitor } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'
import { getLocale } from '@/lib/i18n'
import { t } from '@/lib/t'

async function fetchVlessUri(subUrl: string): Promise<string | null> {
  try {
    const res = await fetch(subUrl, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'v2rayNG/1.8.0' },
    })
    if (!res.ok) return null
    const b64 = await res.text()
    const decoded = Buffer.from(b64.trim(), 'base64').toString('utf-8')
    const lines = decoded.split('\n').map((l) => l.trim()).filter(Boolean)
    // Pick TCP+Vision line (has flow=xtls-rprx-vision)
    const visionLine = lines.find((l) => l.startsWith('vless://') && l.includes('flow=xtls-rprx-vision'))
    return visionLine ?? lines.find((l) => l.startsWith('vless://')) ?? null
  } catch {
    return null
  }
}

export async function V2boxBlock({ subUrl }: { subUrl: string }) {
  const locale = await getLocale()
  const vlessUri = await fetchVlessUri(subUrl)

  return (
    <div className="rounded-2xl p-4 border-2 border-ink" style={{ background: 'var(--paper)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Monitor className="w-4 h-4 text-ink/50" strokeWidth={2.5} />
        <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 flex-1">
          {t('v2box.heading', locale)}
        </div>
        {vlessUri && <CopyButton text={vlessUri} />}
      </div>

      {vlessUri ? (
        <>
          <p className="text-sm font-mono break-all text-ink/70 select-all mb-3">
            {vlessUri}
          </p>
          <ol className="space-y-1 text-sm font-semibold text-ink/70">
            <li dangerouslySetInnerHTML={{ __html: t('v2box.step1', locale) }} />
            <li dangerouslySetInnerHTML={{ __html: t('v2box.step2_vless', locale) }} />
            <li dangerouslySetInnerHTML={{ __html: t('v2box.step3_vless', locale) }} />
          </ol>
        </>
      ) : (
        <>
          <p className="text-sm font-mono break-all text-ink/70 select-all mb-3">
            {subUrl}
          </p>
          <ol className="space-y-1 text-sm font-semibold text-ink/70">
            <li dangerouslySetInnerHTML={{ __html: t('v2box.step1', locale) }} />
            <li dangerouslySetInnerHTML={{ __html: t('v2box.step2_sub', locale) }} />
            <li dangerouslySetInnerHTML={{ __html: t('v2box.step3_sub', locale) }} />
          </ol>
        </>
      )}
    </div>
  )
}
