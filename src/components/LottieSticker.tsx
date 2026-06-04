'use client'
import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'

type LottieData = Record<string, unknown>

const cache = new Map<string, LottieData>()

export function LottieSticker({
  name,
  size = 110,
  className,
  style,
  loop = true,
}: {
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
  loop?: boolean
}) {
  const [data, setData] = useState<LottieData | null>(cache.get(name) ?? null)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (data) return
    let alive = true
    fetch(`/lottie/${name}.json`)
      .then((r) => r.json())
      .then((json) => {
        cache.set(name, json)
        if (alive) setData(json)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [name, data])

  if (!data) {
    return <span className={className} style={{ width: size, height: size, display: 'inline-block', ...style }} />
  }

  return (
    <div className={className} style={{ width: size, height: size, ...style }}>
      <Lottie animationData={data} loop={loop} autoplay={!reduce.current} />
    </div>
  )
}
