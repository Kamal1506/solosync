import { getDeadlineInfo } from './deadline'

// generateInsights(data) → [{ type, text, sub }, ...]
export function generateInsights({ stats, overduePayments, staleProjects }) {
  const out = []

  // 1. Overdue tasks
  if (stats.overdue_tasks > 0) {
    out.push({ type: 'danger',
      text: `${stats.overdue_tasks} task${stats.overdue_tasks > 1 ? 's are' : ' is'} overdue`,
      sub:  'action required · high priority' })
  }

  // 2. Old pending payments (30+ days)
  if (overduePayments?.length > 0) {
    const total = overduePayments.reduce((s, p) => s + Number(p.amount), 0)
    out.push({ type: 'warning',
      text: `₹${total.toLocaleString()} in pending payments older than 30 days`,
      sub:  `consider following up with ${overduePayments[0]?.client_name}` })
  }

  // 3. Stale projects
  staleProjects?.forEach(p => {
    const dl = getDeadlineInfo(p.deadline)
    out.push({ type: 'info',
      text: `${p.title} has no activity in ${p.days_since_activity} days`,
      sub:  dl.urgency > 1 ? `deadline ${dl.label} — may need attention` : 'low urgency' })
  })

  // 4. Completed but still "active" projects
  if (stats.projects_ready_to_invoice > 0) {
    out.push({ type: 'success',
      text: `${stats.projects_ready_to_invoice} project${
              stats.projects_ready_to_invoice > 1 ? 's are' : ' is'} 100% complete`,
      sub:  'consider marking completed and sending final invoice' })
  }

  // 5. All good fallback
  if (out.length === 0)
    out.push({ type: 'success',
      text: 'All caught up — no urgent items today',
      sub:  'good job staying on top of things' })

  return out
}