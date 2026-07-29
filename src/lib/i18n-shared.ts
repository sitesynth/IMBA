export type Locale = 'ru' | 'en'

const RU_HOSTS = ['imba.run', 'www.imba.run', 'localhost']

export function getLocaleFromHost(host: string): Locale {
  const h = host.toLowerCase()
  return RU_HOSTS.some(rh => h === rh || h.endsWith('.' + rh)) ? 'ru' : 'en'
}

export function getDateLocale(locale: Locale): string {
  return locale === 'ru' ? 'ru-RU' : 'en-US'
}

export function pluralDays(n: number, locale: Locale): string {
  if (locale === 'en') return n === 1 ? 'day' : 'days'
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'день'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня'
  return 'дней'
}
