import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'

export default function Landing() {
  return (
    <div className="space-y-16">
      <div className="grid gap-12 lg:grid-cols-2 items-center py-12">
        <section>
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">Smart Waste Management</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">DumpConnect — Waste Management Reimagined</h1>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">Real-time tracking, smart dispatch, and live analytics for city-scale waste collection. Experience the future of urban waste management.</p>
          <div className="flex gap-4">
            <Link to="/signup" className="px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition">Get Started</Link>
            <Link to="/login" className="px-6 py-3 border border-slate-600 rounded-lg text-white font-semibold hover:bg-slate-800/50 transition">Sign In</Link>
          </div>
        </section>

        <section className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-sm h-80 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
            <span className="text-9xl">♻️</span>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass p-6 rounded-xl hover:border-primary/50 transition">
          <div className="text-3xl mb-3">📍</div>
          <h3 className="font-semibold mb-2">Live Tracking</h3>
          <p className="text-sm text-slate-400">Track waste collection trucks in real-time on interactive maps with live location updates.</p>
        </div>
        <div className="glass p-6 rounded-xl hover:border-primary/50 transition">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-semibold mb-2">Smart Dispatch</h3>
          <p className="text-sm text-slate-400">Automatic truck routing based on demand, geolocation, and collection thresholds.</p>
        </div>
        <div className="glass p-6 rounded-xl hover:border-primary/50 transition">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold mb-2">Analytics</h3>
          <p className="text-sm text-slate-400">Comprehensive insights into collection efficiency, trends, and municipal performance metrics.</p>
        </div>
      </div>

      <div className="glass p-8 rounded-xl border-l-4 border-l-primary">
        <h3 className="text-2xl font-semibold mb-3">Ready to optimize waste management?</h3>
        <p className="text-slate-400 mb-6">Join municipalities and waste management agencies using DumpConnect to streamline operations.</p>
        <Link to="/signup" className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition">Start Your Free Demo</Link>
      </div>
    </div>
  )
}
