'use client'
import { useEffect, type RefObject } from 'react'

const EDGE = 8        // px from a header cell's right border that grabs the column (useColumnOrder leaves it alone)
const MIN_WIDTH = 60
const KEY_PREFIX = 'admin.cols:'

/** /admin/users/3f2a… and /admin/users/42 share one layout. */
function pageKey() {
  return window.location.pathname
    .split('/')
    .map((s) => (/^[0-9a-f-]{8,}$/i.test(s) || /^\d+$/.test(s) ? ':id' : s))
    .join('/')
}

function storageKey(root: HTMLElement, table: HTMLTableElement) {
  const index = Array.from(root.querySelectorAll('table')).indexOf(table)
  return `${KEY_PREFIX}${pageKey()}:${index}`
}

function headerCells(table: HTMLTableElement): HTMLTableCellElement[] {
  const row = table.tHead?.rows[0]
  return row ? Array.from(row.cells) : []
}

/** Freeze every column at an explicit width so one can change without the others reflowing. */
function applyWidths(table: HTMLTableElement, widths: number[]) {
  const cells = headerCells(table)
  if (cells.length !== widths.length) return
  cells.forEach((th, i) => { th.style.width = `${widths[i]}px` })
  table.style.tableLayout = 'fixed'
  table.style.width = `${widths.reduce((a, b) => a + b, 0)}px`
  table.dataset.resized = '1'
}

/** Saved widths are keyed by data-col where a page sets it (columns it lets the user reorder), else by position. */
function cellKey(th: HTMLTableCellElement, i: number) {
  return th.dataset.col ?? `#${i}`
}

function savedWidths(table: HTMLTableElement, saved: unknown): number[] | null {
  const cells = headerCells(table)
  if (Array.isArray(saved)) return saved.length === cells.length ? saved : null
  if (!saved || typeof saved !== 'object') return null
  const map = saved as Record<string, number>
  return cells.map((th, i) => map[cellKey(th, i)] ?? th.getBoundingClientRect().width)
}

function resetWidths(table: HTMLTableElement) {
  headerCells(table).forEach((th) => { th.style.width = '' })
  table.style.tableLayout = ''
  table.style.width = ''
  delete table.dataset.resized
}

function nearRightEdge(th: HTMLElement, clientX: number) {
  return th.getBoundingClientRect().right - clientX <= EDGE
}

/**
 * Lets the user drag the right border of any table header cell inside `rootRef` to resize that
 * column; widths are remembered per page in localStorage. Double-click a border to reset the table.
 * Works by delegation, so pages keep plain <table> markup.
 */
export function useResizableTableColumns(rootRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const root = rootRef.current
    if (!active || !root) return

    const restore = () => {
      root.querySelectorAll('table').forEach((table) => {
        if (table.dataset.resized || !table.tHead) return
        try {
          const saved = JSON.parse(localStorage.getItem(storageKey(root, table)) || 'null')
          const widths = savedWidths(table, saved)
          if (widths) applyWidths(table, widths)
        } catch {}
      })
    }

    let frame = 0
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(restore)
    })
    observer.observe(root, { childList: true, subtree: true })
    restore()

    const headerCellAt = (e: MouseEvent) => {
      const th = (e.target as HTMLElement).closest('th')
      return th && th.closest('thead') && root.contains(th) ? (th as HTMLTableCellElement) : null
    }

    const onHover = (e: MouseEvent) => {
      const th = headerCellAt(e)
      if (th) th.style.cursor = nearRightEdge(th, e.clientX) ? 'col-resize' : ''
    }

    const onDown = (e: MouseEvent) => {
      const th = headerCellAt(e)
      if (!th || e.button !== 0 || !nearRightEdge(th, e.clientX)) return
      const table = th.closest('table') as HTMLTableElement
      e.preventDefault()
      window.getSelection()?.removeAllRanges()

      const cells = headerCells(table)
      const widths = cells.map((c) => c.getBoundingClientRect().width)
      const col = cells.indexOf(th)
      const startX = e.clientX
      const startWidth = widths[col]
      applyWidths(table, widths)

      const move = (ev: MouseEvent) => {
        widths[col] = Math.max(MIN_WIDTH, startWidth + ev.clientX - startX)
        applyWidths(table, widths)
      }
      const up = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
        // the mouseup that ends a resize must not also click the header (it sorts on some pages)
        const swallow = (ce: MouseEvent) => { ce.stopPropagation(); ce.preventDefault() }
        window.addEventListener('click', swallow, { capture: true, once: true })
        setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)
        const map = Object.fromEntries(cells.map((c, i) => [cellKey(c, i), Math.round(widths[i])]))
        try { localStorage.setItem(storageKey(root, table), JSON.stringify(map)) } catch {}
      }
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', up)
    }

    const onDoubleClick = (e: MouseEvent) => {
      const th = headerCellAt(e)
      if (!th || !nearRightEdge(th, e.clientX)) return
      const table = th.closest('table') as HTMLTableElement
      try { localStorage.removeItem(storageKey(root, table)) } catch {}
      resetWidths(table)
    }

    root.addEventListener('mousemove', onHover)
    root.addEventListener('mousedown', onDown)
    root.addEventListener('dblclick', onDoubleClick)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      root.removeEventListener('mousemove', onHover)
      root.removeEventListener('mousedown', onDown)
      root.removeEventListener('dblclick', onDoubleClick)
    }
  }, [rootRef, active])
}
