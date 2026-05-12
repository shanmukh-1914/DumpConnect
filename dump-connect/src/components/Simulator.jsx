import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { generateRoutePoints } from '../services/simulateTrucks'
import { toast } from 'react-toastify'

// Global simulator: moves trucks, follows routes, evaluates thresholds and auto-dispatches
export default function Simulator(){
  const trucks = useStore(s => s.trucks)
  const requests = useStore(s => s.requests)
  const updateTruckPosition = useStore(s => s.updateTruckPosition)
  const evaluateThresholds = useStore(s => s.evaluateThresholds)
  const dispatchTruck = useStore(s => s.dispatchTruck)
  const setTruckStatus = useStore(s => s.setTruckStatus)
  const setTruckRoute = useStore(s => s.setTruckRoute)
  const areas = useStore(s => s.areas)

  // local map of generated routes for trucks
  const routeMap = useRef({})

  useEffect(()=>{
    const tick = setInterval(()=>{
      // Move trucks along routes or wander when idle
      trucks.forEach(t => {
        // if truck has route array in store, advance along it
        if (t.route && t.route.length) {
          const idx = t.routeIndex || 0
          const nextIdx = Math.min(idx + 1, t.route.length - 1)
          const nextPos = t.route[nextIdx]
          updateTruckPosition(t.id, nextPos)
          // update routeIndex by calling setTruckRoute (store holds routeIndex)
          setTruckRoute(t.id, t.route) // ensure routeIndex initialized
          // store routeIndex increment locally
          t.routeIndex = nextIdx
          if (nextIdx === t.route.length - 1) {
            // reached destination
            setTruckStatus(t.id, 'collecting')
            setTimeout(()=>{
              setTruckStatus(t.id, 'completed')
              toast.success(`${t.label} completed collection`)
            }, 2000)
          }
        } else if (t.status === 'dispatched' && t.assignedArea) {
          // generate route towards assigned area
          const area = areas.find(a => a.id === t.assignedArea)
          if (area) {
            const route = generateRoutePoints(t.latlng, area.center, 30)
            setTruckRoute(t.id, route)
            // advance first step immediately
            updateTruckPosition(t.id, route[0])
          }
        } else {
          // wander a bit when idle
          const dLat = (Math.random() - 0.5) * 0.0006
          const dLng = (Math.random() - 0.5) * 0.0006
          updateTruckPosition(t.id, [t.latlng[0] + dLat, t.latlng[1] + dLng])
        }
      })

      // evaluate area thresholds and auto-dispatch for any triggered areas
      const triggered = evaluateThresholds()
      triggered.forEach(areaId => {
        const truck = dispatchTruck(areaId)
        if (truck) {
          toast.info(`Auto-dispatch: ${truck.label} sent to ${areaId}`)
        } else {
          toast.warn(`No idle trucks available for ${areaId}`)
        }
      })
    }, 1200)

    return ()=> clearInterval(tick)
  }, [trucks, requests])

  return null
}
