'use client'
import { useEffect, useRef, useState } from 'react'
import { getFingerprint } from '@/lib/fingerprint'

const VK_APP_ID = Number(process.env.NEXT_PUBLIC_VK_CLIENT_ID || '0')

declare global {
  interface Window { VKIDSDK: any }
}

interface Props {
  mode: 'login' | 'link'
  onSuccess?: () => void
  onError?: (msg: string) => void
  label?: string
  className?: string
}

export function VKIDButton({ mode, onSuccess, onError, label = 'VK ID', className = 'pill pill-sm' }: Props) {
  const hiddenRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    if (!VK_APP_ID || mounted.current) return
    mounted.current = true

    function initSDK() {
      if (!window.VKIDSDK || !hiddenRef.current) return
      const VKID = window.VKIDSDK

      VKID.Config.init({
        app: VK_APP_ID,
        redirectUrl: window.location.origin + '/api/auth/vkid',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: '',
      })

      const oAuth = new VKID.OAuthList()
      oAuth
        .render({ container: hiddenRef.current!, oauthList: ['vkid'] })
        .on(VKID.WidgetEvents.ERROR, (err: any) => {
          setLoading(false)
          onError?.(err?.message || 'VK: ошибка')
        })
        .on(VKID.OAuthListInternalEvents.LOGIN_SUCCESS, async (payload: any) => {
          setLoading(true)
          try {
            const data = await VKID.Auth.exchangeCode(payload.code, payload.device_id)
            const fingerprint = await getFingerprint()
            const name = [data.user?.first_name, data.user?.last_name].filter(Boolean).join(' ')

            if (mode === 'link') {
              const res = await fetch('/api/v1/me/vk/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vk_id: data.user?.id, access_token: data.access_token, fingerprint }),
              })
              if (!res.ok) {
                const e = await res.json().catch(() => ({}))
                throw new Error(e.detail || 'Ошибка привязки VK')
              }
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
            }

            onSuccess?.()
          } catch (e: unknown) {
            onError?.((e as Error).message || 'VK: ошибка')
          } finally {
            setLoading(false)
          }
        })

      setReady(true)
    }

    if (document.querySelector('script[src*="vkid/sdk"]')) {
      if (window.VKIDSDK) initSDK()
      else document.querySelector('script[src*="vkid/sdk"]')!.addEventListener('load', initSDK)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js'
    script.onload = initSDK
    document.head.appendChild(script)
  }, [])

  const handleClick = () => {
    if (loading || !ready) return
    // click the SDK-rendered button inside the hidden container
    const btn = hiddenRef.current?.querySelector<HTMLElement>('button, a, [role="button"]')
    btn?.click()
  }

  if (!VK_APP_ID) return null

  return (
    <>
      {/* Hidden SDK widget — stays in DOM so SDK callbacks fire */}
      <div
        ref={hiddenRef}
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none', zIndex: -1 }}
      />

      {/* Our styled pill button */}
      <button
        onClick={handleClick}
        disabled={loading || !ready}
        className={className}
        style={{
          background: '#2787F5',
          color: '#fff',
          borderColor: 'transparent',
          opacity: loading || !ready ? 0.6 : 1,
          cursor: loading || !ready ? 'wait' : 'pointer',
        }}
      >
        {loading ? (
          <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.11-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z"/>
          </svg>
        )}
        {label}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
