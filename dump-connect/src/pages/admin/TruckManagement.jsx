import useStore from '../../store/useStore'
import { useState } from 'react'

export default function TruckManagement(){
  const trucks = useStore(s => s.trucks)
  const addTruck = useStore(s => s.addTruck)
  const removeTruck = useStore(s => s.removeTruck)
  const [label, setLabel] = useState('')

  function handleAdd(){
    const t = { id: `truck-${Date.now()}`, label: label || 'New', driver: 'TBD', status: 'idle', latlng: [28.704,77.103] }
    addTruck(t)
    setLabel('')
  }

  return (
    <div className="space-y-4">
      <div className="glass p-4">
        <h3 className="font-medium">Add Truck</h3>
        <div className="flex gap-2 mt-2">
          <input value={label} onChange={(e)=>setLabel(e.target.value)} className="flex-1 p-2 rounded bg-slate-900 border" placeholder="Label" />
          <button onClick={handleAdd} className="px-3 py-1 bg-primary rounded text-white">Add</button>
        </div>
      </div>

      <div className="glass p-4">
        <h3 className="font-medium">Trucks</h3>
        <ul className="mt-2 space-y-2">
          {trucks.map(t=> (
            <li key={t.id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{t.label}</div>
                <div className="text-xs text-slate-400">{t.driver} — {t.status}</div>
              </div>
              <div>
                <button aria-label={`Remove ${t.label}`} onClick={()=>removeTruck(t.id)} className="px-2 py-1 rounded bg-red-600 text-white text-sm">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
