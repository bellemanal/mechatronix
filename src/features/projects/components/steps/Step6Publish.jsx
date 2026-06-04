import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Eye, Send, Save, CheckCircle2, AlertCircle,
  Heart, MessageSquare, Layers, ExternalLink, Users, Code2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useProjectStore } from '../../projectStore'
import { saveDraft, publishProject } from '../../projectService'
import { useAuthStore } from '@/features/auth/authStore'

const difficultyColors = {
  Beginner:     'bg-success-50 text-success-600 border-green-200',
  Intermediate: 'bg-warning-50 text-warning-600 border-yellow-200',
  Advanced:     'bg-brand-50 text-brand-600 border-brand-200',
}

function ProjectPreviewCard({ form }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden max-w-sm">
      <div className="h-44 bg-gradient-to-br from-brand-50 via-gray-50 to-violet-50 relative overflow-hidden flex items-center justify-center">
        {form.coverImage?.preview || form.coverImage?.url ? (
          <img src={form.coverImage.preview || form.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-300 text-center">
            <Layers size={40} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">No cover image</p>
          </div>
        )}
        {form.category && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-brand text-[11px]">{form.category}</span>
          </div>
        )}
        {form.difficulty && (
          <div className="absolute top-3 right-3">
            <span className={`badge text-[10px] border ${difficultyColors[form.difficulty] || 'badge-gray'}`}>
              {form.difficulty}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">
          {form.title || 'Untitled Project'}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {form.shortDescription || 'No description provided.'}
        </p>
        {form.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {form.technologies.slice(0, 3).map((t) => (
              <span key={t} className="font-mono text-[10px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-lg">{t}</span>
            ))}
            {form.technologies.length > 3 && (
              <span className="text-[10px] text-gray-400">+{form.technologies.length - 3}</span>
            )}
          </div>
        )}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Heart size={13} /><span className="text-xs">0</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <MessageSquare size={13} /><span className="text-xs">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ done, label, required }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
        done ? 'bg-success-500' : required ? 'bg-danger-100 border-2 border-danger-300' : 'bg-gray-100'
      }`}>
        {done
          ? <CheckCircle2 size={12} className="text-white" />
          : required
            ? <AlertCircle size={10} className="text-danger-500" />
            : <div className="w-2 h-2 rounded-full bg-gray-300" />}
      </div>
      <span className={`text-sm ${done ? 'text-gray-700' : required ? 'text-danger-600 font-medium' : 'text-gray-400'}`}>
        {label}
        {required && !done && <span className="ml-1 text-danger-400 text-xs">Required</span>}
      </span>
    </div>
  )
}

export default function Step6Publish({ onPrev }) {
  const {
    form, isSubmitting, isSavingDraft,
    setSubmitting, setSavingDraft, setLastSavedAt, setProjectId, resetForm,
  } = useProjectStore()
  const { user } = useAuthStore()
  const navigate  = useNavigate()
  const [published, setPublished] = useState(false)

  const profileId = user?.profileId || null

  const checks = [
    { done: !!form.title?.trim(),            label: 'Project title',        required: true  },
    { done: !!form.shortDescription?.trim(), label: 'Short description',    required: true  },
    { done: !!form.category,                 label: 'Category selected',    required: true  },
    { done: !!form.difficulty,               label: 'Difficulty level',     required: true  },
    { done: !!form.coverImage?.url,          label: 'Cover image uploaded', required: false },
    { done: form.images.length > 0,          label: 'Gallery images added', required: false },
    { done: form.teamMembers.some((m) => m.name && (m.role || m.roles?.length > 0)), label: 'Team member info', required: false },
    { done: !!form.problem?.trim(),          label: 'Problem described',    required: false },
    { done: form.technologies.length > 0,   label: 'Technologies listed',  required: false },
    { done: form.links.length > 0,          label: 'Links added',          required: false },
  ]

  const requiredPassed = checks.filter((c) => c.required).every((c) => c.done)
  const score = Math.round((checks.filter((c) => c.done).length / checks.length) * 100)

  const handleSaveDraft = async () => {
    setSavingDraft(true)
    try {
      const result = await saveDraft(form.projectId, form, profileId)
      if (result?.id && !form.projectId) setProjectId(result.id)
      setLastSavedAt(new Date().toISOString())
      toast.success('Draft saved successfully!')
    } catch (err) {
      console.error('Save draft error:', err)
      toast.error(err.message || 'Failed to save draft.')
    } finally {
      setSavingDraft(false)
    }
  }

  const handlePublish = async () => {
    if (!requiredPassed) {
      toast.error('Please complete all required fields before publishing.')
      return
    }

    setSubmitting(true)
    try {
      let projectId = form.projectId

      // Save draft first
      const saved = await saveDraft(projectId, form, profileId)
      console.log('saveDraft result:', saved)

      if (!saved?.id) {
        throw new Error('Failed to save project. Please try again.')
      }

      projectId = saved.id
      setProjectId(projectId)

      // Publish
      const result = await publishProject(projectId)
      console.log('publishProject result:', result)

      if (!result?.slug) {
        throw new Error('Publish failed. Please try again.')
      }

      setPublished(true)
      toast.success('🚀 Project published successfully!')

      setTimeout(() => {
        resetForm()
        navigate(`/projects/${result.slug}`)
      }, 1500)

    } catch (err) {
      console.error('Publish error:', err)
      toast.error(err.message || 'Failed to publish project.')
    } finally {
      setSubmitting(false)
    }
  }

  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 size={48} className="text-success-500" />
        </motion.div>
        <h2 className="font-bold text-2xl text-gray-900 mb-2">🚀 Project Published!</h2>
        <p className="text-gray-500 text-base">Redirecting to your project page...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Eye size={16} className="text-brand-500" />
            Card Preview
          </h3>
          <ProjectPreviewCard form={form} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Images',       value: form.images.length,                             icon: Layers       },
              { label: 'Team',         value: form.teamMembers.filter((m) => m.name).length,  icon: Users        },
              { label: 'Technologies', value: form.technologies.length,                        icon: Code2        },
              { label: 'Links',        value: form.links.length,                               icon: ExternalLink },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-2">
                <Icon size={14} className="text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-500" />
            Publishing Checklist
          </h3>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Completeness</span>
              <span className={`text-sm font-bold ${score >= 70 ? 'text-success-600' : score >= 40 ? 'text-warning-600' : 'text-danger-600'}`}>
                {score}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${score >= 70 ? 'bg-success-500' : score >= 40 ? 'bg-warning-500' : 'bg-danger-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 divide-y divide-gray-50">
            {checks.map((c) => (
              <CheckItem key={c.label} done={c.done} label={c.label} required={c.required} />
            ))}
          </div>
          {!requiredPassed && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-danger-50 border border-danger-100 rounded-xl">
              <AlertCircle size={14} className="text-danger-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-danger-600 font-medium">
                Complete all required fields to publish. You can save as draft anytime.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
          >
            {isSavingDraft
              ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              : <Save size={15} />}
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={!requiredPassed || isSubmitting || isSavingDraft}
            className="flex items-center gap-2 px-8 py-3 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-brand text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send size={15} />}
            Publish Project
          </button>
        </div>
      </div>
    </motion.div>
  )
}