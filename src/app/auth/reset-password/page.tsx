import { Suspense } from 'react'
import { Logo } from '@/components/Logo'
import { ResetForm } from './ResetForm'

function FormSkeleton() {
  return (
    <div className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-5"><Logo size="lg" /></div>
        <div className="panel space-y-4">
          <div style={{ height: 72, background: 'var(--ink)', opacity: 0.05, borderRadius: 16 }} />
          <div style={{ height: 72, background: 'var(--ink)', opacity: 0.05, borderRadius: 16 }} />
          <div style={{ height: 48, background: 'var(--ink)', opacity: 0.1, borderRadius: 16 }} />
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ResetForm />
    </Suspense>
  )
}
