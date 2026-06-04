import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'

export default function CTASection() {
  return (
    <Section className="bg-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-violet-600 p-12 md:p-16"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid opacity-10" style={{ backgroundSize: '32px 32px' }} />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left max-w-xl">
            <h2 className="font-bold text-3xl md:text-4xl text-white leading-tight mb-4">
              Ready to build the future?
            </h2>
            <p className="text-white/75 text-lg leading-relaxed">
              Join thousands of engineers already creating, learning, and making an impact.
              Your next breakthrough project starts here.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="lg"
              className="bg-white text-brand-600 hover:bg-brand-50 border-0 shadow-lg font-bold"
              iconRight={<ArrowRight size={17} />}
            >
              Join MechaTronix
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </motion.div>
    </Section>  )
}
