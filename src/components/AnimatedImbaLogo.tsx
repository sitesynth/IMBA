'use client'
import { useEffect, useRef } from 'react'

// ── Swirl engine (plain JS, no TS types needed at runtime) ────────────────────
class Utils {
  static random() { return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 }
  static smoothStep(x: number, e1: number, e2: number) {
    x = Math.max(0, Math.min(1, (x - e1) / (e2 - e1)))
    return x * x * (3 - 2 * x)
  }
}

class TiledSwirlEngine {
  density = 18
  edge = 0.12
  ripple = 4
  speed = 0.022
  tightness = 2.8
  palette = ['#FFD731', '#55DB9C', '#C9A4FF', '#FF7A3D', '#FFFFFF']

  private rows = 0; private cols = 0; private size = 0
  private time = 0; private distMax = 0
  private colors: string[][] = []
  private rafId = 0
  private ctx: CanvasRenderingContext2D | null
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.resize()
    this.initColors()
    this.loop()
  }

  resize() {
    const r = window.devicePixelRatio || 1
    const w = this.canvas.clientWidth || this.canvas.offsetWidth || 400
    const h = this.canvas.clientHeight || this.canvas.offsetHeight || 134
    this.canvas.width = w * r
    this.canvas.height = h * r
    this.ctx?.resetTransform()
    this.ctx?.scale(r, r)
    this.size = Math.min(w, h) / this.density
    if (this.size < 1) this.size = 1
    this.cols = Math.ceil(w / this.size) + 1
    this.rows = Math.ceil(h / this.size) + 1
    this.distMax = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2)
    this.initColors()
  }

  private initColors() {
    this.colors = []
    for (let i = 0; i < this.cols; i++) {
      this.colors[i] = []
      for (let j = 0; j < this.rows; j++) {
        this.colors[i][j] = this.palette[Math.floor(Utils.random() * this.palette.length)]
      }
    }
  }

  private loop = () => {
    this.rafId = requestAnimationFrame(this.loop)
    const c = this.ctx; if (!c) return
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight
    c.clearRect(0, 0, w, h)
    this.time += this.speed
    const cx = w / 2, cy = h / 2
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (!this.colors[i]?.[j]) continue
        const x = i * this.size, y = j * this.size
        const dx = x + this.size / 2 - cx, dy = y + this.size / 2 - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const distN = dist / this.distMax
        const angle = Math.atan2(dy, dx)
        const ripF = this.tightness * (1 + distN * this.ripple)
        const wave = Math.sin(distN * ripF + angle - this.time)
        const waveE = Utils.smoothStep((wave + 1) / 2, 0.5 - this.edge, 0.5 + this.edge)
        const ts = this.size * 0.15 + this.size * 0.85 * waveE
        c.fillStyle = this.colors[i][j]
        c.fillRect(x + (this.size - ts) / 2, y + (this.size - ts) / 2, ts, ts)
      }
    }
  }

  destroy() { cancelAnimationFrame(this.rafId) }
}

// ── IMBA letterform paths (from the original SVG) ────────────────────────────
// viewBox: -4.3 147.8 1419.1 470.8
const LETTER_PATHS = `
  <rect x="-4.3" y="147.8" width="235.4" height="470.8" fill="white"/>
  <path fill="white" d="M483.5,353.2c-2.6,28.2-30.1,27.9-32.4-.3l-18.9-203.3-168.5-1.5v470.4h113.7l1.9-263.8c.2-28.2,28-31,30.7-3l25.8,266.9h61.8l25.8-266.6c2.7-27.9,30.5-25.2,30.7,3l1.9,263.6h132.2V148.1l-185,1.5-19.5,203.6h-.2Z"/>
  <path fill="white" d="M1009.7,148.3h-289.2v469.9h289.2c22.4,0,40.6-27.6,40.6-61.6v-96.1c0-34-18.2-61.6-40.6-61.6h-53.5c-8.7-1.5-15.4-12.8-15.4-26.3s7.3-25.7,16.5-26.4h52.4c22.4,0,40.6-27.6,40.6-61.6v-74.4c0-34-18.2-61.6-40.6-61.6h0ZM899.3,509.8c0,14-7.5,25.4-16.7,25.4h-15.3c-9.2,0-16.7-11.4-16.7-25.4v-65.6c0-20.5,10.9-37,24.4-37s24.4,16.6,24.4,37v65.6h-.1ZM899.3,329.3c0,14-7.5,25.4-16.7,25.4h-15.3c-9.2,0-16.7-11.4-16.7-25.4v-60c0-20.5,10.9-37,24.4-37s24.4,16.6,24.4,37v60h-.1Z"/>
  <path fill="white" d="M1367.7,147.8h-240.5c-24.9,0-45.1,30.6-45.1,68.3v402.3h141v-95.3c0-14,7.5-25.4,16.7-25.4h15.3c9.2,0,16.7,11.4,16.7,25.4v95.3h141V216.1c0-37.7-20.2-68.3-45.1-68.3h0ZM1271.8,311.6v60c0,14-7.5,25.4-16.7,25.4h-15.3c-9.2,0-16.7-11.4-16.7-25.4v-88.2c0-20.5,10.9-37,24.4-37s24.4,16.6,24.4,37v28.1h-.1Z"/>
`

const MASK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4.3 147.8 1419.1 470.8">${LETTER_PATHS}</svg>`
const MASK_URL = `url("data:image/svg+xml,${encodeURIComponent(MASK_SVG)}")`

export function AnimatedImbaLogo({
  height = 80,
  className,
  style,
}: {
  height?: number
  className?: string
  style?: React.CSSProperties
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<TiledSwirlEngine | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const id = setTimeout(() => {
      const engine = new TiledSwirlEngine(canvas)
      engineRef.current = engine
      const ro = new ResizeObserver(() => engine.resize())
      ro.observe(canvas)
      return () => { engine.destroy(); ro.disconnect() }
    }, 60)
    return () => clearTimeout(id)
  }, [])

  // If style is provided (fill-container mode), use it directly.
  // Otherwise use explicit height + calculated width.
  const ar = 1419.1 / 470.8
  const sizeStyle: React.CSSProperties = style
    ? { display: 'block', ...style }
    : { display: 'inline-block', width: Math.round(height * ar), height }

  return (
    <span
      className={className}
      aria-label={style ? undefined : 'IMBA'}
      style={{
        ...sizeStyle,
        WebkitMaskImage: MASK_URL,
        maskImage: MASK_URL,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </span>
  )
}
