export function getDeadlineInfo(deadline) {
  if (!deadline) return { label: 'No deadline', cls: 'text-gray-400' }
  const days = Math.ceil(
    (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
  )
  if (days < 0)  return { label: 'Overdue',     cls: 'text-red-600 bg-red-50' }
  if (days === 0) return { label: 'Due today',   cls: 'text-red-600 bg-red-50' }
  if (days <= 3)  return { label: `${days}d left`, cls: 'text-amber-700 bg-amber-50' }
  if (days <= 7)  return { label: `${days}d left`, cls: 'text-yellow-700 bg-yellow-50' }
  return { label: `${days}d left`, cls: 'text-green-700 bg-green-50' }
}