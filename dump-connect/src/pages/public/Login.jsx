import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import Logo from '../../components/Logo'

export default function Login() {
  const [role, setRole] = useState('user')
  const navigate = useNavigate()
  const login = useStore(s => s.login)

  function handleSubmit(e) {
    e.preventDefault()
    login(role)
    if (role === 'admin') navigate('/admin/profile')
    else navigate('/user')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-center min-h-[80vh]">
      <div className="hidden lg:flex flex-col justify-center">
        <div className="mb-8">
          <Logo className="text-3xl" />
        </div>
        <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
        <p className="text-lg text-slate-400 mb-8">Sign in to access your waste management dashboard.</p>
        <div className="space-y-4">
          <div className="flex gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <p className="font-medium">Live Tracking</p>
              <p className="text-sm text-slate-400">Monitor waste collection in real-time</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="font-medium">Smart Dispatch</p>
              <p className="text-sm text-slate-400">Automatic truck routing and dispatch</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-medium">Analytics</p>
              <p className="text-sm text-slate-400">Detailed reports and insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl border border-slate-700/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Sign In</h3>
            <p className="text-sm text-slate-400">Enter your credentials to continue</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input required type="email" placeholder="you@example.com" className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-primary focus:outline-none transition" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" required placeholder="••••••••" className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-primary focus:outline-none transition" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'user', label: '👤 Citizen', desc: 'Request pickups' },
                { value: 'admin', label: '🏛️ Admin', desc: 'Manage fleet' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={`p-3 rounded-lg border transition ${
                    role === opt.value
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs text-slate-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition">
            Sign In
          </button>

          <p className="text-center text-sm text-slate-400">
            No account? <a href="/signup" className="text-primary hover:text-accent transition">Create one</a>
          </p>
        </form>
      </div>
    </div>
  )
}
