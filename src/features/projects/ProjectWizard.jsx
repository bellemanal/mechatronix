import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProjectStore } from './projectStore'
import StepIndicator from './components/StepIndicator'    // ✅
import Step1BasicInfo from './components/steps/Step1BasicInfo'
import Step2Media     from './components/steps/Step2Media'
import Step3Team      from './components/steps/Step3Team'
import Step4Details   from './components/steps/Step4Details'
import Step5Links     from './components/steps/Step5Links'
import Step6Publish   from './components/steps/Step6Publish'
import { useAuth }    from '@/features/auth/useAuth'

const STEP_META = [
  { title: 'Basic Information',  subtitle: 'Tell us about your project'            },
  { title: 'Media',              subtitle: 'Add images, videos and files'          },
  { title: 'Team Members',       subtitle: 'Who worked on this with you?'          },
  { title: 'Project Details',    subtitle: 'Describe the problem and your solution'},
  { title: 'Links & Resources',  subtitle: 'Add useful links to your project'      },
  { title: 'Preview & Publish',  subtitle: 'Review and publish your project'       },
]

export default function ProjectWizard() {
  const navigate = useNavigate()
  const { isAuthenticated, initialized } = useAuth()
  const {
    currentStep, totalSteps,
    completedSteps, lastSavedAt,
    nextStep, prevStep, setStep,
  } = useProjectStore()

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      toast.error('Please sign in to create a project.')
      navigate('/login', { state: { from: { pathname: '/projects/create' } } })
    }
  }, [initialized, isAuthenticated, navigate])

  if (!isAuthenticated && initialized) return null

  const meta = STEP_META[currentStep - 1]

  const StepComponent = [
    Step1BasicInfo,
    Step2Media,
    Step3Team,
    Step4Details,
    Step5Links,
    Step6Publish,
  ][currentStep - 1]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">{meta.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{meta.subtitle}</p>
            </div>
            {lastSavedAt && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={12} />
                Draft saved
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 mb-6 overflow-x-auto">
          <StepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={setStep}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8">
          <AnimatePresence mode="wait">
            <StepComponent
              key={currentStep}
              onNext={nextStep}
              onPrev={prevStep}
            />
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  )
}
