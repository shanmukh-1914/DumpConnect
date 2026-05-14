import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import NavBar from '../components/NavBar'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <NavBar />

      <main id="main" className="flex-grow" role="main">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-950/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-green-400 to-blue-500 p-2 rounded-lg">
                  <span className="text-xl">🗑️</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  DumpConnect
                </span>
              </div>
              <p className="text-sm text-slate-400">Smart waste management for modern cities.</p>
            </motion.div>

            {/* Product */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-green-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Demo</a></li>
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-green-400 transition">About</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Careers</a></li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-green-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Contact</a></li>
              </ul>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="border-t border-slate-700/30 origin-left"
          />

          {/* Bottom Section */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-500">
              © 2026 DumpConnect. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-green-400 transition text-sm">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-green-400 transition text-sm">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-green-400 transition text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
