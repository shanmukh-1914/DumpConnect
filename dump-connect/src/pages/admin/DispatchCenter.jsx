import useStore from '../../store/useStore'

export default function DispatchCenter(){
  const municipalCorporations = useStore(s => s.municipalCorporations)
  const dispatchTruck = useStore(s => s.dispatchTruck)

  return (
    <div className="space-y-4">
      <div className="glass p-4">
        <h3 className="font-medium">Dispatch Center</h3>
        <p className="text-sm text-slate-400">Approve or trigger dispatch to municipal corporations</p>
        <div className="mt-3 space-y-2">
          {municipalCorporations.map(a=> (
            <div key={a.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-slate-400">Requests: {a.requests || 0}</div>
              </div>
              <div>
                <button aria-label={`Dispatch to ${a.name}`} onClick={()=>{ dispatchTruck(a.id) }} className="px-3 py-1 bg-primary rounded text-white">Send Truck</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
