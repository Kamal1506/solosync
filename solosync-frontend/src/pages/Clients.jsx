import { useState, useEffect } from 'react'
import { getClients, createClient, deleteClient } from '../api/clients.api'

export default function Clients() {
  const [clients,  setClients]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showModal,setShowModal]= useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'' })
  const [saving, setSaving] = useState(false)

  // Fetch clients on mount
  useEffect(() => {
    getClients()
      .then(({ data }) => setClients(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data: newClient } = await createClient(form)

      // Optimistic update — add to list without refetching
      setClients(prev => [newClient, ...prev])
      setShowModal(false)
      setForm({ name:'', email:'', phone:'', company:'' })
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create client')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this client and all their projects?')) return
    await deleteClient(id)
    setClients(prev => prev.filter(c => c.id !== id))  // remove from state
  }

  if (loading) return <div>Loading clients...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Add Client
        </button>
      </div>

      {/* CLIENT TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {clients.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No clients yet. Add your first one.</p>
        ) : clients.map(client => (
          <div key={client.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <div>
              <p className="font-medium text-sm">{client.name}</p>
              <p className="text-xs text-gray-400">{client.email} · {client.company}</p>
            </div>
            <button onClick={() => handleDelete(client.id)}
              className="text-xs text-red-500 hover:underline">Delete</button>
          </div>
        ))}
      </div>

      {/* ADD CLIENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-4">Add Client</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {['name','email','phone','company'].map(field => (
                <input key={field} name={field}
                  value={form[field]}
                  onChange={e => setForm(p => ({...p, [e.target.name]: e.target.value}))}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required={field === 'name'}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              ))}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}