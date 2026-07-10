'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function RefCapture() {
  const params = useSearchParams()
  useEffect(() => {
    const ref = params.get('ref')
    if (ref && /^[a-zA-Z0-9_-]{4,30}$/.test(ref)) {
      document.cookie = `imba_ref=${ref}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax`
    }
  }, [params])
  return null
}
