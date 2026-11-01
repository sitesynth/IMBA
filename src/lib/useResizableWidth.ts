'use client'
import { useCallback, useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'

/** Column width the user can drag; the value is remembered in localStorage. */
export function useResizableWidth(key: string, initial: number, min: number, max: number) {
  const [width, setWidth] = useState(initial)

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(key))
      if (saved >= min && saved <= max) setWidth(saved)
    } catch {}
  }, [key, min, max])

  const startDrag = useCallback((e: ReactMouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = width
    const clamp = (x: number) => Math.min(max, Math.max(min, startWidth + x - startX))

    const move = (ev: MouseEvent) => setWidth(clamp(ev.clientX))
    const up = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      try { localStorage.setItem(key, String(clamp(ev.clientX))) } catch {}
    }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }, [width, min, max, key])

  return { width, startDrag }
}
