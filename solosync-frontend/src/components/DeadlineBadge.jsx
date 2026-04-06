import { getDeadlineInfo } from '../utils/deadline'

export default function DeadlineBadge({ deadline }) {
  const { label, badgeCls } = getDeadlineInfo(deadline)
  return (
    <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${badgeCls}`}>
      {label}
    </span>
  )
}
// <DeadlineBadge deadline={task.due_date} />
// <DeadlineBadge deadline={project.deadline} />