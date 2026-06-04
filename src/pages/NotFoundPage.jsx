import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cpu } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-orb bg-arc-500/10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="font-mono text-[120px] md:text-[180px] font-bold leading-none text-gradient-dual opacity-20 mb-4 select-none">
          404
        </div>
        <div className="w-14 h-14 rounded-2xl bg-surface-3 border border-white/[0.08] flex items-center justify-center mx-auto mb-6 -mt-8">
          <Cpu size={24} className="text-white/40" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-3">Page Not Found</h1>
        <p className="text-white/40 font-body text-base max-w-sm mx-auto mb-8">
          This circuit path doesn't exist. Let's get you back on track.
        </p>
        <Link to="/">
          <Button variant="plasma" icon={<ArrowLeft size={16} />}>
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
