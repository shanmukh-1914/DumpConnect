import useStore from '../../store/useStore'

export default function RequestsAnalytics(){
  const municipalCorporations = useStore(s => s.municipalCorporations)
  const requests = useStore(s => s.requests)

  return (
    <div className="space-y-4">
      <div className="glass p-4">
        <h3 className="font-medium">Municipal Corporation Request Summary</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {municipalCorporations.map(a => (
            <li key={a.id} className="flex justify-between">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-slate-400">Population {a.population}</div>
              </div>
              <div className={`${(a.requests||0) > Math.ceil((a.population/10)*0.3) ? 'text-rose-400' : 'text-slate-300'}`}>{a.requests || 0} requests</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass p-4">
        <h3 className="font-medium">All Requests</h3>
        <div className="text-sm mt-2">Total: {requests.length}</div>
      </div>
    </div>
  )
}
