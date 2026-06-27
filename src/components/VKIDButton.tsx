'use client'
import { useEffect, useRef, useState } from 'react'

const VK_APP_ID = Number(process.env.NEXT_PUBLIC_VK_CLIENT_ID || '0')

declare global {
  interface Window { VKIDSDK: any }
}

interface Props {
  mode: 'login' | 'link' | 'trial'
  onSuccess?: () => void
  onError?: (msg: string) => void
  label?: string
  className?: string
  /** Render as invisible full-parent overlay — no visual button. Parent must be position:relative. */
  overlay?: boolean
}

export function VKIDButton({ mode, onError, label = 'VK ID', className = 'pill pill-sm', overlay = false }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    if (!VK_APP_ID || mounted.current) return
    mounted.current = true

    function initSDK() {
      if (!window.VKIDSDK || !overlayRef.current) return
      const VKID = window.VKIDSDK

      VKID.Config.init({
        app: VK_APP_ID,
        redirectUrl: window.location.origin + '/api/auth/vkid',
        responseMode: VKID.ConfigResponseMode.Redirect,
        source: VKID.ConfigSource.LOWCODE,
        scope: '',
      })

      const oAuth = new VKID.OAuthList()
      oAuth.render({ container: overlayRef.current!, oauthList: ['vkid'] })

      try { sessionStorage.setItem('vk_auth_mode', mode) } catch {}

      // Move SDK's clickable element to overlay root, remove all SDK chrome from DOM
      const apply = () => {
        if (!overlayRef.current) return
        const btn = overlayRef.current.querySelector<HTMLElement>('button, a, [role="button"]')
        if (btn) {
          // Detach btn from SDK wrapper and re-attach directly to overlay
          overlayRef.current.appendChild(btn)
          // Remove everything else (SDK text, wrappers, branding)
          Array.from(overlayRef.current.childNodes).forEach(child => {
            if (child !== btn) overlayRef.current!.removeChild(child)
          })
          // Stretch btn to fill the overlay transparently — click anywhere = VK auth
          btn.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;background:transparent;padding:0;margin:0;display:block'
          if (!overlay) setReady(true)
        } else {
          setTimeout(apply, 100)
        }
      }
      setTimeout(apply, 200)
    }

    const existing = document.querySelector('script[src*="vkid/sdk"]')
    if (existing) {
      if (window.VKIDSDK) initSDK()
      else existing.addEventListener('load', initSDK)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@vkid/sdk@latest/dist-sdk/umd/index.js'
    script.onload = initSDK
    script.onerror = () => onError?.('VK SDK не загрузился')
    document.head.appendChild(script)
  }, [mode])

  if (!VK_APP_ID) return null

  // Overlay mode: invisible SDK button covers the entire parent (parent must be position:relative)
  if (overlay) {
    return (
      <div
        ref={overlayRef}
        onClick={(e) => {
          // Fallback: if apply() didn't stretch the SDK btn to fill overlay,
          // delegate click manually. Skip if target is already a child (btn found & works).
          if (e.target === e.currentTarget) {
            const btn = overlayRef.current?.querySelector<HTMLElement>('button, a, [role="button"]')
            btn?.click()
          }
        }}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'pointer', zIndex: 1, opacity: 0 }}
      />
    )
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Visual button — pointer-events none, clicks go through to SDK overlay */}
      <button
        className={className}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          background: '#2787F5',
          color: '#fff',
          borderColor: 'transparent',
          opacity: !ready ? 0.6 : 1,
          cursor: !ready ? 'wait' : 'pointer',
          pointerEvents: 'none',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.11-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z"/>
        </svg>
        {label}
      </button>

      {/* SDK widget overlay — transparent, real clickable button from VK SDK */}
      <div
        ref={overlayRef}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
      />
    </div>
  )
}
