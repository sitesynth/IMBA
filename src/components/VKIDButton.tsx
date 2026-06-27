'use client'

const VK_APP_ID = Number(process.env.NEXT_PUBLIC_VK_CLIENT_ID || '0')

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function genDeviceId(): string {
  const a = crypto.getRandomValues(new Uint8Array(16))
  a[6] = (a[6] & 0x0f) | 0x40
  a[8] = (a[8] & 0x3f) | 0x80
  const h = Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

async function redirectToVK(mode: string) {
  const verifier = b64url(crypto.getRandomValues(new Uint8Array(32)).buffer)
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  const challenge = b64url(hash)
  const deviceId = genDeviceId()
  const state = b64url(crypto.getRandomValues(new Uint8Array(8)).buffer)

  try {
    sessionStorage.setItem('vk_auth_mode', mode)
    sessionStorage.setItem('vk_code_verifier', verifier)
  } catch {}

  const redirectUri = window.location.origin + '/api/auth/vkid'
  const params = new URLSearchParams({
    v: '2.6.5',
    sdk_type: 'vkid',
    app_id: String(VK_APP_ID),
    client_id: String(VK_APP_ID),
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
    scope: '',
    device_id: deviceId,
    code_challenge: challenge,
    code_challenge_method: 's256',
  })

  window.location.href = `https://id.vk.ru/authorize?${params}`
}

interface Props {
  mode: 'login' | 'link' | 'trial'
  onError?: (msg: string) => void
  label?: string
  className?: string
  /** Transparent full-parent overlay — parent must be position:relative */
  overlay?: boolean
}

export function VKIDButton({ mode, onError, label = 'VK ID', className = 'pill pill-sm', overlay = false }: Props) {
  if (!VK_APP_ID) return null

  const handleClick = () => redirectToVK(mode).catch(err => onError?.(err.message || 'VK ошибка'))

  if (overlay) {
    return (
      <div
        onClick={handleClick}
        style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 1 }}
        aria-label="Войти через ВКонтакте"
        role="button"
      />
    )
  }

  return (
    <button
      className={className}
      onClick={handleClick}
      style={{ background: '#2787F5', color: '#fff', borderColor: 'transparent', cursor: 'pointer' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.1-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z" />
      </svg>
      {label}
    </button>
  )
}
