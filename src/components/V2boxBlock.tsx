import { Monitor } from 'lucide-react'
import { CopyButton } from '@/components/CopyButton'

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
  const vlessUri = await fetchVlessUri(subUrl)

  return (
    <div className="rounded-2xl p-4 border-2 border-ink" style={{ background: 'var(--paper)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Monitor className="w-4 h-4 text-ink/50" strokeWidth={2.5} />
        <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50 flex-1">
          v2box — прямой конфиг
        </div>
        {vlessUri && <CopyButton text={vlessUri} />}
      </div>

      {vlessUri ? (
        <>
          <p className="text-sm font-mono break-all text-ink/70 select-all mb-3">
            {vlessUri}
          </p>
          <ol className="space-y-1 text-sm font-semibold text-ink/70">
            <li>1. Скачай <strong>v2box</strong> (iOS / Android / Desktop)</li>
            <li>2. Открой → «+» → «Импорт из буфера» — или вставь ссылку выше вручную</li>
            <li>3. Подключись к <strong>🇵🇹 Лиссабон</strong></li>
          </ol>
        </>
      ) : (
        <>
          <p className="text-sm font-mono break-all text-ink/70 select-all mb-3">
            {subUrl}
          </p>
          <ol className="space-y-1 text-sm font-semibold text-ink/70">
            <li>1. Скачай <strong>v2box</strong> (iOS / Android / Desktop)</li>
            <li>2. Открой → «Добавить подписку» → вставь ссылку выше</li>
            <li>3. Выбери сервер <strong>🇵🇹 Лиссабон</strong> (не Happ)</li>
          </ol>
        </>
      )}
    </div>
  )
}
