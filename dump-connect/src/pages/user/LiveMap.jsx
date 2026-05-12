import { useEffect } from 'react'
import useStore from '../../store/useStore'
import MapView from '../../components/MapView'
import { jitterMove } from '../../services/simulateTrucks'

export default function LiveMap(){
  const trucks = useStore(s => s.trucks)
  const updateTruckPosition = useStore(s => s.updateTruckPosition)

  useEffect(()=>{
    const id = setInterval(()=>{
      trucks.forEach(t => {
        const next = jitterMove(t.latlng)
        updateTruckPosition(t.id, next)
      })
    }, 1500)
    return ()=> clearInterval(id)
  }, [trucks, updateTruckPosition])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Live Truck Tracking</h2>
      <MapView trucks={trucks} />
    </div>
  )
}
