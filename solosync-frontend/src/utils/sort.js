import { getPriority }      from './priority'
import { getDeadlineInfo } from './deadline'

/**
 * sortTasks(tasks, mode) → sorted array (never mutates original)
 * modes: 'smart' | 'priority' | 'deadline' | 'created'
 */
export function sortTasks(tasks, mode = 'smart') {
  return [...tasks].sort((a, b) => {  // spread = never mutate state
    switch(mode) {

      case 'priority':
        return getPriority(b.priority).sortVal
               - getPriority(a.priority).sortVal

      case 'deadline':
        return byDeadline(a, b)

      case 'created':
        return new Date(b.created_at) - new Date(a.created_at)

      case 'smart':
      default: {
        // Step 1: compare by priority
        const diff = getPriority(b.priority).sortVal
                    - getPriority(a.priority).sortVal
        if (diff !== 0) return diff  // different priority → done
        // Step 2: same priority → use deadline urgency
        return byDeadline(a, b)
      }
    }
  })
}

// Helper: higher urgency first, no-deadline tasks go last
function byDeadline(a, b) {
  const ua = getDeadlineInfo(a.due_date).urgency
  const ub = getDeadlineInfo(b.due_date).urgency
  if (ua === 0 && ub !== 0) return  1  // a has no deadline → push back
  if (ub === 0 && ua !== 0) return -1  // b has no deadline → push back
  return ub - ua                         // higher urgency first
}