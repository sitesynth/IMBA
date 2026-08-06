import { createCanvas, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/email')

registerFont('/tmp/Unbounded-Black.ttf', { family: 'Unbounded', weight: '900' })

const W = 792
const H = 200
const BLACK = '#111111'
const PURPLE = '#7B61FF'
const RED = '#F87171'

async function gen(slug, lines) {
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  // Transparent background
  ctx.clearRect(0, 0, W, H)

  // Calculate total height to center vertically
  const lineHeight = lines[0].size * 1.18
  const totalH = lines.length * lineHeight
  let y = (H - totalH) / 2 + lines[0].size * 0.88

  for (const { text, color, size } of lines) {
    ctx.font = `900 ${size}px Unbounded`
    ctx.fillStyle = color
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(text, 0, Math.round(y))
    y += size * 1.18
  }

  const buf = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(OUT, `h-${slug}.png`), buf)
  console.log(`✓ h-${slug}.png`)
}

// English variants — same slug + "-en" suffix, same two-line/color layout per slug.
await gen('verify-en', [
  { text: 'CONFIRM', color: BLACK, size: 68 },
  { text: 'YOUR EMAIL', color: PURPLE, size: 60 },
])

await gen('topup-en', [
  { text: 'CREDIT', color: BLACK, size: 72 },
  { text: 'ADDED', color: BLACK, size: 68 },
])

await gen('trial-en', [
  { text: '7 DAYS', color: PURPLE, size: 72 },
  { text: 'FREE VPN', color: BLACK, size: 66 },
])

await gen('expiring-en', [
  { text: 'SUBSCRIPTION', color: BLACK, size: 52 },
  { text: 'EXPIRING', color: RED, size: 68 },
])

await gen('expired-en', [
  { text: 'SUBSCRIPTION', color: BLACK, size: 52 },
  { text: 'EXPIRED', color: RED, size: 68 },
])

await gen('receipt-en', [
  { text: 'BALANCE', color: BLACK, size: 68 },
  { text: 'TOPPED UP', color: PURPLE, size: 60 },
])

await gen('renewed-en', [
  { text: 'SUBSCRIPTION', color: BLACK, size: 52 },
  { text: 'RENEWED', color: PURPLE, size: 68 },
])

await gen('reset-en', [
  { text: 'RESET', color: BLACK, size: 72 },
  { text: 'PASSWORD', color: PURPLE, size: 60 },
])

await gen('verify', [
  { text: 'ПОДТВЕРДИТЕ', color: BLACK, size: 68 },
  { text: 'ПОЧТУ', color: PURPLE, size: 68 },
])

await gen('welcome', [
  { text: 'ДОБРО', color: BLACK, size: 72 },
  { text: 'ПОЖАЛОВАТЬ', color: PURPLE, size: 58 },
])

await gen('topup', [
  { text: 'ТЕБЕ', color: BLACK, size: 72 },
  { text: 'НАЧИСЛЕНО', color: BLACK, size: 68 },
])

await gen('trial', [
  { text: '7 ДНЕЙ', color: PURPLE, size: 72 },
  { text: 'В ПОДАРОК', color: BLACK, size: 66 },
])

await gen('expiring', [
  { text: 'ПОДПИСКА', color: BLACK, size: 68 },
  { text: 'ИСТЕКАЕТ', color: RED, size: 68 },
])

await gen('expired', [
  { text: 'ПОДПИСКА', color: BLACK, size: 68 },
  { text: 'ИСТЕКЛА', color: RED, size: 68 },
])

await gen('receipt', [
  { text: 'БАЛАНС', color: BLACK, size: 72 },
  { text: 'ПОПОЛНЕН', color: PURPLE, size: 68 },
])

await gen('renewed', [
  { text: 'ПОДПИСКА', color: BLACK, size: 68 },
  { text: 'ПРОДЛЕНА', color: PURPLE, size: 68 },
])

await gen('reset', [
  { text: 'СБРОС', color: BLACK, size: 72 },
  { text: 'ПАРОЛЯ', color: PURPLE, size: 72 },
])

console.log('All done!')
