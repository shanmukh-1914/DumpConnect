import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-6">
        <div className="glass p-6 rounded-xl shadow-lg" role="main" aria-labelledby="auth-heading">
          <h1 id="auth-heading" className="sr-only">Authentication</h1>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
