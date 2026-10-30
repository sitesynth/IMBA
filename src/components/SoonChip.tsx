import { t } from '@/lib/t'
import type { Locale } from '@/lib/i18n-shared'

// Same look as the 'soon' badges on the landing pricing cards.
export function SoonChip({ locale, className = '' }: { locale: Locale; className?: string }) {
  return (
    <span className={`ml-2 inline-block align-middle text-[10px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full border border-ink/20 text-ink/40 ${className}`}>
      {t('soon.chip', locale)}
    </span>
  )
}
