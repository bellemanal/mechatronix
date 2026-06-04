import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Layers, Users, Globe, Zap, Heart } from 'lucide-react'

const badges = [
  { value: 'Community Driven', icon: Users,  color: 'text-brand-500',   bg: 'bg-brand-50'   },
  { value: 'Open Source',      icon: Globe,  color: 'text-success-500', bg: 'bg-success-50' },
  { value: 'Free Access',      icon: Heart,  color: 'text-violet-500',  bg: 'bg-violet-50'  },
  { value: 'Engineering Focused', icon: Zap, color: 'text-brand-500',   bg: 'bg-brand-50'   },
  { value: 'Early Access',     icon: Layers, color: 'text-warning-500', bg: 'bg-warning-50' },
]

export default function StatsBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="bg-white border-y border-gray-100 py-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5">
          {badges.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="relative flex items-center gap-3 py-6 px-6"
              >
                {i > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-gray-100 hidden md:block" />
                )}
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={s.color} />
                </div>
                <div className="font-semibold text-sm text-gray-700 leading-tight">
                  {s.value}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}