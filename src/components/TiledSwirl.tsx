'use client'
import { useEffect, useRef } from 'react'

class Utils {
  static random() {
    return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
  }
  static smoothStep(x: number, edge1: number, edge2: number) {
    x = Math.max(0, Math.min(1, (x - edge1) / (edge2 - edge1)))
    return x * x * (3 - 2 * x)
  }
}

class TiledSwirl {
  density = 28
  edge = 0.1
  ripple = 5
  speed = 0.025
  tightness = 3
  // IMBA palette: deep navy base + blue, violet, cyan-blue, yellow accent
  palette = [
    '#1452C9',   // deep blue (base)
    '#5AA0FF',   // light blue
    '#C9A4FF',   // violet
    '#55DB9C',   // green accent
  ]

  private rows = 0
  private cols = 0
  private size = 0
  private time = 0
  private distanceMax = 0
  private colors: string[][] = []
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D | null
  private rafId = 0
  private container: HTMLElement

  constructor(canvas: HTMLCanvasElement, container: HTMLElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.container = container
    this.resize()
    this.colorsInit()
    this.animate()
  }

  resize() {
    const ratio = window.devicePixelRatio || 1
    const w = this.container.clientWidth
    const h = this.container.clientHeight

    this.canvas.width = w * ratio
    this.canvas.height = h * ratio
    this.canvas.style.width = w + 'px'
    this.canvas.style.height = h + 'px'

    this.ctx?.resetTransform()
    this.ctx?.scale(ratio, ratio)

    this.size = Math.min(w, h) / this.density
    this.cols = Math.ceil(w / this.size) + 1
    this.rows = Math.ceil(h / this.size) + 1

    const hw = w / 2, hh = h / 2
    this.distanceMax = Math.sqrt(hw * hw + hh * hh)
  }

  private colorsInit() {
    this.colors = []
    for (let i = 0; i < this.cols; i++) {
      this.colors[i] = []
      for (let j = 0; j < this.rows; j++) {
        this.colors[i][j] = this.palette[Math.floor(Utils.random() * this.palette.length)]
      }
    }
  }

  private animate() {
    this.rafId = requestAnimationFrame(this.animate.bind(this))
    if (!this.ctx) return
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    this.ctx.clearRect(0, 0, w, h)
    this.time += this.speed
    this.draw(w, h)
  }

  private draw(w: number, h: number) {
    if (!this.ctx) return
    const cx = w / 2, cy = h / 2

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (!this.colors[i] || !this.colors[i][j]) continue
        const x = i * this.size
        const y = j * this.size
        const dx = x + this.size / 2 - cx
        const dy = y + this.size / 2 - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const distN = dist / this.distanceMax
        const angle = Math.atan2(dy, dx)
        const ripF = this.tightness * (1 + distN * this.ripple)
        const wave = Math.sin(distN * ripF + angle - this.time)
        const waveN = (wave + 1) / 2
        const edge1 = 0.5 - this.edge
        const edge2 = 0.5 + this.edge
        const waveE = Utils.smoothStep(waveN, edge1, edge2)
        const ts = this.size * 0.2 + this.size * 0.8 * waveE
        const tx = x + (this.size - ts) / 2
        const ty = y + (this.size - ts) / 2
        this.ctx.fillStyle = this.colors[i][j]
        this.ctx.fillRect(tx, ty, ts, ts)
      }
    }
  }

  destroy() {
    cancelAnimationFrame(this.rafId)
  }
}

export function TiledSwirlCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const swirlRef = useRef<TiledSwirl | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const swirl = new TiledSwirl(canvas, container)
    swirlRef.current = swirl

    const observer = new ResizeObserver(() => {
      swirl.resize()
    })
    observer.observe(container)

    return () => {
      swirl.destroy()
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden rounded-[2.5rem]" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" style={{ display: 'block' }} />
    </div>
  )
}
