/**
 * getDeadlineInfo(dateString) → { label, badgeCls, urgency, daysLeft }
 * urgency: 5=overdue, 4=today, 3=soon(1-3d), 2=week(4-7d), 1=ok, 0=no deadline
 */
export function getDeadlineInfo(deadline) {
  if (!deadline) {
    return { label: 'No deadline', badgeCls: 'bg-gray-100 text-gray-500',
             urgency: 0, daysLeft: null }
  }

  // Strip time — compare dates only, prevents midnight boundary bug
  const today   = new Date(); today.setHours(0,0,0,0)
  const due     = new Date(deadline); due.setHours(0,0,0,0)
  const daysLeft = Math.round((due - today) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0)  return {
    label: `${Math.abs(daysLeft)}d overdue`,
    badgeCls: 'bg-red-50 text-red-800 border border-red-200',
    urgency: 5, daysLeft }
  if (daysLeft === 0) return {
    label: 'Due today',
    badgeCls: 'bg-red-50 text-red-800 border border-red-200',
    urgency: 4, daysLeft }
  if (daysLeft <= 3)  return {
    label: `${daysLeft}d left`,
    badgeCls: 'bg-amber-50 text-amber-800 border border-amber-200',
    urgency: 3, daysLeft }
  if (daysLeft <= 7)  return {
    label: `${daysLeft}d left`,
    badgeCls: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    urgency: 2, daysLeft }
  return {
    label: `${daysLeft}d left`,
    badgeCls: 'bg-green-50 text-green-700 border border-green-200',
    urgency: 1, daysLeft }
}

// Convenience: is this task urgent? (due today, soon, or overdue)
export const isUrgent = (deadline) => getDeadlineInfo(deadline).urgency >= 3