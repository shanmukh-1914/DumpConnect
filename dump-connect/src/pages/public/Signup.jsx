import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import useStore from '../../store/useStore'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const addUser = useStore(s => s.addUser)
  const users = useStore(s => s.users)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
      setError('Please fill all fields')
      return
    }

    const exists = users.find(u => u.email === email)
    if (exists) {
      setError('An account with this email already exists. Please login.')
      return
    }

    addUser({ name, email, password, role })
    setSuccess('Account created successfully — redirecting to Sign In...')
    // clear inputs
    setName('')
    setEmail('')
    setPassword('')
    // redirect after a short delay
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="grid gap-12 lg:grid-cols-2 w-full items-center">
        <div className="hidden lg:flex flex-col justify-start">
          <div className="mb-12">
            <Logo className="text-3xl" />
          </div>
          <h2 className="text-5xl font-bold mb-6">Get Started</h2>
          <p className="text-lg text-slate-400 mb-12">Create an account to begin managing waste collection efficiently.</p>
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">🌍</span>
              <div>
                <p className="font-semibold text-lg">Global Coverage</p>
                <p className="text-sm text-slate-400 mt-1">Access waste management across all regions</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">⚡</span>
              <div>
                <p className="font-semibold text-lg">Fast Setup</p>
                <p className="text-sm text-slate-400 mt-1">Get up and running in minutes</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">🔒</span>
              <div>
                <p className="font-semibold text-lg">Secure & Reliable</p>
                <p className="text-sm text-slate-400 mt-1">Enterprise-grade security for your data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">Create Account</h3>
              <p className="text-sm text-slate-400">Sign up to get started</p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-3">Full Name</label>
              <input
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-primary focus:outline-none transition hover:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Email Address</label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-primary focus:outline-none transition hover:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-primary focus:outline-none transition hover:border-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-4">Role</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'user', label: '👤 Citizen', desc: 'Request pickups' },
                  { value: 'admin', label: '🏛️ Admin', desc: 'Manage fleet' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`p-4 rounded-lg border transition duration-200 ${
                      role === opt.value
                        ? 'border-primary bg-primary/15 shadow-lg shadow-primary/20'
                        : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="font-semibold text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition duration-300">
              Create Account
            </button>

            <p className="text-center text-sm text-slate-400">
              Already have an account? <a href="/login" className="text-primary hover:text-accent transition">Sign In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
