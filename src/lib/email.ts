import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'IMBA <noreply@imba.live>'
const APP_URL = process.env.APP_URL ?? 'https://imba.live'

const FOOTER_ADDRESS = 'IMBA S.R.L. · Reg. No. 3-102-942736 · Costa Rica, San José, Mata Redonda, Sabana Oeste, 12th Avenue, 19th Street'

function configured() {
  return Boolean(process.env.RESEND_API_KEY)
}

function baseHtml(opts: { ticker: string; tickerColor: string; content: string }) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>IMBA</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:2.5px solid #1a1a1a;border-radius:20px;overflow:hidden;background:#fffef9">

        <!-- Header -->
        <tr>
          <td style="background:#1a1a1a;padding:22px 36px;border-bottom:2.5px solid #1a1a1a">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="color:#fffef9;font-size:24px;font-weight:900;font-family:Impact,'Arial Black',sans-serif;letter-spacing:-0.5px">IMBA</span>
                </td>
                <td align="right">
                  <a href="${APP_URL}" style="color:#fffef9;font-size:12px;font-weight:700;text-decoration:none;opacity:0.5;text-transform:uppercase;letter-spacing:1px">imba.live</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Ticker -->
        <tr>
          <td style="background:${opts.tickerColor};padding:11px 36px;border-bottom:2.5px solid #1a1a1a">
            <p style="margin:0;font-size:12px;font-weight:900;font-family:Impact,'Arial Black',sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#1a1a1a">${opts.ticker}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 36px">
            ${opts.content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="border-top:2px solid #f0ebe0;background:#fffef9;padding:20px 36px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:11px;color:#bbb;line-height:1.5">${FOOTER_ADDRESS}</p>
                  <p style="margin:0;font-size:11px;color:#ccc">
                    <a href="${APP_URL}" style="color:#aaa;text-decoration:none">imba.live</a>
                    &nbsp;·&nbsp;
                    <a href="${APP_URL}/privacy-policy" style="color:#aaa;text-decoration:none">Конфиденциальность</a>
                    &nbsp;·&nbsp;
                    <a href="${APP_URL}/terms" style="color:#aaa;text-decoration:none">Условия</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function pillButton(href: string, label: string, style: 'ink' | 'violet' = 'ink') {
  const bg = style === 'violet' ? '#7c5fe6' : '#1a1a1a'
  return `<a href="${href}" style="display:inline-block;background:${bg};color:#fffef9;font-size:14px;font-weight:800;text-decoration:none;padding:14px 30px;border-radius:100px;letter-spacing:-0.2px">${label}</a>`
}

function infoCard(html: string) {
  return `<div style="background:#f5f0e8;border:2px solid #e8e1d4;border-radius:16px;padding:20px 22px;margin:24px 0">${html}</div>`
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!configured()) return
  const firstName = name.split(' ')[0]
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${firstName}, добро пожаловать в IMBA 🎉`,
    html: baseHtml({
      ticker: '✦ ДОБРО ПОЖАЛОВАТЬ В IMBA ✦ eSIM · VPN · КАРТА ✦',
      tickerColor: '#d4c9ff',
      content: `
        <p style="margin:0 0 6px;font-size:12px;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:1.5px">Привет, ${firstName}!</p>
        <h1 style="margin:0 0 18px;font-size:36px;font-weight:900;color:#1a1a1a;line-height:1.05;font-family:Impact,'Arial Black',sans-serif;letter-spacing:-1px">ДОБРО<br>ПОЖАЛОВАТЬ</h1>
        <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.65">
          Твой аккаунт готов. Подключай eSIM в&nbsp;190&nbsp;странах, VPN без логов и виртуальную карту — всё в одном кабинете.
        </p>

        ${infoCard(`
          <p style="margin:0 0 12px;font-size:13px;font-weight:900;color:#1a1a1a;text-transform:uppercase;letter-spacing:0.5px">Что доступно прямо сейчас</p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="padding:5px 0">
              <span style="display:inline-block;background:#1a1a1a;color:#fffef9;font-size:10px;font-weight:900;padding:3px 9px;border-radius:100px;margin-right:10px;letter-spacing:0.5px">eSIM</span>
              <span style="font-size:14px;color:#444;font-weight:600">Интернет в 190+ странах без роуминга</span>
            </td></tr>
            <tr><td style="padding:5px 0">
              <span style="display:inline-block;background:#7c5fe6;color:#fffef9;font-size:10px;font-weight:900;padding:3px 9px;border-radius:100px;margin-right:10px;letter-spacing:0.5px">VPN</span>
              <span style="font-size:14px;color:#444;font-weight:600">Без логов, без ограничений</span>
            </td></tr>
            <tr><td style="padding:5px 0">
              <span style="display:inline-block;background:#1a9e6e;color:#fffef9;font-size:10px;font-weight:900;padding:3px 9px;border-radius:100px;margin-right:10px;letter-spacing:0.5px">КАРТА</span>
              <span style="font-size:14px;color:#444;font-weight:600">Виртуальная карта для оплаты везде</span>
            </td></tr>
          </table>
        `)}

        ${pillButton(`${APP_URL}/dashboard`, 'Открыть кабинет →')}
      `,
    }),
  })
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  if (!configured()) return
  const firstName = name.split(' ')[0]
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Сброс пароля IMBA',
    html: baseHtml({
      ticker: '✦ СБРОС ПАРОЛЯ ✦ ССЫЛКА ДЕЙСТВУЕТ 1 ЧАС ✦',
      tickerColor: '#ffd7a8',
      content: `
        <p style="margin:0 0 6px;font-size:12px;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:1.5px">Привет, ${firstName}!</p>
        <h1 style="margin:0 0 18px;font-size:36px;font-weight:900;color:#1a1a1a;line-height:1.05;font-family:Impact,'Arial Black',sans-serif;letter-spacing:-1px">СБРОС<br>ПАРОЛЯ</h1>
        <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.65">
          Мы получили запрос на смену пароля для твоего аккаунта. Нажми кнопку ниже — ссылка действует <strong style="color:#1a1a1a">1 час</strong>.
        </p>

        ${pillButton(resetUrl, 'Сбросить пароль →', 'violet')}

        ${infoCard(`
          <p style="margin:0 0 6px;font-size:13px;font-weight:900;color:#1a1a1a">Не запрашивал сброс?</p>
          <p style="margin:0;font-size:13px;color:#777;line-height:1.5">Просто проигнорируй это письмо. Пароль останется прежним, и больше писем не придёт.</p>
        `)}

        <p style="margin:28px 0 0;font-size:12px;color:#bbb;line-height:1.5;word-break:break-all">
          Или скопируй ссылку вручную:<br>
          <a href="${resetUrl}" style="color:#999;text-decoration:none">${resetUrl}</a>
        </p>
      `,
    }),
  })
}

export async function sendPromoEmail(email: string, name: string, code: string, amount: number) {
  if (!configured()) return
  const firstName = name.split(' ')[0]
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${firstName}, тебе начислено $${amount} на IMBA 🎁`,
    html: baseHtml({
      ticker: '✦ ПОДАРОК ОТ IMBA ✦ eSIM · VPN · КАРТА ✦',
      tickerColor: '#ffd731',
      content: `
        <p style="margin:0 0 6px;font-size:12px;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:1.5px">Привет, ${firstName}!</p>
        <h1 style="margin:0 0 18px;font-size:36px;font-weight:900;color:#1a1a1a;line-height:1.05;font-family:Impact,'Arial Black',sans-serif;letter-spacing:-1px">ТЕБЕ<br>НАЧИСЛЕНО<br><span style="color:#e6a800">$${amount}.00</span></h1>
        <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.65">
          Активируй промокод в личном кабинете — деньги зачислятся на баланс мгновенно. Трать на eSIM, VPN и виртуальную карту.
        </p>

        ${infoCard(`
          <p style="margin:0 0 10px;font-size:12px;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:1px">Твой промокод</p>
          <p style="margin:0;font-size:28px;font-weight:900;color:#1a1a1a;letter-spacing:4px;font-family:monospace">${code}</p>
        `)}

        <p style="margin:0 0 22px;font-size:14px;color:#777;line-height:1.6">
          Введи код в кабинете: главная страница → поле «Промокод» → нажми <strong>Применить</strong>.
        </p>

        ${pillButton(`${APP_URL}/dashboard`, 'Открыть кабинет →')}

        ${infoCard(`
          <p style="margin:0 0 8px;font-size:13px;font-weight:900;color:#1a1a1a">Что можно купить</p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0">
              <span style="display:inline-block;background:#1a1a1a;color:#fffef9;font-size:10px;font-weight:900;padding:3px 9px;border-radius:100px;margin-right:10px">eSIM</span>
              <span style="font-size:13px;color:#555">Интернет в 190+ странах</span>
            </td></tr>
            <tr><td style="padding:4px 0">
              <span style="display:inline-block;background:#7c5fe6;color:#fffef9;font-size:10px;font-weight:900;padding:3px 9px;border-radius:100px;margin-right:10px">VPN</span>
              <span style="font-size:13px;color:#555">Без логов · $4.99/мес</span>
            </td></tr>
            <tr><td style="padding:4px 0">
              <span style="display:inline-block;background:#1a9e6e;color:#fffef9;font-size:10px;font-weight:900;padding:3px 9px;border-radius:100px;margin-right:10px">КАРТА</span>
              <span style="font-size:13px;color:#555">Visa/Mastercard для оплаты везде</span>
            </td></tr>
          </table>
        `)}
      `,
    }),
  })
}
