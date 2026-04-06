import { useState, useEffect } from 'react'
import api from '../api/axios'

const STATUS_CONFIG = {
  paid:    { label: 'Paid',    cls: 'bg-green-50 text-green-700'  },
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700'  },
  overdue: { label: 'Overdue', cls: 'bg-red-50 text-red-700'      }
}

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [filter,   setFilter]   = useState('all')

  useEffect(() => {
    api.get('/payments').then(({ data }) => setPayments(data))
  }, [])

  const markAsPaid = async (id) => {
    await api.put(`/payments/${id}`, { status: 'paid', paid_date: new Date() })
    setPayments(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'paid' } : p
    ))
  }

  // Summary totals — derived from state
  const totalEarned  = payments.filter(p => p.status === 'paid')
                               .reduce((sum, p) => sum + Number(p.amount), 0)
  const totalPending = payments.filter(p => p.status === 'pending')
                               .reduce((sum, p) => sum + Number(p.amount), 0)

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  return (
    <div>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs text-green-600 mb-1">Total Earned</p>
          <p className="text-xl font-bold text-green-800">₹{totalEarned.toLocaleString()}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-xs text-amber-600 mb-1">Pending</p>
          <p className="text-xl font-bold text-amber-800">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Invoices</p>
          <p className="text-xl font-bold">{payments.length}</p>
        </div>
      </div>

      {/* Payment rows */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.map(pay => {
          const cfg = STATUS_CONFIG[pay.status]
          return (
            <div key={pay.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-sm">{pay.project_title}</p>
                <p className="text-xs text-gray-400">
                  Due {new Date(pay.due_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">₹{Number(pay.amount).toLocaleString()}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>
                {pay.status !== 'paid' && (
                  <button onClick={() => markAsPaid(pay.id)}
                    className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}