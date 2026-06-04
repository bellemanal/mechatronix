import { motion } from 'framer-motion'
import { BookOpen, Code2, Users, Award, ArrowRight } from 'lucide-react'
import Section from '@/components/ui/Section'

const features = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Step-by-step builds, guides, and real-world documentation from expert engineers.',
    stat: '25K+ guides',
    color: 'brand',
  },
  {
    icon: Code2,
    title: 'Build',
    description: 'Access schematics, source code, CAD files, and fabrication tips.',
    stat: '12K+ projects',
    color: 'violet',
  },
  {
    icon: Users,
    title: 'Connect',
    description: 'Get feedback, collaborate, and grow with a global community of engineers.',
    stat: '50K+ engineers',
    color: 'success',
  },
  {
    icon: Award,
    title: 'Showcase',
    description: 'Publish your work and inspire the next generation of builders.',
    stat: '4.8K+ discussions',
    color: 'warning',
  },
]

const colorMap = {
  brand:   { icon: 'text-brand-500',   bg: 'bg-brand-50',   border: 'border-brand-100',   stat: 'text-brand-500'   },
  violet:  { icon: 'text-violet-500',  bg: 'bg-violet-50',  border: 'border-violet-100',  stat: 'text-violet-500'  },
  success: { icon: 'text-success-500', bg: 'bg-success-50', border: 'border-green-100',   stat: 'text-success-500' },
  warning: { icon: 'text-warning-500', bg: 'bg-warning-50', border: 'border-yellow-100',  stat: 'text-warning-500' },
}

export default function FeaturesSection() {
  return (
    <Section className="bg-white">
      <div className="text-center mb-14">
        <Section.Label>Platform Features</Section.Label>
        <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
          Built for Engineers,{' '}
          <span className="text-brand-gradient">By Engineers.</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Not another portfolio site. A real engineering knowledge base
          and collaboration hub where your work gets the attention it deserves.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon
          const c = colorMap[f.color]
          return (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:border-brand-100 transition-all duration-250 cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-5`}>
                <Icon size={20} className={c.icon} />
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className={`text-xs font-semibold ${c.stat}`}>{f.stat}</span>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
