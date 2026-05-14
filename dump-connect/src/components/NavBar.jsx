import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const navItems = [
    { label: 'Dashboard', path: '/user', icon: '📊' },
    { label: 'Live Map', path: '/user/map', icon: '🗺️' },
    { label: 'Admin', path: '/admin', icon: '⚙️' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full top-0 z-50 backdrop-blur-md bg-gradient-to-r from-slate-900/80 to-blue-900/80 border-b border-blue-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-green-400 to-blue-500 p-2 rounded-lg"
            >
              <MapPin size={24} className="text-white" />
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                DumpConnect
              </span>
              <span className="text-xs text-gray-400 group-hover:text-green-400 transition-colors">
                Smart Waste Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </motion.button>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-2">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium hover:shadow-lg transition-all"
              >
                Sign Up
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={mobileOpen ? { height: 'auto' } : { height: 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <motion.button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                      : 'text-gray-300 hover:bg-slate-700/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </motion.button>
              </Link>
            ))}
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-slate-700/50 rounded-lg">
                Login
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
