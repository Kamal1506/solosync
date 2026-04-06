export default function ProgressBar({ pct = 0 }) {
  const color = pct >= 100 ? '#059669'
    : pct >= 60 ? '#2563EB'
    : pct >= 30 ? '#D97706'
    : '#9CA3AF'

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-500">completion</span>
        <span className="text-xs font-mono font-medium">{pct || 0}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct || 0}%`, background: color }}
        />
      </div>
    </div>
  )
}
