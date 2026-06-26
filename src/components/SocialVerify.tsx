'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getFingerprint } from '@/lib/fingerprint'
import { VKIDButton } from './VKIDButton'

const VK_GROUP_URL = 'https://vk.com/club239876488'
const TG_CHANNEL_URL = 'https://t.me/imba_live'

interface Props {
  onActivated: () => void
}

export function SocialVerify({ onActivated }: Props) {
  const searchParams = useSearchParams()
  const [vkError, setVkError] = useState('')
  const [joinStep, setJoinStep] = useState(false)
  const [checking, setChecking] = useState(false)
  const [tgStep, setTgStep] = useState<'idle' | 'subscribed'>('idle')
  const [tgBotUrl, setTgBotUrl] = useState('')
  const [tgLoading, setTgLoading] = useState(false)

  // Detect redirect back from VK OAuth with not_member status
  useEffect(() => {
    if (searchParams.get('trial_vk') === 'join') {
      setJoinStep(true)
    }
    if (searchParams.get('activated') === 'trial') {
      onActivated()
    }
  }, [])

  async function recheckVK() {
    setChecking(true)
    setVkError('')
    try {
      let token = ''
      let vkId = ''
      try {
        token = sessionStorage.getItem('vk_trial_token') || ''
        vkId = sessionStorage.getItem('vk_trial_id') || ''
      } catch {}

      if (!token || !vkId) {
        setVkError('Сначала авторизуйся через VK')
        return
      }

      const fingerprint = await getFingerprint()
      const res = await fetch('/api/v1/me/trial/activate-vk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ vk_id: Number(vkId), access_token: token, fingerprint }),
      })

      if (res.status === 403) {
        setVkError('Ты ещё не вступил в группу. Вступи и попробуй снова.')
        return
      }
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        setVkError(e.detail || 'Ошибка активации')
        return
      }

      try { sessionStorage.removeItem('vk_trial_token'); sessionStorage.removeItem('vk_trial_id') } catch {}
      onActivated()
    } finally {
      setChecking(false)
    }
  }

  if (joinStep) {
    return (
      <div className="mt-4 relative z-10">
        <p className="text-xs font-extrabold text-white/80 uppercase tracking-widest mb-3">
          Вступи в сообщество VK
        </p>
        <a
          href={VK_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pill pill-sm mb-3"
          style={{ background: '#2787F5', color: '#fff', borderColor: 'transparent', display: 'inline-flex' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.1-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z"/>
          </svg>
          Открыть группу IMBA ВКонтакте
        </a>
        <p className="text-xs text-white/50 mb-3">После вступления нажми кнопку ниже</p>
        <button
          onClick={recheckVK}
          disabled={checking}
          className="pill pill-sm disabled:opacity-50"
          style={{ background: '#FFD731', color: '#111', borderColor: 'transparent' }}
        >
          {checking ? 'Проверяем…' : 'Я вступил → Активировать VPN'}
        </button>
        {vkError && <p className="text-xs font-bold text-red-400 mt-2">{vkError}</p>}
      </div>
    )
  }

  return (
    <div className="mt-4 relative z-10">
      <p className="text-xs font-semibold text-white/50 mb-3">
        Вступи в VK-сообщество или Telegram-канал — и получи 7 дней VPN + eSIM 500 МБ
      </p>

      <div className="flex gap-2 flex-wrap items-center">
        <VKIDButton
          mode="trial"
          onError={(msg) => setVkError(msg)}
        />

        <a
          href={TG_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="pill pill-sm"
          style={{ background: '#2AABEE', color: '#fff', borderColor: 'transparent' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.31 14.42l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.843.139z"/>
          </svg>
          Telegram
        </a>
      </div>

      {vkError && <p className="text-xs font-bold text-red-400 mt-1">{vkError}</p>}
    </div>
  )
}
