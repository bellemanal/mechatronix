import { motion } from 'framer-motion'
import { UserPlus, Compass, Upload, ArrowRight } from 'lucide-react'
import Section from '@/components/ui/Section'

const steps = [
  {
    number: '001',
    icon: UserPlus,
    title: 'Request Access',
    description: 'Create your free account. Admin approves within 24–48h. No spam, no subscriptions.',
    color: 'brand',
  },
  {
    number: '002',
    icon: Compass,
    title: 'Explore & Learn',
    description: 'Browse projects, watch demos, read documentation, and download resources.',
    color: 'violet',
  },
  {
    number: '003',
    icon: Upload,
    title: 'Share Your Build',
    description: 'Publish your own project with full docs, code, and demo. Get feedback.',
    color: 'success',
  },
]

const colMap = {
  brand:   { num: 'text-brand-500', bg: 'bg-brand-50', border: 'border-brand-100', icon: 'text-brand-500' },
  violet:  { num: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100', icon: 'text-violet-500' },
  success: { num: 'text-success-500', bg: 'bg-success-50', border: 'border-green-100', icon: 'text-success-500' },
}

export default function HowItWorksSection() {
  return (
    <Section gray>
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          <Section.LabelLeft>How It Works</Section.LabelLeft>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 leading-tight mb-4">
            From zero to published{' '}
            <span className="text-brand-gradient">in 3 steps.</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            We built MechaTronix so that getting started is frictionless and publishing your work is rewarding.
          </p>
        </div>

        {/* Right — steps */}
        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            const c = colMap[step.color]
            return (
              <motion.div key={step.number}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="flex items-start gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 group hover:shadow-md hover:border-brand-100 transition-all duration-250"
              >
                {/* Number + icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                    <Icon size={20} className={c.icon} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-mono text-xs font-semibold ${c.num} mb-1 tracking-widest`}>{step.number}</div>
                  <h3 className="font-bold text-base text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-400 flex-shrink-0 mt-1 transition-colors duration-200" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
