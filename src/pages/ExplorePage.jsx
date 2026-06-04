import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'

export default function ExplorePage() {
  return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-arc-500/15 border border-arc-500/25 flex items-center justify-center mx-auto mb-6">
          <Compass size={28} className="text-arc-400" />
        </div>
        <h1 className="font-display font-extrabold text-4xl text-white mb-3">Explore</h1>
        <p className="text-white/40 font-body text-lg max-w-md mx-auto">
          The explore experience is coming soon. Phase 2 build in progress.
        </p>
      </motion.div>
    </div>
  )
}
