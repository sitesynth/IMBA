'use client'
import { useRouter } from 'next/navigation'
import { VKIDButton } from './VKIDButton'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

export function VKLoginButton({ label }: { label?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const resolvedLabel = label ?? t('auth.vk_login', locale)
  return (
    <VKIDButton
      mode="login"
      className="pill pill-paper w-full justify-center"
      label={resolvedLabel}
      onError={(msg) => console.error('VK login error:', msg)}
    />
  )
}
