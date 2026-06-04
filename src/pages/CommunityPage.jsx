import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-plasma-500/15 border border-plasma-500/25 flex items-center justify-center mx-auto mb-6">
          <Users size={28} className="text-plasma-400" />
        </div>
        <h1 className="font-display font-extrabold text-4xl text-white mb-3">Community</h1>
        <p className="text-white/40 font-body text-lg max-w-md mx-auto">
          Community hub is coming soon. Forums, teams and collaboration tools — Phase 2.
        </p>
      </motion.div>
    </div>
  )
}
