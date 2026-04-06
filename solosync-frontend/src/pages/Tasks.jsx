import { useState, useEffect } from 'react'
import { getTasks, updateStatus } from '../api/tasks.api'
import { useTaskFilter } from '../hooks/useTaskFilter'

const COLUMNS = [
  { key: 'todo',        label: 'To-do',      color: 'border-gray-300'  },
  { key: 'in_progress', label: 'In Progress', color: 'border-blue-400'  },
  { key: 'done',        label: 'Done',        color: 'border-green-400' }
]

const PRIORITY_DOT = {
  high:   'bg-red-500',
  medium: 'bg-amber-500',
  low:    'bg-green-500'
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const {
    filtered,
    search,
    setSearch,
    priority,
    setPriority,
    urgentOnly,
    setUrgentOnly,
    filteredCount,
    totalCount,
    sortMode,
    setSortMode
  } = useTaskFilter(tasks)

  useEffect(() => {
    getTasks().then(({ data }) => setTasks(data))
  }, [])

  // Group tasks by status — derived, no extra state
  const getColumn = (status) => filtered.filter(t => t.status === status)

  const moveTask = async (taskId, newStatus) => {
    // Update UI instantly (optimistic)
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ))
    try {
      await updateStatus(taskId, newStatus)
    } catch {
      // Rollback on failure — re-fetch from server
      getTasks().then(({ data }) => setTasks(data))
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-xs text-gray-400 font-mono mt-2">
            showing {filteredCount} of {totalCount} tasks
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64"
          />
          <div className="flex flex-wrap justify-end gap-2">
            {['all', 'high', 'medium', 'low'].map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`text-xs px-3 py-1 rounded-full border font-mono capitalize ${
                  priority === p
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`text-xs px-3 py-1 rounded-full border font-mono ${
                urgentOnly
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-gray-200 text-gray-500'
              }`}
            >
              urgent only
            </button>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {['smart', 'priority', 'deadline', 'created'].map(mode => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                className={`text-xs px-3 py-1 rounded-full border font-mono capitalize ${
                  sortMode === mode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(col => (
          <div key={col.key} className="bg-gray-50 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${col.color}`}>
              <h2 className="font-semibold text-sm">{col.label}</h2>
              <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                {getColumn(col.key).length}
              </span>
            </div>

            {getColumn(col.key).map(task => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`w-2 h-2 mt-1 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`}></span>
                  <p className="text-sm font-medium flex-1">{task.title}</p>
                </div>
                <p className="text-xs text-gray-400 mb-3">{task.project_title}</p>

                {/* Move buttons */}
                <div className="flex gap-1">
                  {COLUMNS.filter(c => c.key !== col.key).map(c => (
                    <button key={c.key} onClick={() => moveTask(task.id, c.key)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                      → {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
