import { useState, useMemo } from 'react'
import { isUrgent }         from '../utils/deadline'
import { sortTasks }        from '../utils/sort'

export function useTaskFilter(tasks) {
  const [search,     setSearch]     = useState('')
  const [priority,   setPriority]   = useState('all')
  const [status,     setStatus]     = useState('all')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [sortMode,   setSortMode]   = useState('smart')

  // useMemo: only recomputes when tasks or a filter value changes
  const filtered = useMemo(() => {
    let r = [...tasks]

    // Search — title or project name
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.project_title?.toLowerCase().includes(q)
      )
    }

    if (priority !== 'all') r = r.filter(t => t.priority === priority)
    if (status   !== 'all') r = r.filter(t => t.status   === status)
    if (urgentOnly)          r = r.filter(t => isUrgent(t.due_date))

    return sortTasks(r, sortMode)
  }, [tasks, search, priority, status, urgentOnly, sortMode])

  return {
    filtered, filteredCount: filtered.length, totalCount: tasks.length,
    search, setSearch, priority, setPriority,
    status, setStatus, urgentOnly, setUrgentOnly,
    sortMode, setSortMode
  }
}