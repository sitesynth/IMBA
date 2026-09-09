'use client'

export function OpenSupportButton({ label = 'Написать в поддержку' }: { label?: string }) {
  return (
    <button
      onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Поддержка"], [aria-label="Support"]')?.click()}
      className="pill pill-ink pill-sm"
    >
      {label}
    </button>
  )
}
