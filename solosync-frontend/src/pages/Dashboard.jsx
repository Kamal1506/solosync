import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/dashboard')
        setData(res)
      } catch {
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])  // runs once when component mounts

  if (loading) return <div className="flex justify-center pt-20">Loading...</div>
  if (error)   return <div className="text-red-500 p-4">{error}</div>

  const { stats, todayTasks, urgentProjects } = data

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Good morning, {user?.name.split(' ')[0]}</h1>
      <p className="text-gray-500 text-sm mb-6">Here's what's happening today.</p>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Projects"   value={stats.active_projects}  />
        <StatCard label="Tasks Due Today"   value={stats.tasks_due_today}  />
        <StatCard label="Total Earned"
          value={`₹${Number(stats.total_earned).toLocaleString()}`} />
        <StatCard label="Pending Payments"
          value={`₹${Number(stats.pending_payments).toLocaleString()}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TODAY'S TASKS */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Tasks due today</h2>
          {todayTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tasks due today</p>
          ) : todayTasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <span className={`w-2 h-2 rounded-full ${
                task.priority === 'high'   ? 'bg-red-500'  :
                task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
              }`}></span>
              <span className="text-sm flex-1">{task.title}</span>
              <span className="text-xs text-gray-400">{task.project_title}</span>
            </div>
          ))}
        </div>

        {/* URGENT PROJECTS */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-semibold mb-3">Deadlines this week</h2>
          {urgentProjects.length === 0 ? (
            <p className="text-gray-400 text-sm">No urgent deadlines</p>
          ) : urgentProjects.map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium">{p.title}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                p.days_left <= 2 ? 'bg-red-50 text-red-600'  :
                p.days_left <= 5 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-700'
              }`}>
                {p.days_left === 0 ? 'Due today' : `${p.days_left}d left`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// StatCard sub-component — lives in this file or components/
function StatCard({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}