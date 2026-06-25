'use client'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api-client'
import { getFingerprint } from '@/lib/fingerprint'

interface Props {
  onActivated: () => void
}

function TelegramWidget({ onActivated }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      setLoading(true)
      setError('')
      try {
        const fingerprint = await getFingerprint()
        const res = await api.post<{ ok: boolean; vpn_activated: boolean }>(
          '/v1/me/telegram/link',
          { ...user, fingerprint }
        )
        setDone(true)
        if (res.vpn_activated) setTimeout(onActivated, 1200)
      } catch (e: unknown) {
        setError((e as { message?: string })?.message || 'Ошибка привязки Telegram')
      } finally {
        setLoading(false)
      }
    }

    if (!ref.current || ref.current.querySelector('script')) return
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', 'imba_live_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '20')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    ref.current.appendChild(script)
    return () => { ;(window as any).onTelegramAuth = undefined }
  }, [onActivated])

  if (done) return (
    <p className="text-xs font-bold mt-2" style={{ color: 'var(--green)' }}>
      VPN 7 дней + eSIM 500 МБ активированы!
    </p>
  )

  return (
    <div>
      {loading ? <p className="text-xs text-white/40 font-semibold">Активируем…</p> : <div ref={ref} />}
      {error && <p className="text-xs font-bold text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function VKVerifyButton() {
  const clientId = process.env.NEXT_PUBLIC_VK_CLIENT_ID
  if (!clientId) return null

  async function handleClick() {
    const fingerprint = await getFingerprint()
    const state = encodeURIComponent(`${fingerprint}__link`)
    const redirectUri = encodeURIComponent(window.location.origin + '/api/auth/vk/callback')
    window.location.href =
      `https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=&state=${state}`
  }

  return (
    <button
      onClick={handleClick}
      className="pill pill-paper pill-sm"
      style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.11-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z"/>
      </svg>
      VK
    </button>
  )
}

export function SocialVerify({ onActivated }: Props) {
  const [choice, setChoice] = useState<'telegram' | 'vk' | null>(null)

  return (
    <div className="mt-4 relative z-10">
      <p className="text-xs font-semibold text-white/50 mb-3">
        Подтверди аккаунт → получи 7 дней VPN + eSIM 500 МБ бесплатно
      </p>

      {choice === null && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setChoice('telegram')}
            className="pill pill-sm"
            style={{ background: '#2AABEE', color: '#fff', borderColor: 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.31 14.42l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.843.139z"/>
            </svg>
            Telegram
          </button>
          <VKVerifyButton />
        </div>
      )}

      {choice === 'telegram' && (
        <div>
          <button
            onClick={() => setChoice(null)}
            className="text-xs text-white/30 hover:text-white/60 mb-2 block"
          >
            ← Назад
          </button>
          <TelegramWidget onActivated={onActivated} />
        </div>
      )}
    </div>
  )
}
