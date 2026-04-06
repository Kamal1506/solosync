import { useState, useEffect } from 'react'
import api from '../api/axios'
import { getDeadlineInfo } from '../utils/deadline'
import ProgressBar from '../components/ProgressBar'

const STATUS_STYLES = {
  active:    'bg-green-50 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  paused:    'bg-amber-50 text-amber-700'
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filter, setFilter]     = useState('all')  // filter by status

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data))
  }, [])

  // Derived state — filter without extra useEffect
  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter)

  const updateStatus = async (id, status) => {
    await api.put(`/projects/${id}`, { status })
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'active', 'completed', 'paused'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{s}</button>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(project => {
          const deadline = getDeadlineInfo(project.deadline)
          const pct = project.completion_pct || 0
          return (
            <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[project.status]}`}>
                  {project.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${deadline.cls}`}>
                  {deadline.label}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{project.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{project.client_name}</p>
              {/* Progress bar */}
              <ProgressBar pct={pct} />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{project.done_tasks || 0}/{project.total_tasks || 0} tasks done</span>
                <span>₹{Number(project.budget).toLocaleString()}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
