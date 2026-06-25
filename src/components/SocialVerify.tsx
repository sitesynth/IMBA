'use client'
import { useState } from 'react'
import { getFingerprint } from '@/lib/fingerprint'
import { VKIDButton } from './VKIDButton'

const TG_BOT_ID = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID || ''

interface Props {
  onActivated: () => void
}

export function SocialVerify({ onActivated }: Props) {
  const [vkError, setVkError] = useState('')

  async function handleTelegram() {
    const fingerprint = await getFingerprint()
    const state = encodeURIComponent(`${fingerprint}__link`)
    const redirectUri = encodeURIComponent(window.location.origin + '/api/auth/telegram/callback')
    window.location.href =
      `https://oauth.telegram.org/auth?client_id=${TG_BOT_ID}&scope=openid+profile&response_type=code&redirect_uri=${redirectUri}&state=${state}`
  }

  return (
    <div className="mt-4 relative z-10">
      <p className="text-xs font-semibold text-white/50 mb-3">
        Подтверди аккаунт → получи 7 дней VPN + eSIM 500 МБ бесплатно
      </p>

      <div className="flex gap-2 flex-wrap items-center">
        {TG_BOT_ID && (
          <button
            onClick={handleTelegram}
            className="pill pill-sm"
            style={{ background: '#2AABEE', color: '#fff', borderColor: 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.31 14.42l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.843.139z"/>
            </svg>
            Telegram
          </button>
        )}

        <VKIDButton
          mode="link"
          onSuccess={onActivated}
          onError={(msg) => setVkError(msg)}
        />
      </div>

      {vkError && <p className="text-xs font-bold text-red-400 mt-1">{vkError}</p>}
    </div>
  )
}
