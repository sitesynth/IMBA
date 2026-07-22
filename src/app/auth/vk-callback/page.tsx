'use client'
import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getFingerprint } from '@/lib/fingerprint'

const VK_APP_ID = Number(process.env.NEXT_PUBLIC_VK_CLIENT_ID || '0')

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
      Signing in via VK…
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
      router.replace('/auth/login?error=' + encodeURIComponent('VK: missing parameters'))
      return
    }

    let mode = 'login'
    let codeVerifier = ''
    try {
      mode = sessionStorage.getItem('vk_auth_mode') || 'login'
      codeVerifier = sessionStorage.getItem('vk_code_verifier') || ''
    } catch {}

    async function doExchange() {
      const fingerprint = await getFingerprint()
      const redirectUri = window.location.origin + '/api/auth/vkid'

      // SDK format: params in query string, only code in POST body
      const exchangeParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: String(VK_APP_ID),
        device_id: device_id!,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      })
      const resp = await fetch(`https://id.vk.ru/oauth2/auth?${exchangeParams}`, {
        method: 'POST',
        body: new URLSearchParams({ code: code! }),
      })

      const rawText = await resp.text()
      if (!resp.ok) throw new Error(`VK exchange ${resp.status}: ${rawText.slice(0, 200)}`)
      let data: any = {}
      try { data = JSON.parse(rawText) } catch { throw new Error('VK response not JSON: ' + rawText.slice(0, 200)) }
      if (data.error) throw new Error(`VK error: ${data.error} — ${data.error_description || ''}`)

      const accessToken: string = data.access_token || ''
      if (!accessToken) throw new Error(`VK no access_token: keys=${Object.keys(data).join(',')}`)

      // Fetch user info separately (token response doesn't include user object)
      const userInfoParams = new URLSearchParams({ client_id: String(VK_APP_ID) })
      const userInfoResp = await fetch(`https://id.vk.ru/oauth2/user_info?${userInfoParams}`, {
        method: 'POST',
        body: new URLSearchParams({ access_token: accessToken }),
      })
      const userInfo = await userInfoResp.json()
      const user = userInfo.user || userInfo
      const vkId: number = user.id || user.user_id || 0
      const name = [user.first_name, user.last_name].filter(Boolean).join(' ')

      if (!vkId) throw new Error(`VK no user_id: ${JSON.stringify(userInfo).slice(0, 200)}`)

      if (mode === 'trial') {
        try {
          sessionStorage.setItem('vk_trial_token', accessToken)
          sessionStorage.setItem('vk_trial_id', String(vkId))
        } catch {}

        const res = await fetch('/api/v1/me/trial/activate-vk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ vk_id: vkId, access_token: accessToken, fingerprint }),
        })
        if (res.ok) {
          router.replace('/dashboard?activated=trial')
        } else {
          router.replace('/dashboard?trial_vk=join')
        }

      } else if (mode === 'link') {
        const res = await fetch('/api/v1/me/vk/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ vk_id: vkId, access_token: accessToken, fingerprint }),
        })
        if (!res.ok) {
          const e = await res.json().catch(() => ({}))
          throw new Error(e.detail || 'VK link error')
        }
        router.replace('/dashboard')

      } else {
        const res = await fetch('/api/auth/vkid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vk_id: vkId, access_token: accessToken, name, fingerprint }),
        })
        if (!res.ok) {
          const e = await res.json().catch(() => ({}))
          throw new Error(e.error || 'VK auth failed')
        }
        router.replace('/dashboard')
      }
    }

    doExchange().catch(err => {
      const msg = err.message || 'vk_failed'
      if (mode === 'trial') {
        router.replace('/dashboard?trial_vk=error&msg=' + encodeURIComponent(msg))
      } else {
        router.replace('/auth/login?error=' + encodeURIComponent(msg))
      }
    })
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#555' }}>
      Signing in via VK…
    </div>
  )
}
