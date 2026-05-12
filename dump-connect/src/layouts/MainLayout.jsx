import { Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../components/Logo'

export default function MainLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="py-4 border-b border-slate-700/50 backdrop-blur-sm" role="banner">
        <div className="container-max px-4 flex items-center justify-between">
          <Link to="/" className="transition-transform hover:scale-105">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <nav className="space-x-6 text-sm">
              <Link to="/features" className="text-slate-300 hover:text-white transition">Features</Link>
              <Link to="/about" className="text-slate-300 hover:text-white transition">About</Link>
              <Link to="/contact" className="text-slate-300 hover:text-white transition">Contact</Link>
            </nav>
            <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg text-white font-medium hover:shadow-lg hover:shadow-primary/50 transition">Sign in</Link>
          </div>

          <button aria-label="Open menu" className="md:hidden p-2" onClick={()=>setOpen(v=>!v)}>
            <span aria-hidden="true" className="text-xl leading-none">☰</span>
          </button>
        </div>

        {open && (
          <nav className="md:hidden border-t border-slate-700" aria-label="Mobile navigation">
            <div className="px-4 py-3 flex flex-col gap-2">
              <Link to="/features" onClick={()=>setOpen(false)}>Features</Link>
              <Link to="/about" onClick={()=>setOpen(false)}>About</Link>
              <Link to="/contact" onClick={()=>setOpen(false)}>Contact</Link>
              <Link to="/login" className="mt-2 px-3 py-1 bg-primary rounded text-white" onClick={()=>setOpen(false)}>Sign in</Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="container-max px-4 py-8" role="main">
        <Outlet />
      </main>

      <footer className="py-8 mt-16 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-950/50">
        <div className="container-max px-4">
          <div className="grid gap-8 lg:grid-cols-4 mb-8">
            <div>
              <Logo className="mb-4" />
              <p className="text-xs text-slate-400">Smart waste management for modern cities.</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Contact</h4>
              <p className="text-xs text-slate-400">support@dumpconnect.io</p>
            </div>
          </div>
          <div className="border-t border-slate-700/30 pt-6 text-center">
            <p className="text-xs text-slate-500">© 2026 DumpConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
