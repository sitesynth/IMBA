'use client'
import { useEffect, useState } from 'react'
import { FileText, CheckCircle } from 'lucide-react'
import { getInvoices, markInvoicePaid, AdminApiError, Invoice } from '@/lib/admin-api'

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch (e) {
      if (e instanceof AdminApiError) {
        setError(e.message)
      } else {
        setError((e as Error).message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      await markInvoicePaid(invoiceId)
      await fetchInvoices()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  const activeCount = invoices.filter(i => i.status !== 'paid').length
  const paidCount = invoices.filter(i => i.status === 'paid').length

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="w-8 h-8" /> Invoices
        </h1>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{activeCount}</div>
            <div className="text-sm text-gray-600">Unpaid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{paidCount}</div>
            <div className="text-sm text-gray-600">Paid</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Issued</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono">{inv.invoice_number}</td>
                  <td className="px-6 py-4 text-sm">{inv.email || '—'}</td>
                  <td className="px-6 py-4 text-sm font-mono">${inv.amount.toFixed(2)} {inv.currency}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                      inv.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
