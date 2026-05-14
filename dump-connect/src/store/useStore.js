import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import trucksMock from '../mockData/trucks'
import municipalCorporationsMock from '../mockData/municipalCorporations'

const SESSION_KEY = 'dumpconnect-session'

function readSession() {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, role: null, selectedCorporationId: null }
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return { isAuthenticated: false, role: null, selectedCorporationId: null }
    const parsed = JSON.parse(raw)
    return {
      isAuthenticated: Boolean(parsed.isAuthenticated),
      role: parsed.role ?? null,
      selectedCorporationId: parsed.selectedCorporationId ?? null
    }
  } catch {
    return { isAuthenticated: false, role: null, selectedCorporationId: null }
  }
}

function persistSession(session) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

const initialSession = readSession()

const useStore = create(devtools((set, get) => ({
  trucks: trucksMock,
  municipalCorporations: municipalCorporationsMock.map(m => ({ ...m, requests: 0, alerted: false })),
  requests: [],
  users: [],
  isAuthenticated: initialSession.isAuthenticated,
  role: initialSession.role,
  selectedCorporationId: initialSession.selectedCorporationId,

  // Add a pickup request and update area request counters.
  addRequest: (req) => {
    set((state) => {
      const requests = [...state.requests, req]
      const municipalCorporations = state.municipalCorporations.map(a => {
        if (a.id === req.areaId) return { ...a, requests: (a.requests || 0) + 1 }
        return a
      })
      return { requests, municipalCorporations }
    })
  },

  clearRequests: () => set({ requests: [], municipalCorporations: get().municipalCorporations.map(a=> ({...a, requests:0, alerted:false})) }),

  login: (role, selectedCorporationId = null) => {
    const session = { isAuthenticated: true, role, selectedCorporationId }
    persistSession(session)
    set(session)
  },

  logout: () => {
    const session = { isAuthenticated: false, role: null, selectedCorporationId: null }
    persistSession(session)
    set(session)
  },

  setSelectedCorporationId: (selectedCorporationId) => {
    const current = get()
    const session = { isAuthenticated: current.isAuthenticated, role: current.role, selectedCorporationId }
    persistSession(session)
    set({ selectedCorporationId })
  },

  updateTruckPosition: (id, latlng) => {
    set((state) => ({
      trucks: state.trucks.map(t => t.id === id ? { ...t, latlng } : t)
    }))
  },

  // Dispatch a truck to an area. Returns dispatched truck or null.
  dispatchTruck: (areaId) => {
    const state = get()
    const idle = state.trucks.find(t => t.status === 'idle' || t.status === 'completed')
    if (!idle) return null
    const updated = state.trucks.map(t => t.id === idle.id ? { ...t, status: 'dispatched', assignedArea: areaId } : t)
    // mark area alerted true
    const municipalCorporations = state.municipalCorporations.map(a => a.id === areaId ? { ...a, alerted: true } : a)
    set({ trucks: updated, municipalCorporations })
    return idle
  },

  // Admin actions
  addTruck: (truck) => set(state => ({ trucks: [...state.trucks, truck] })),
  removeTruck: (id) => set(state => ({ trucks: state.trucks.filter(t => t.id !== id) })),

  // Set truck status and optional assigned area
  setTruckStatus: (id, status) => set(state => ({ trucks: state.trucks.map(t => t.id === id ? { ...t, status } : t) })),
  setTruckRoute: (id, route) => set(state => ({ trucks: state.trucks.map(t => t.id === id ? { ...t, route, routeIndex: 0 } : t) })),

  // Update request status
  updateRequestStatus: (requestId, newStatus) => set(state => ({
    requests: state.requests.map(r => r.id === requestId ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r)
  })),

  // Evaluate thresholds for areas and return list of areas crossing threshold
  evaluateThresholds: () => {
    const state = get()
    const triggered = []
    const municipalCorporations = state.municipalCorporations.map(a => {
      // For prototype demo, scale population down so thresholds are reachable.
      const effectivePop = Math.max(10, Math.floor(a.population / 10))
      const thresholdCount = Math.ceil(effectivePop * 0.3)
      if ((a.requests || 0) >= thresholdCount && !a.alerted) {
        triggered.push(a.id)
        return { ...a, alerted: true }
      }
      return a
    })
    if (triggered.length) set({ municipalCorporations })
    return triggered
  }
})))

export default useStore
