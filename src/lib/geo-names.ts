// Shared RU→EN geo dictionaries. The API returns city/country names in Russian;
// the English locale renders them through these maps.

export const CITY_EN: Record<string, string> = {
  'Берлин': 'Berlin', 'Лиссабон': 'Lisbon', 'Нью-Йорк': 'New York', 'Джексонвилл': 'Jacksonville',
  'Москва': 'Moscow', 'Лондон': 'London', 'Париж': 'Paris',
  'Амстердам': 'Amsterdam', 'Варшава': 'Warsaw', 'Прага': 'Prague',
  'Стокгольм': 'Stockholm', 'Хельсинки': 'Helsinki', 'Вена': 'Vienna',
}

export const COUNTRY_EN: Record<string, string> = {
  'Германия': 'Germany', 'Португалия': 'Portugal', 'США': 'US',
  'Россия': 'Russia', 'Великобритания': 'UK', 'Франция': 'France',
  'Нидерланды': 'Netherlands', 'Польша': 'Poland', 'Чехия': 'Czechia',
  'Швеция': 'Sweden', 'Финляндия': 'Finland', 'Австрия': 'Austria',
}

/** ISO country code → uppercase English country name (landing-page cards). */
export const COUNTRY_CODE_EN: Record<string, string> = {
  DE: 'GERMANY', PT: 'PORTUGAL', US: 'USA', NL: 'NETHERLANDS', FR: 'FRANCE',
  GB: 'UK', FI: 'FINLAND', TR: 'TURKEY', JP: 'JAPAN', SG: 'SINGAPORE',
  UA: 'UKRAINE', PL: 'POLAND', CZ: 'CZECHIA', SE: 'SWEDEN', NO: 'NORWAY',
  AT: 'AUSTRIA', RU: 'RUSSIA',
}

export const FLAG_BY_CODE: Record<string, string> = {
  DE: '🇩🇪', PT: '🇵🇹', US: '🇺🇸', NL: '🇳🇱', FR: '🇫🇷',
  GB: '🇬🇧', FI: '🇫🇮', TR: '🇹🇷', JP: '🇯🇵', SG: '🇸🇬',
  UA: '🇺🇦', PL: '🇵🇱', CZ: '🇨🇿', SE: '🇸🇪', NO: '🇳🇴',
  AT: '🇦🇹', RU: '🇷🇺',
}

const regionNames: { en?: Intl.DisplayNames } = {}

/** Country name for the active locale. The API returns Russian names keyed by ISO code:
 *  the Russian locale keeps them; English uses COUNTRY_EN first, then Intl for the rest. */
export function countryName(code: string, apiName: string, locale: string): string {
  if (locale !== 'en') return apiName
  if (COUNTRY_EN[apiName]) return COUNTRY_EN[apiName]
  try {
    const dn = (regionNames.en ??= new Intl.DisplayNames(['en'], { type: 'region' }))
    const name = dn.of(code.toUpperCase())
    if (name && name !== code.toUpperCase()) return name
  } catch { /* not an ISO region code */ }
  return apiName
}

/** Translate a value through a dictionary; Russian locale keeps the source string. */
export function loc(map: Record<string, string>, value: string, locale: string): string {
  return locale === 'en' ? (map[value] ?? value) : value
}
