import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

// Full-screen loading spinner shown while Firebase restores session
function AuthLoading() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Animated logo */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-2xl border-2 border-plasma-500/30 border-t-plasma-500 flex items-center justify-center"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={18} className="text-plasma-400" />
          </div>
        </div>
        <span className="font-mono text-xs text-white/30 tracking-widest uppercase">
          Initializing...
        </span>
      </motion.div>
    </div>
  )
}

// Protects a route — redirects to /login if not authenticated
export default function ProtectedRoute({ children }) {
  const { user, initialized } = useAuthStore()
  const location = useLocation()

  // Wait for Firebase to restore session before deciding
  if (!initialized) {
    return <AuthLoading />
  }

  if (!user) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
