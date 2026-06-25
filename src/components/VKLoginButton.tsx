'use client'
import { useRouter } from 'next/navigation'
import { VKIDButton } from './VKIDButton'

export function VKLoginButton({ label = 'Войти через VK ID' }: { label?: string }) {
  const router = useRouter()
  return (
    <VKIDButton
      mode="login"
      className="pill pill-paper w-full justify-center"
      label={label}
      onSuccess={() => router.push('/dashboard')}
      onError={(msg) => console.error('VK login error:', msg)}
    />
  )
}
