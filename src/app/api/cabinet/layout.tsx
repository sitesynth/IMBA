import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser, logout } from '@/lib/auth'
import { getLocale } from '@/lib/i18n'
import { CabinetShell } from './CabinetShell'

export const metadata: Metadata = {
  title: { default: 'IMBA API cabinet', template: '%s · IMBA API cabinet' },
  robots: { index: false },
}

// A cabinet of its own, not the IMBA app: it shares only the sign-in (one IMBA account).
export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login?for=partner&redirect=%2Fapi%2Fcabinet')
  const locale = await getLocale()

  return (
    <CabinetShell email={user.email} name={user.name ?? ''} locale={locale} logoutAction={logout}>
      {children}
    </CabinetShell>
  )
}
