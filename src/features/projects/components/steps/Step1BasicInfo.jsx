import { useState } from 'react'
import { motion } from 'framer-motion'
import { Type, AlignLeft, FileText, Tag, X, Plus, AlertCircle } from 'lucide-react'
import { useProjectStore } from '../../projectStore'

const CATEGORIES = ['Robotics', 'AI & ML', 'IoT', 'Electronics', 'Automation', 'Mechanical Engineering', 'Other']
const DIFFICULTIES = [
  { value: 'Beginner', desc: 'Great for learning fundamentals' },
  { value: 'Intermediate', desc: 'Some experience required' },
  { value: 'Advanced', desc: 'Expert-level knowledge needed' },
]

function FieldLabel({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-brand-500 ml-1">*</span>}
    </label>
  )
}

function FieldError({ message }) {
  if (!message) return null
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-danger-500 text-xs mt-1.5 font-medium">
      <AlertCircle size={12} />{message}
    </motion.p>
  )
}

function CharCount({ value, max }) {
  const len = value?.length || 0
  const pct = len / max
  return (
    <span className={`text-xs ${pct > 0.9 ? 'text-danger-500' : pct > 0.7 ? 'text-warning-500' : 'text-gray-400'}`}>
      {len}/{max}
    </span>
  )
}

export default function Step1BasicInfo({ onNext }) {
  const { form, setField, addTag, removeTag } = useProjectStore()
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.title?.trim())            e.title = 'Project title is required.'
    else if (form.title.length < 5)     e.title = 'Title must be at least 5 characters.'
    if (!form.shortDescription?.trim()) e.shortDescription = 'Short description is required.'
    else if (form.shortDescription.length < 20) e.shortDescription = 'At least 20 characters required.'
    if (!form.category)                 e.category = 'Please select a category.'
    if (!form.difficulty)               e.difficulty = 'Please select a difficulty level.'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleNext = () => { if (validate()) onNext() }

  const handleTagKey = (e) => {
    if (['Enter', ',', ' '].includes(e.key)) {
      e.preventDefault()
      if (tagInput.trim()) { addTag(tagInput); setTagInput('') }
    }
  }

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all duration-200 bg-white ${
      errors[field]
        ? 'border-danger-300 focus:border-danger-400 focus:ring-2 focus:ring-danger-100'
        : 'border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'
    }`

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <FieldLabel required>Project Title</FieldLabel>
          <CharCount value={form.title} max={80} />
        </div>
        <div className="relative">
          <Type size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={form.title}
            onChange={(e) => { setField('title', e.target.value); if (errors.title) setErrors(p => ({...p, title: null})) }}
            placeholder="e.g. Autonomous Rover MK-IV with SLAM Navigation"
            maxLength={80}
            className={`${inputClass('title')} pl-10`}
          />
        </div>
        <FieldError message={errors.title} />
      </div>

      {/* Short description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <FieldLabel required>Short Description</FieldLabel>
          <CharCount value={form.shortDescription} max={200} />
        </div>
        <div className="relative">
          <AlignLeft size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <textarea
            value={form.shortDescription}
            onChange={(e) => { setField('shortDescription', e.target.value); if (errors.shortDescription) setErrors(p => ({...p, shortDescription: null})) }}
            placeholder="A one-sentence description that captures what makes your project unique..."
            maxLength={200}
            rows={2}
            className={`${inputClass('shortDescription')} pl-10 resize-none`}
          />
        </div>
        <FieldError message={errors.shortDescription} />
        <p className="text-xs text-gray-400 mt-1.5">This appears on project cards in search results.</p>
      </div>

      {/* Full description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <FieldLabel>Full Description</FieldLabel>
          <CharCount value={form.fullDescription} max={5000} />
        </div>
        <div className="relative">
          <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <textarea
            value={form.fullDescription}
            onChange={(e) => setField('fullDescription', e.target.value)}
            placeholder="Describe your project in detail — what it does, how it works, what makes it special. Markdown is supported."
            maxLength={5000}
            rows={6}
            className={`${inputClass('fullDescription')} pl-10 resize-none`}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Markdown supported. Tell the full story of your project.</p>
      </div>

      {/* Category + Difficulty — side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category */}
        <div>
          <FieldLabel required>Category</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setField('category', cat); if (errors.category) setErrors(p => ({...p, category: null})) }}
                className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                  form.category === cat
                    ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <FieldError message={errors.category} />
        </div>

        {/* Difficulty */}
        <div>
          <FieldLabel required>Difficulty Level</FieldLabel>
          <div className="space-y-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => { setField('difficulty', d.value); if (errors.difficulty) setErrors(p => ({...p, difficulty: null})) }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 ${
                  form.difficulty === d.value
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    d.value === 'Beginner' ? 'bg-success-500' : d.value === 'Intermediate' ? 'bg-warning-500' : 'bg-brand-500'
                  }`} />
                  <div>
                    <p className={`text-sm font-semibold ${form.difficulty === d.value ? 'text-brand-700' : 'text-gray-700'}`}>{d.value}</p>
                    <p className="text-xs text-gray-400">{d.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <FieldError message={errors.difficulty} />
        </div>
      </div>

      {/* Tags */}
      <div>
        <FieldLabel>Tags</FieldLabel>
        {/* Existing tags */}
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {form.tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl text-sm font-medium"
              >
                <Tag size={12} />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-brand-900 transition-colors ml-0.5"
                >
                  <X size={12} />
                </button>
              </motion.span>
            ))}
          </div>
        )}
        {/* Tag input */}
        <div className="relative">
          <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKey}
            placeholder="Type a tag and press Enter (e.g. ROS2, STM32, Python)"
            disabled={form.tags.length >= 10}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{form.tags.length}/10 tags · Press Enter, comma, or space to add.</p>
      </div>

      {/* Next button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-brand text-sm"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  )
}