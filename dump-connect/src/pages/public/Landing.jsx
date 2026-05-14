import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Zap, BarChart3, Truck, Clock, Shield } from 'lucide-react'

export default function Landing() {
  const features = [
    {
      icon: <MapPin size={32} />,
      title: 'Live Tracking',
      description: 'Track waste collection trucks in real-time with GPS precision and location-based features.',
      gradient: 'from-green-400/20 to-blue-500/20'
    },
    {
      icon: <Zap size={32} />,
      title: 'Smart Dispatch',
      description: 'AI-powered automatic routing based on demand, geolocation, and collection thresholds.',
      gradient: 'from-yellow-400/20 to-orange-500/20'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Real-time Analytics',
      description: 'Comprehensive insights into collection efficiency, trends, and performance metrics.',
      gradient: 'from-purple-400/20 to-pink-500/20'
    },
    {
      icon: <Truck size={32} />,
      title: 'Fleet Management',
      description: 'Manage your entire waste collection fleet with advanced monitoring and optimization.',
      gradient: 'from-blue-400/20 to-cyan-500/20'
    },
    {
      icon: <Clock size={32} />,
      title: 'ETA Prediction',
      description: 'Accurate delivery time estimation based on real-time traffic and location data.',
      gradient: 'from-red-400/20 to-pink-500/20'
    },
    {
      icon: <Shield size={32} />,
      title: 'Data Security',
      description: 'Enterprise-grade encryption and security for all your operational data.',
      gradient: 'from-emerald-400/20 to-green-500/20'
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 mb-12"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="inline-block"
            >
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-green-300">
                🚀 The Future of Waste Management
              </span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-7xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Smart Waste<br />Collection Now
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Real-time tracking, smart dispatch, and live analytics powered by your location. Revolutionize urban waste management.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all text-lg"
                >
                  Start Your Journey
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: 'rgba(34, 197, 94, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-gray-600 text-white font-bold rounded-xl hover:border-green-500/50 transition-all text-lg"
                >
                  Sign In
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 md:gap-8 pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { number: '500+', label: 'Active Trucks' },
                { number: '99.9%', label: 'Uptime' },
                { number: '50K+', label: 'Daily Collections' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="p-4"
                >
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to manage waste collection efficiently and sustainably
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={item}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.2)' }}
                className={`p-8 rounded-2xl border border-gray-700/50 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm hover:border-green-500/50 transition-all group`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="text-green-400 mb-4 group-hover:text-blue-400 transition-colors"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <motion.div
          whileInView={{ scale: 1 }}
          initial={{ scale: 0.95 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Waste Management?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of municipalities using DumpConnect for smarter waste collection
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all"
            >
              Get Started Free →
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}
