import { getPriority } from '../utils/priority'

export function PriorityBadge({ priority }) {
  const p = getPriority(priority)
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded font-mono ${p.badgeCls}`}>
      {p.label}
    </span>
  )
}

export function PriorityDot({ priority, size = 8 }) {
  const p = getPriority(priority)
  return (
    <span title={`${p.label} priority`}
      style={{width:size, height:size, minWidth:size, borderRadius:'50%',
        background:p.dotColor, display:'inline-block', flexShrink:0}}
    />
  )
}

// Usage anywhere: <PriorityBadge priority={task.priority} />
//                <PriorityDot    priority={task.priority} />