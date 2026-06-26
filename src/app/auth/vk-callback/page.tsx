'use client'
import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getFingerprint } from '@/lib/fingerprint'

const VK_APP_ID = Number(process.env.NEXT_PUBLIC_VK_CLIENT_ID || '0')

declare global {
  interface Window { VKIDSDK: any }
}

export default function VkCallbackPage() {
  return (
    <Suspense fallback={<Loader />}>
      <VkCallbackContent />
    </Suspense>
  )
}

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#555' }}>
      Авторизация через VK…
    </div>
  )
}

function VkCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const code = searchParams.get('code')
    const device_id = searchParams.get('device_id')

    if (!code || !device_id) {
      router.replace('/auth/login?error=' + encodeURIComponent('VK: отсутствуют параметры'))
      return
    }

    let mode = 'login'
    try { mode = sessionStorage.getItem('vk_auth_mode') || 'login' } catch {}

    async function doExchange() {
      const VKID = window.VKIDSDK

      VKID.Config.init({
        app: VK_APP_ID,
        redirectUrl: window.location.origin + '/api/auth/vkid',
        responseMode: VKID.ConfigResponseMode.Redirect,
        source: VKID.ConfigSource.LOWCODE,
        scope: '',
      })

      const data = await VKID.Auth.exchangeCode(code!, device_id!)
      const fingerprint = await getFingerprint()
      const name = [data.user?.first_name, data.user?.last_name].filter(Boolean).join(' ')

      if (mode === 'trial') {
        // VK ID SDK may return access_token at different paths depending on version
        const accessToken: string = data.access_token || data.token || data.payload?.access_token || ''
        const vkId: number = data.user?.id || data.user_id || data.payload?.user_id || 0
        console.debug('[vk-trial] sdk data keys:', Object.keys(data || {}), 'vkId:', vkId, 'hasToken:', !!accessToken)

        try {
          sessionStorage.setItem('vk_trial_token', accessToken)
          sessionStorage.setItem('vk_trial_id', String(vkId))
        } catch {}

        if (!accessToken || !vkId) {
          console.error('[vk-trial] missing token or vk_id from SDK', data)
          router.replace('/dashboard?trial_vk=error&msg=' + encodeURIComponent('VK не вернул данные авторизации'))
          return
        }

        const res = await fetch('/api/v1/me/trial/activate-vk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ vk_id: vkId, access_token: accessToken, fingerprint }),
        })
        if (res.status === 403) {
          // Not a group member yet — go to dashboard to show join prompt
          router.replace('/dashboard?trial_vk=join')
        } else if (!res.ok) {
          const e = await res.json().catch(() => ({}))
          // Never send user to login page for trial errors — stay in dashboard
          router.replace('/dashboard?trial_vk=error&msg=' + encodeURIComponent(e.detail || 'Ошибка активации'))
        } else {
          router.replace('/dashboard?activated=trial')
        }
      } else if (mode === 'link') {
        const res = await fetch('/api/v1/me/vk/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ vk_id: data.user?.id, access_token: data.access_token, fingerprint }),
        })
        if (!res.ok) {
          const e = await res.json().catch(() => ({}))
          throw new Error(e.detail || 'Ошибка привязки VK')
        }
        router.replace('/dashboard')
      } else {
        const res = await fetch('/api/auth/vkid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vk_id: data.user?.id, access_token: data.access_token, name, fingerprint }),
        })
        if (!res.ok) {
          const e = await res.json().catch(() => ({}))
          throw new Error(e.error || 'Ошибка авторизации VK')
        }
        router.replace('/dashboard')
      }
    }

    function run() {
      doExchange().catch(err => {
        router.replace('/auth/login?error=' + encodeURIComponent(err.message || 'vk_failed'))
      })
    }

    if (window.VKIDSDK) {
      run()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@vkid/sdk@latest/dist-sdk/umd/index.js'
      script.onload = run
      script.onerror = () => router.replace('/auth/login?error=vk_sdk_failed')
      document.head.appendChild(script)
    }
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#555' }}>
      Авторизация через VK…
    </div>
  )
}
