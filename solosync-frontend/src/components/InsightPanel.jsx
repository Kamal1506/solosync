const COLORS = { danger:'#EF4444', warning:'#F59E0B', info:'#3B82F6', success:'#10B981' }

export default function InsightPanel({ insights }) {
  if (!insights?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="font-semibold text-sm mb-3">Smart insights</h2>
      {insights.map((ins, i) => (
        <div key={i} className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0">
          <span style={{width:8,height:8,minWidth:8,marginTop:5,borderRadius:'50%',
            background:COLORS[ins.type],display:'inline-block'}} />
          <div>
            <p className="text-sm text-gray-800">{ins.text}</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{ins.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
// In Dashboard.jsx: const insights = generateInsights(data)
//                   <InsightPanel insights={insights} />