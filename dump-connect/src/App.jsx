import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import Signup from './pages/public/Signup'
import UserDashboard from './pages/user/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import TruckManagement from './pages/admin/TruckManagement'
import RequestsAnalytics from './pages/admin/RequestsAnalytics'
import DispatchCenter from './pages/admin/DispatchCenter'
import Reports from './pages/admin/Reports'
import MunicipalProfile from './pages/admin/MunicipalProfile'
import LiveMap from './pages/user/LiveMap'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

function AnimatedRoutes(){
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route path="/about" element={<div className="p-6">About</div>} />
        <Route path="/features" element={<div className="p-6">Features</div>} />
        <Route path="/contact" element={<div className="p-6">Contact</div>} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route path="/user" element={<UserDashboard />} />
      <Route path="/user/map" element={<LiveMap />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/profile" element={<MunicipalProfile />} />
      <Route path="/admin/trucks" element={<TruckManagement />} />
      <Route path="/admin/requests" element={<RequestsAnalytics />} />
      <Route path="/admin/dispatch" element={<DispatchCenter />} />
      <Route path="/admin/reports" element={<Reports />} />

      <Route path="*" element={<div className="p-8">Not Found</div>} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
