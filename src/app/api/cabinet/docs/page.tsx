import type { Metadata } from 'next'
import { DocsContent } from '../../DocsContent'

export const metadata: Metadata = { title: 'Documentation' }

export default function CabinetDocs() {
  return (
    <div className="admin-root fade-up">
      <DocsContent embedded />
    </div>
  )
}
