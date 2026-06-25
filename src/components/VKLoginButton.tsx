'use client'
import { useRouter } from 'next/navigation'
import { VKIDButton } from './VKIDButton'

export function VKLoginButton() {
  const router = useRouter()
  return (
    <VKIDButton
      mode="login"
      className="pill pill-paper w-full justify-center"
      label="Войти через VK ID"
      onSuccess={() => router.push('/dashboard')}
      onError={(msg) => console.error('VK login error:', msg)}
    />
  )
}
