'use client'
import { getFingerprint } from '@/lib/fingerprint'

export function VKLoginButton({ label = 'Войти через VK' }: { label?: string }) {
  const clientId = process.env.NEXT_PUBLIC_VK_CLIENT_ID
  if (!clientId) return null

  async function handleClick() {
    const fingerprint = await getFingerprint()
    const redirectUri = encodeURIComponent(window.location.origin + '/api/auth/vk/callback')
    const state = fingerprint ? encodeURIComponent(fingerprint) : ''
    window.location.href =
      `https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=&state=${state}`
  }

  return (
    <button
      onClick={handleClick}
      className="pill pill-paper w-full justify-center"
      style={{ gap: '8px' }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.815.615.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.963c-.044-.073-.314-.661-1.616-1.869-1.364-1.265-1.181-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.332-.852-.244-.852-.244l-2.44.015s-.181-.025-.315.055c-.132.078-.216.26-.216.26s-.387 1.03-.903 1.905c-1.088 1.848-1.524 1.947-1.702 1.832-.414-.268-.31-1.074-.31-1.648 0-1.793.272-2.54-.529-2.733-.265-.064-.46-.106-1.138-.113-.87-.009-1.606.003-2.022.207-.277.135-.49.437-.36.454.16.021.525.098.718.362.248.341.24 1.107.24 1.107s.143 2.11-.333 2.372c-.326.18-.774-.187-1.733-1.863-.49-.847-.861-1.786-.861-1.786s-.071-.176-.201-.27c-.158-.115-.378-.151-.378-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.391c1.886 1.965 4.026 1.836 4.026 1.836h.97z" fill="#2787F5"/>
      </svg>
      {label}
    </button>
  )
}
