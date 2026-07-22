'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function TgWebAppAuth() {
  const router = useRouter()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function login() {
      const tg = (window as any).Telegram?.WebApp
      const initData = tg?.initData

      if (!initData) {
        // Not inside Telegram — go to regular login
        router.replace('/auth/login')
        return
      }

      tg.ready()
      tg.expand()

      const res = await fetch('/api/auth/tg-webapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ init_data: initData }),
      })

      if (res.ok) {
        router.replace('/dashboard')
      } else {
        const err = await res.json().catch(() => ({}))
        router.replace('/auth/login?error=' + encodeURIComponent(err.error || 'tg_auth_failed'))
      }
    }

    // Load Telegram WebApp script if not present, then login
    if ((window as any).Telegram?.WebApp) {
      login()
    } else {
      const s = document.createElement('script')
      s.src = 'https://telegram.org/js/telegram-web-app.js'
      s.onload = login
      s.onerror = () => router.replace('/auth/login')
      document.head.appendChild(s)
    }
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#555' }}>
      Signing in via Telegram…
    </div>
  )
}
