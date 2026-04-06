// All priority visual logic in one place.
// Change here → updates everywhere automatically.
export const PRIORITY = {
  high: {
    label:    'High',
    dotColor: '#EF4444',
    badgeCls: 'bg-red-50 text-red-800 border border-red-200',
    sortVal:  3   // higher = sorts first
  },
  medium: {
    label:    'Medium',
    dotColor: '#F59E0B',
    badgeCls: 'bg-amber-50 text-amber-800 border border-amber-200',
    sortVal:  2
  },
  low: {
    label:    'Low',
    dotColor: '#10B981',
    badgeCls: 'bg-green-50 text-green-700 border border-green-200',
    sortVal:  1
  }
}

// Safe fallback if priority is undefined
export const getPriority = (p) => PRIORITY[p] || PRIORITY.medium