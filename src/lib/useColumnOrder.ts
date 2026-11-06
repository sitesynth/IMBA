'use client'
import { useEffect, useState, type DragEvent } from 'react'

const RESIZE_EDGE = 8 // keep in step with useResizableTableColumns: that strip resizes, it never drags

/**
 * Column order the user can change by dragging header cells; remembered in localStorage.
 * `ids` are the movable columns in their default order. Pages render cells in `order` and spread
 * `dragProps(id)` on each movable <th> (it also sets data-col, so saved widths follow the column).
 */
export function useColumnOrder(key: string, ids: string[]) {
  const [order, setOrder] = useState(ids)
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const idsKey = ids.join(',')

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null')
      if (!Array.isArray(saved)) return
      const known = saved.filter((id: string) => ids.includes(id))
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a saved preference after mount
      setOrder([...known, ...ids.filter((id) => !known.includes(id))])
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ids is compared by value via idsKey
  }, [key, idsKey])

  function save(next: string[]) {
    setOrder(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
  }

  function clear() {
    setDragging(null)
    setOver(null)
  }

  function dragProps(id: string) {
    return {
      'data-col': id,
      draggable: true,
      onDragStart: (e: DragEvent<HTMLElement>) => {
        if (e.currentTarget.getBoundingClientRect().right - e.clientX <= RESIZE_EDGE) {
          e.preventDefault()
          return
        }
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', id)
        // Chrome aborts the drag when the source element re-renders inside dragstart; React would
        // flush this state update (the dimming class) synchronously, so let the drag begin first.
        setTimeout(() => setDragging(id), 0)
      },
      onDragOver: (e: DragEvent<HTMLElement>) => {
        if (!dragging) return
        e.preventDefault()
        if (over !== id) setOver(id)
      },
      onDrop: (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        if (dragging && dragging !== id) {
          const next = order.filter((c) => c !== dragging)
          next.splice(next.indexOf(id) + (order.indexOf(dragging) < order.indexOf(id) ? 1 : 0), 0, dragging)
          save(next)
        }
        clear()
      },
      onDragEnd: clear,
    }
  }

  /** Extra classes for a movable header cell: dimmed while dragged, marked as the drop target. */
  function dragClass(id: string) {
    if (dragging === id) return 'opacity-40'
    if (dragging && over === id) return 'bg-blue-50 shadow-[inset_0_-2px_0_#2E7DF6]'
    return ''
  }

  function reset() {
    try { localStorage.removeItem(key) } catch {}
    setOrder(ids)
  }

  return { order, dragProps, dragClass, reset, isDefault: order.join(',') === idsKey }
}
