import { useState, useRef } from 'react'
import useStore from '../store/useStore'
import { toast } from 'react-toastify'

export default function DemoPlayback(){
  const corporations = useStore(s => s.municipalCorporations)
  const addRequest = useStore(s => s.addRequest)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  function startDemo({count = 30, speed = 400}){
    if (running) return
    setRunning(true)
    let sent = 0
    intervalRef.current = setInterval(()=>{
      const area = corporations[Math.floor(Math.random()*corporations.length)]
      const payload = { id: Date.now() + Math.random(), areaId: area.id, areaName: area.name, latlng: area.center, status: 'pending' }
      addRequest(payload)
      sent++
      if (sent % 5 === 0) toast.info(`${sent} demo requests generated`)
      if (sent >= count){
        stopDemo()
        toast.success('Demo playback completed')
      }
    }, speed)
  }

  function stopDemo(){
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  return (
    <div className="glass p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Demo Playback</div>
          <div className="text-xs text-slate-400">Simulate multiple user pickup requests to trigger dispatch.</div>
        </div>
        <div className="flex items-center gap-2">
          {!running ? (
            <button aria-label="Start demo" onClick={()=>startDemo({count:40, speed:300})} className="px-3 py-1 bg-accent text-black rounded">Start</button>
          ) : (
            <button aria-label="Stop demo" onClick={stopDemo} className="px-3 py-1 bg-red-600 text-white rounded">Stop</button>
          )}
        </div>
      </div>
    </div>
  )
}
