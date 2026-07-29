import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Mail, User as UserIcon, Calendar, Globe } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/auth'
import { apiFetch } from '@/lib/api'
import { CurrencySelector } from '@/components/CurrencySelector'
import { getLocale } from '@/lib/i18n'
import { t } from '@/lib/t'

async function updateCurrency(currency: string) {
  'use server'
  await apiFetch('/v1/me/settings', {
    method: 'PATCH',
    body: JSON.stringify({ currency }),
  })
  revalidatePath('/dashboard/settings')
}

export default async function SettingsPage() {
  const locale = await getLocale()
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="fade-up space-y-6">
      <div>
        <h1 className="display text-4xl md:text-5xl mb-1">{t('settings.title', locale)}</h1>
        <p className="font-semibold text-ink/60">{t('settings.subtitle', locale)}</p>
      </div>

      <div className="panel" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-xl md:text-2xl mb-4">{t('settings.currency', locale)}</h2>
        <p className="font-semibold text-ink/60 text-sm mb-4">
          {t('settings.currency_desc', locale)}
        </p>
        <CurrencySelector current={user.currency ?? 'USD'} action={updateCurrency} />
      </div>

      <div className="panel" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-xl md:text-2xl mb-5">{t('settings.profile', locale)}</h2>

        <div className="space-y-3">
          {[
            { icon: UserIcon, label: t('settings.name', locale), value: user.name || '—' },
            { icon: Mail, label: 'Email', value: user.email },
            { icon: Globe, label: t('settings.language', locale), value: user.language === 'ru' ? t('settings.language_value', locale) : user.language },
            {
              icon: Calendar,
              label: t('settings.created', locale),
              value: new Date(user.created_at).toLocaleDateString('ru-RU'),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-cream"
            >
              <div
                className="w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--cream)' }}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-extrabold uppercase tracking-widest text-ink/50">
                  {label}
                </div>
                <div className="font-extrabold text-sm truncate">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ background: 'var(--violet-100)' }}>
        <h2 className="display text-xl md:text-2xl mb-2">{t('settings.support', locale)}</h2>
        <p className="font-semibold text-ink/60 text-sm mb-4">
          {t('settings.support_desc', locale)}
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="mailto:hello@imba.live" className="pill pill-ink pill-sm">
            {t('settings.contact_support', locale)}
          </a>
          <a href="https://telegram.dog/imbasupport" className="pill pill-paper pill-sm">
            Telegram
          </a>
        </div>
      </div>

      <div className="panel" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-xl md:text-2xl mb-2">{t('settings.account', locale)}</h2>
        <p className="font-semibold text-ink/60 text-sm mb-4">
          {t('settings.logout_desc', locale)}
        </p>
        <form action={logout}>
          <button type="submit" className="pill pill-paper pill-sm">
            {t('settings.logout', locale)}
          </button>
        </form>
      </div>
    </div>
  )
}
