import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'
import { FaqAccordion } from '@/components/FaqAccordion'
import { posts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Купить eSIM для путешествий — интернет в 190+ странах | IMBA',
  description: 'Туристическая eSIM для 190+ стран: Турция, Египет, Казахстан, Грузия. Купить есим онлайн — QR за минуту, от 40 ₽/ГБ, в 5–20 раз дешевле роуминга. 500 МБ бесплатно.',
  alternates: { canonical: 'https://www.imba.live/esim' },
  openGraph: {
    title: 'Купить eSIM для путешествий — интернет в 190+ странах | IMBA',
    description: 'Купить есим онлайн — QR за минуту, от 40 ₽/ГБ. Дешевле роуминга в 5–20 раз. 500 МБ бесплатно.',
    url: 'https://www.imba.live/esim',
    siteName: 'IMBA',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: 'https://www.imba.live/og-image.png', width: 1200, height: 630 }],
  },
}

const faqItems = [
  { q: 'Что такое eSIM простыми словами?', a: 'Это SIM-карта, встроенная в телефон в виде чипа. Оператор записывает на неё профиль дистанционно — через QR-код. Физическая карточка не нужна.', color: 'var(--violet-100)' },
  { q: 'Какие устройства поддерживают eSIM?', a: 'iPhone XS и новее (iPhone 14+ для США — только eSIM). Android: Pixel 4+, Galaxy S21+, большинство флагманов с 2021 года. Проверка: наберите *#06# — если есть EID, поддержка есть.', color: 'var(--paper)' },
  { q: 'Насколько eSIM дешевле роуминга?', a: 'В 5–20 раз. Пример: 10 ГБ в Германии — роуминг МТС около 5 000 ₽, eSIM IMBA — 400–600 ₽. В Турции, Таиланде и ОАЭ разница ещё больше.', color: 'var(--violet-100)' },
  { q: 'Когда устанавливать eSIM — дома или по прилёте?', a: 'Дома, до вылета: для установки нужен интернет. Трафик у большинства тарифов начинает списываться только с первого подключения к местной сети.', color: 'var(--paper)' },
  { q: 'Мой российский номер останется активным?', a: 'Да. eSIM работает вторым профилем: основная SIM принимает звонки и SMS, включая коды банков, интернет идёт через eSIM.', color: 'var(--violet-100)' },
  { q: 'Что делать, если данные закончились?', a: 'Купите новый пакет в кабинете — активация автоматическая, новый QR не нужен.', color: 'var(--paper)' },
  { q: 'Можно ли раздавать интернет с eSIM?', a: 'Да, режим модема работает на большинстве тарифов.', color: 'var(--violet-100)' },
  { q: 'Что происходит с eSIM после поездки?', a: 'Профиль просто перестаёт расходовать трафик. Перед следующей поездкой купите новый пакет — тот же профиль активируется снова.', color: 'var(--paper)' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'IMBA eSIM',
  description: 'Туристическая eSIM для 190+ стран: активация по QR за минуту, от 40 ₽/ГБ, российская SIM остаётся активной.',
  brand: { '@type': 'Brand', name: 'IMBA' },
  offers: [
    { '@type': 'Offer', name: 'Старт', price: '0', priceCurrency: 'RUB', description: 'eSIM 500 МБ на 7 дней бесплатно за подписку на соцсети IMBA', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' },
    { '@type': 'Offer', name: 'Тарифы по странам', price: '40', priceCurrency: 'RUB', description: 'От 40 ₽ за ГБ, пакеты от 1 ГБ до безлимита в 190+ странах', availability: 'https://schema.org/InStock', url: 'https://www.imba.live/auth/register' },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.imba.live/' },
    { '@type': 'ListItem', position: 2, name: 'eSIM', item: 'https://www.imba.live/esim' },
  ],
}

export default function EsimPage() {
  const relatedPosts = posts.filter(p => p.category === 'eSIM')

  return (
    <div className="min-h-screen flex flex-col gap-1.5" style={{ background: 'var(--ink)', padding: '5px' }}>

      <Marquee
        bg="var(--violet-100)"
        items={['190+ СТРАН', 'АКТИВАЦИЯ ЗА 1 МИНУТУ', 'БЕЗ ФИЗИЧЕСКОЙ SIM', 'iPhone И ANDROID', 'ДЕШЕВЛЕ РОУМИНГА В 10×']}
      />

      <SiteHeader />

      {/* Hero */}
      <div className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-12 py-14 md:py-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <span className="chip mb-5 inline-block" style={{ background: 'var(--violet)', borderColor: 'var(--ink)' }}>eSIM</span>
            <h1 className="display text-3xl md:text-[2.1rem] mb-6 leading-tight">
              Купить eSIM для путешествий: интернет в&nbsp;190+ странах
            </h1>
            <p className="text-base md:text-lg font-semibold text-ink/65 max-w-xl mb-8">
              Купить есим онлайн: выбери страну, отсканируй QR — и ты в сети по местным ценам, от 40 ₽ за гигабайт. Российская SIM остаётся активной, физическая карточка не нужна. Новым пользователям — 500 МБ бесплатно.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register" className="pill text-base" style={{ background: '#C9A4FF', color: '#111111', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>
                Купить eSIM →
              </Link>
              <Link href="#how" className="pill pill-paper text-base">Как это работает</Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blog/esim.svg" alt="eSIM IMBA" className="w-56 md:w-80 shrink-0 -mt-4 md:-mt-8" />
        </div>
      </div>

      {/* Stats strip */}
      <div className="rounded-xl px-5 md:px-12 py-8" style={{ background: 'var(--violet-100)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          {[
            { n: '190+', label: 'стран' },
            { n: '1 мин', label: 'активация по QR' },
            { n: '× 10', label: 'дешевле роуминга' },
            { n: '0', label: 'поход в салон' },
          ].map(s => (
            <div key={s.n}>
              <div className="display text-4xl md:text-5xl mb-1">{s.n}</div>
              <div className="text-sm font-semibold text-ink/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl text-center mb-2">Что такое eSIM и почему это дешевле роуминга</h2>
        <p className="text-center font-semibold text-ink/55 mb-10 text-sm md:text-lg max-w-2xl mx-auto">
          eSIM — это цифровая SIM-карта, встроенная в твой телефон. Вместо пластика в аэропортовом киоске ты покупаешь тариф онлайн, сканируешь QR-код — и через минуту у тебя локальный интернет.
        </p>
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <caption className="font-black text-lg mb-4">Сравни расходы на 10 ГБ в поездке</caption>
            <thead>
              <tr className="text-left text-xs text-ink/50 uppercase tracking-wider">
                <th className="pb-3 pr-4 font-semibold">Способ</th>
                <th className="pb-3 pr-4 font-semibold">10 ГБ стоят</th>
                <th className="pb-3 font-semibold">Подключение</th>
              </tr>
            </thead>
            <tbody className="font-semibold">
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-4 font-black">Роуминг МТС / Мегафон / Билайн</td>
                <td className="py-3 pr-4" style={{ color: '#c9a040' }}>2 000–5 000 ₽</td>
                <td className="py-3 text-ink/60">автоматом, но по 200–500 ₽/ГБ</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-4 font-black">Местная SIM в аэропорту</td>
                <td className="py-3 pr-4" style={{ color: '#c9a040' }}>800–1 500 ₽</td>
                <td className="py-3 text-ink/60">очередь, паспорт, новый номер</td>
              </tr>
              <tr className="border-t border-ink/10">
                <td className="py-3 pr-4 font-black">eSIM IMBA</td>
                <td className="py-3 pr-4" style={{ color: '#6abf6e' }}>400–600 ₽</td>
                <td className="py-3" style={{ color: '#6abf6e' }}>QR за 1 минуту, номер прежний</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-5xl mb-2 text-center">Куда купить eSIM: популярные направления</h2>
        <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base max-w-2xl mx-auto text-center">
          Один тариф на регион работает в нескольких странах: удобно для маршрутов с пересадками. Полный список из 190+ стран с ценами — в кабинете.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { flag: '\u{1F1F9}\u{1F1F7}', city: 'Турция', tag: 'САМОЕ ПОПУЛЯРНОЕ', desc: 'Анталья, Стамбул, Аланья — интернет с посадки.', link: { href: '/blog/esim-turkey-2026', label: 'Гайд: eSIM в Турцию →' } },
            { flag: '\u{1F1EA}\u{1F1EC}', city: 'Египет', tag: 'КУРОРТЫ', desc: 'Хургада и Шарм без сюрпризов в счёте за роуминг.' },
            { flag: '\u{1F1F0}\u{1F1FF}', city: 'Казахстан', tag: 'ПОЕЗДКИ И РЕЛОКАЦИЯ', desc: 'Алматы и Астана — локальный интернет с первой минуты.' },
            { flag: '\u{1F1EC}\u{1F1EA}', city: 'Грузия', tag: 'ТБИЛИСИ / БАТУМИ', desc: 'Работает сразу по прилёте, без местной симки.' },
            { flag: '\u{1F1E6}\u{1F1F2}', city: 'Армения', tag: 'ЕРЕВАН', desc: 'Интернет без похода в салон и без паспорта.' },
            { flag: '\u{1F30D}', city: 'Все страны', tag: '190+ НАПРАВЛЕНИЙ', desc: 'Европа, Азия, Америка — полный список и цены в кабинете.' },
          ].map(d => (
            <div key={d.city} className="panel p-5 flex flex-col gap-2">
              <div className="font-black text-lg">{d.flag} {d.city}</div>
              <div className="text-xs text-ink/40 font-semibold tracking-wider">{d.tag}</div>
              <p className="text-sm text-ink/60 font-semibold leading-relaxed">{d.desc}</p>
              {d.link && <Link href={d.link.href} className="text-sm font-black mt-1" style={{ color: 'var(--violet)' }}>{d.link.label}</Link>}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-6xl text-center mb-2">Как это работает</h2>
        <p className="text-center font-semibold text-ink/55 mb-12 text-sm md:text-lg">Три шага от регистрации до интернета</p>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Выбери страну', desc: 'В личном кабинете выбираешь страну назначения и объём данных — от 1 ГБ до безлимита.', cta: 'Выбрать →', href: '/auth/register' },
            { step: '02', title: 'Купи тариф', desc: 'Оплата через IMBA-баланс. Пополнение криптой или переводом. Российская карта не нужна.', cta: 'Купить →', href: '/auth/register' },
            { step: '03', title: 'Активируй по QR', desc: 'Сканируешь QR в настройках телефона — и всё. Профиль eSIM активен, интернет работает. Без физической симки.', cta: 'Начать →', href: '/auth/register' },
          ].map(item => (
            <div key={item.step} className="panel p-7 flex flex-col gap-4" style={{ background: 'var(--violet-100)' }}>
              <div className="flex items-start justify-between gap-2">
                <span className="display text-5xl text-ink/20">{item.step}</span>
                <Link href={item.href} className="pill pill-sm flex-shrink-0" style={{ background: '#C9A4FF', color: '#111111', boxShadow: '0 4px 0 0 rgba(17,17,17,0.2)', fontSize: '12px' }}>{item.cta}</Link>
              </div>
              <h3 className="display text-xl">{item.title}</h3>
              <p className="text-sm font-semibold text-ink/65 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-5xl text-center mb-12">Почему IMBA eSIM</h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {[
            { icon: '🌍', title: '190+ стран', desc: 'Европа, Азия, Ближний Восток, Америка. Тариф найдётся для любого маршрута.' },
            { icon: '⚡', title: 'Активация за 1 минуту', desc: 'QR-код — и готово. Не нужно идти в салон, искать местный магазин или ждать доставки.' },
            { icon: '💰', title: 'Дешевле роуминга', desc: 'МТС, Билайн и Мегафон берут 200–500 ₽ за гигабайт. IMBA eSIM — от 40 ₽/ГБ.' },
            { icon: '📱', title: 'Второй профиль', desc: 'Российский номер остаётся активным. Звонки и SMS приходят как обычно.' },
          ].map(f => (
            <div key={f.title} className="panel p-6 flex gap-5">
              <span className="text-3xl flex-shrink-0">{f.icon}</span>
              <div>
                <h3 className="display text-lg mb-2">{f.title}</h3>
                <p className="text-sm font-semibold text-ink/60 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Device compatibility */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--paper)' }}>
        <h2 className="display text-3xl md:text-5xl mb-8 text-center">Какие телефоны поддерживают eSIM</h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <div className="panel p-6">
            <h3 className="display text-lg mb-3">iPhone</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">XS и новее, включая SE 2020+. Американские iPhone 14+ работают только с eSIM — физического слота у них нет.</p>
          </div>
          <div className="panel p-6">
            <h3 className="display text-lg mb-3">Android</h3>
            <p className="text-sm font-semibold text-ink/60 leading-relaxed">Google Pixel 4+, Samsung Galaxy S21+, Huawei P40+ и большинство флагманов с 2021 года.</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-ink/55 mt-6 max-w-2xl mx-auto text-center leading-relaxed">
          Как проверить свой телефон: набери <strong className="text-ink">*#06#</strong> — если в списке есть EID, eSIM поддерживается. На iPhone: Настройки → Сотовая связь → Добавить eSIM.
        </p>
      </section>

      {/* Free trial */}
      <section className="rounded-xl px-5 md:px-12 py-12 md:py-16" style={{ background: 'var(--violet-100)' }}>
        <h2 className="display text-3xl md:text-5xl mb-3 text-center">Попробуй бесплатно: eSIM 500 МБ на 7 дней</h2>
        <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base max-w-2xl mx-auto text-center">
          Не уверен, что eSIM — это твоё? Проверь без вложений: зарегистрируйся, подпишись на ВКонтакте или Telegram IMBA — и активируй тариф Старт: eSIM 500 МБ плюс VPN на 7 дней. Хватит на карты, мессенджеры и такси в первый день поездки.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          <a href="https://vk.com/club239876488" target="_blank" rel="noopener noreferrer" className="panel p-5 hover:-translate-y-0.5 transition-transform">
            <h3 className="font-black text-base mb-1">ВКонтакте</h3>
            <p className="text-sm text-ink/60 font-semibold">Вступи в сообщество IMBA</p>
          </a>
          <a href="https://telegram.dog/imba_live" target="_blank" rel="noopener noreferrer" className="panel p-5 hover:-translate-y-0.5 transition-transform">
            <h3 className="font-black text-base mb-1">Telegram</h3>
            <p className="text-sm text-ink/60 font-semibold">Подпишись на канал IMBA</p>
          </a>
        </div>
        <div className="text-center">
          <Link href="/auth/register" className="pill text-base" style={{ background: '#C9A4FF', color: '#111111', boxShadow: '0 6px 0 0 rgba(17,17,17,0.2)' }}>
            Получить 500 МБ бесплатно →
          </Link>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="rounded-xl px-5 md:px-8 py-6" style={{ background: 'var(--paper)' }}>
        <p className="text-center font-semibold text-ink/60 text-sm md:text-base">
          В подписку IMBA также входят <Link href="/" className="font-black text-ink border-b border-dotted border-ink/40 hover:opacity-70">VPN на VLESS Reality</Link> и <Link href="/virtual-card" className="font-black text-ink border-b border-dotted border-ink/40 hover:opacity-70">виртуальная карта Visa/Mastercard</Link> — один кабинет, один баланс.
        </p>
      </section>

      {/* Blog posts */}
      {relatedPosts.length > 0 && (
        <section className="rounded-xl px-5 md:px-12 py-12" style={{ background: 'var(--paper)' }}>
          <h2 className="display text-3xl md:text-5xl mb-2 text-center">Читай по теме</h2>
          <p className="font-semibold text-ink/55 mb-8 text-sm md:text-base text-center">Гайды и советы по eSIM</p>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {relatedPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="panel h-full flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <span className="chip" style={{ background: 'var(--violet)', borderColor: 'var(--ink)' }}>{post.category}</span>
                    <span className="text-xs text-ink/40 font-semibold">{post.readTime} чтения</span>
                  </div>
                  <h3 className="text-lg font-black leading-snug group-hover:opacity-70 transition-opacity">{post.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                    <span className="text-xs text-ink/40 font-semibold">{post.date}</span>
                    <span className="text-sm font-black group-hover:underline" style={{ color: 'var(--violet)' }}>Читать →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="rounded-xl px-4 md:px-12 py-12 md:py-16" style={{ background: 'var(--cream)' }}>
        <h2 className="display text-3xl md:text-7xl text-center mb-2">Вопросы?</h2>
        <p className="text-center font-semibold text-ink/60 mb-10 text-sm md:text-lg">Всё об eSIM</p>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl text-center py-16 px-6" style={{ background: 'var(--violet)' }}>
        <h2 className="display text-4xl md:text-6xl mb-4">Готов в путь?</h2>
        <p className="font-semibold text-lg text-ink/70 mb-8">Интернет в любой стране. Активация за минуту.</p>
        <Link href="/auth/register" className="pill pill-ink text-base imba-btn-pulse">Купить eSIM →</Link>
      </section>

      {/* Footer */}
      <footer className="rounded-xl" style={{ background: 'var(--paper)' }}>
        <div className="px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="md" />
          <div className="flex gap-5 text-sm font-bold">
            <Link href="/blog" className="hover:opacity-60">Блог</Link>
            <Link href="/privacy-policy" className="hover:opacity-60">Конфиденциальность</Link>
            <Link href="/terms" className="hover:opacity-60">Условия</Link>
            <Link href="/refund" className="hover:opacity-60">Возврат средств</Link>
          </div>
        </div>
        <div className="px-5 md:px-8 pb-6 border-t border-ink/10 pt-4">
          <p className="text-xs text-ink/40 text-center leading-relaxed">
            IMBA SRL · Reg. No. 3-102-942736 · Costa Rica, San José
          </p>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  )
}
