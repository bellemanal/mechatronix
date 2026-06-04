import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const STEPS = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Media' },
  { number: 3, label: 'Team' },
  { number: 4, label: 'Details' },
  { number: 5, label: 'Links' },
  { number: 6, label: 'Publish' },
]

export default function StepIndicator({ currentStep, completedSteps, onStepClick }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const isComplete = completedSteps.has(step.number)
        const isCurrent  = currentStep === step.number
        const isReachable = isComplete || isCurrent || completedSteps.has(step.number - 1) || step.number === 1

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle */}
            <button
              onClick={() => isReachable && onStepClick?.(step.number)}
              disabled={!isReachable}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    backgroundColor: isComplete ? '#635BFF' : isCurrent ? '#635BFF' : '#F1F5F9',
                    borderColor: isComplete ? '#635BFF' : isCurrent ? '#635BFF' : '#E2E8F0',
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-shadow duration-200 ${
                    isCurrent ? 'shadow-brand' : ''
                  } ${isReachable ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {isComplete ? (
                    <Check size={14} className="text-white" strokeWidth={2.5} />
                  ) : (
                    <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                      {step.number}
                    </span>
                  )}
                </motion.div>

                {/* Active ring */}
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-brand-200 scale-125"
                  />
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] font-medium whitespace-nowrap ${
                isCurrent ? 'text-brand-600' : isComplete ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="w-10 sm:w-16 mx-1 mb-5">
                <div className="h-0.5 bg-gray-100 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-0 bg-brand-400 origin-left"
                    animate={{ scaleX: isComplete ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}