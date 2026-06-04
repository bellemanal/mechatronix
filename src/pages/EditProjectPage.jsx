import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProject } from '@/features/projects/useProjects'
import { updateProject } from '@/features/projects/projectService'
import { useAuthStore } from '@/features/auth/authStore'
import StepIndicator from '@/features/projects/components/StepIndicator'
import Step1BasicInfo from '@/features/projects/components/steps/Step1BasicInfo'
import Step2Media     from '@/features/projects/components/steps/Step2Media'
import Step3Team      from '@/features/projects/components/steps/Step3Team'
import Step4Details   from '@/features/projects/components/steps/Step4Details'
import Step5Links     from '@/features/projects/components/steps/Step5Links'
import { useProjectStore } from '@/features/projects/projectStore'

const STEP_META = [
  { title: 'Basic Information',  subtitle: 'Edit your project info'              },
  { title: 'Media',              subtitle: 'Update images, videos and files'     },
  { title: 'Team Members',       subtitle: 'Who worked on this with you?'        },
  { title: 'Project Details',    subtitle: 'Describe the problem and solution'   },
  { title: 'Links & Resources',  subtitle: 'Update useful links'                 },
]

// ── Step 6 replacement — Save Changes ─────────────────────────────────────────
function SaveStep({ onPrev, projectId, slug }) {
  const { form } = useProjectStore()
  const navigate  = useNavigate()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProject(projectId, form, null)
      toast.success('Project updated successfully! 🎉')
      navigate(`/projects/${slug}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update project.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 text-center">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Ready to save changes?</h3>
        <p className="text-sm text-gray-500">Review your changes and save them to update your project.</p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          ← Back
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-brand text-sm disabled:opacity-50"
        >
          {saving
            ? <><Loader size={15} className="animate-spin"/> Saving...</>
            : '💾 Save Changes'
          }
        </button>
      </div>
    </motion.div>
  )
}

export default function EditProjectPage() {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const { user }    = useAuthStore()
  const { data: project, isLoading, isError } = useProject(slug)
  const {
    form, setFields, setCoverImage,
    currentStep, completedSteps,
    nextStep, prevStep, setStep,
    lastSavedAt, resetForm,
  } = useProjectStore()

  const [initialized, setInitialized] = useState(false)

  // Load project data into store
  useEffect(() => {
    if (!project || initialized) return

    setFields({
      projectId:        project.id,
      title:            project.title || '',
      shortDescription: project.short_description || '',
      fullDescription:  project.full_description || '',
      category:         project.category || '',
      difficulty:       project.difficulty || '',
      tags:             project.tags || [],
      videoUrl:         project.video_url || '',
      technologies:     project.technologies || [],
      features:         project.features || [],
      challenges:       project.challenges || '',
      solution:         project.solution || '',
      futureImprovements: project.future_improvements || '',
      links:            (project.links || []).map(l => ({ ...l, id: l.id || crypto.randomUUID() })),
      teamMembers:      project.team_members?.length > 0
        ? project.team_members.map((m, i) => ({
            id:       m.id || crypto.randomUUID(),
            name:     m.name || '',
            role:     m.role || '',
            roles:    m.roles || (m.role ? [m.role] : []),
            github:   m.github || '',
            linkedin: m.linkedin || '',
            email:    m.email || '',
            phone:    m.phone || '',
            avatar:   m.avatar_url || null,
            isAuthor: m.is_author || i === 0,
          }))
        : [{ id: 'author', name: '', role: 'Project Lead', roles: ['Project Lead'], github: '', linkedin: '', email: '', phone: '', avatar: null, isAuthor: true }],
      images: (project.images || []).map((url, i) => ({
        id: `existing-${i}`,
        url,
        preview: url,
        uploading: false,
        progress: 100,
        error: null,
      })),
      files: [],
      published: project.published || false,
    })

    if (project.cover_image) {
      setCoverImage({
        url: project.cover_image,
        preview: project.cover_image,
        uploading: false,
        progress: 100,
      })
    }

    setInitialized(true)
  }, [project, initialized])

  // Check ownership
  useEffect(() => {
    if (project && user && project.firebase_uid !== user.uid) {
      toast.error('You can only edit your own projects.')
      navigate(`/projects/${slug}`)
    }
  }, [project, user])

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size={32} className="text-brand-500 animate-spin"/>
    </div>
  )

  if (isError || !project) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Project not found.
    </div>
  )

  const totalSteps = 6
  const meta = STEP_META[currentStep - 1] || { title: 'Save Changes', subtitle: 'Review and save' }

  const StepComponent = [
    Step1BasicInfo,
    Step2Media,
    Step3Team,
    Step4Details,
    Step5Links,
    null, // Save step
  ][currentStep - 1]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-brand-500 bg-brand-50 px-2 py-0.5 rounded-lg">
                  Editing
                </span>
                <span className="text-sm text-gray-500 truncate max-w-xs">{project.title}</span>
              </div>
              <h1 className="font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">{meta.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{meta.subtitle}</p>
            </div>
            {lastSavedAt && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={12}/>
                Draft saved
              </div>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 mb-6 overflow-x-auto">
          <StepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={setStep}
          />
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-8">
          <AnimatePresence mode="wait">
            {currentStep < 6 ? (
              <StepComponent
                key={currentStep}
                onNext={nextStep}
                onPrev={prevStep}
              />
            ) : (
              <SaveStep
                key="save"
                onPrev={prevStep}
                projectId={project.id}
                slug={project.slug}
              />
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  )
}