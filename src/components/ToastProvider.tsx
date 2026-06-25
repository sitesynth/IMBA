'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'info' | 'success' | 'error'
interface Toast { id: string; message: string; type: ToastType }

const ToastCtx = createContext<(msg: string, type?: ToastType) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

function ToastBubble({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10)
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 350)
    }, 4200)
    return () => { clearTimeout(t1); clearTimeout(timerRef.current) }
  }, [])

  const bg = toast.type === 'success' ? 'var(--green)' : toast.type === 'error' ? '#ef4444' : 'var(--ink)'
  const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? AlertCircle : Info

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(() => onDismiss(toast.id), 300) }}
      style={{
        background: bg,
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        minWidth: 220,
        maxWidth: 320,
        cursor: 'pointer',
      }}
      className="flex items-start gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl select-none"
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2.5} />
      <span className="flex-1 leading-snug">{toast.message}</span>
      <X className="w-3.5 h-3.5 shrink-0 opacity-50 mt-0.5" strokeWidth={2.5} />
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <div
        className="fixed z-50 flex flex-col gap-2 items-end"
        style={{ bottom: 80, right: 16, pointerEvents: 'none' }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastBubble toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
