'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useLocale } from '@/lib/useLocale'
import { t } from '@/lib/t'

export function CopyButton({ text, className, label }: { text: string; className?: string; label?: string }) {
  const locale = useLocale()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} className={className ?? 'pill pill-paper pill-sm'}>
      {copied ? (
        <Check className="w-4 h-4" strokeWidth={2.5} />
      ) : (
        <Copy className="w-4 h-4" strokeWidth={2.5} />
      )}
      {copied ? t('copy.copied', locale) : (label ?? t('copy.copy', locale))}
    </button>
  )
}
