import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Github, Youtube, Globe, FileText, Figma, ExternalLink, Link, Trash2 } from 'lucide-react'
import { useProjectStore } from '../../projectStore'

const LINK_PRESETS = [
  { label: 'GitHub',        icon: 'github',   placeholder: 'https://github.com/username/repo' },
  { label: 'YouTube Demo',  icon: 'youtube',  placeholder: 'https://youtube.com/watch?v=...' },
  { label: 'Live Website',  icon: 'globe',    placeholder: 'https://yourproject.com' },
  { label: 'Documentation', icon: 'docs',     placeholder: 'https://docs.yourproject.com' },
  { label: 'Figma',         icon: 'figma',    placeholder: 'https://figma.com/file/...' },
  { label: 'Behance',       icon: 'behance',  placeholder: 'https://behance.net/gallery/...' },
  { label: 'Google Drive',  icon: 'drive',    placeholder: 'https://drive.google.com/...' },
  { label: 'Custom Link',   icon: 'link',     placeholder: 'https://...' },
]

function getIcon(icon, size = 16) {
  const cls = 'flex-shrink-0'
  switch (icon) {
    case 'github':   return <Github size={size} className={cls} />
    case 'youtube':  return <Youtube size={size} className={`${cls} text-red-500`} />
    case 'globe':    return <Globe size={size} className={cls} />
    case 'docs':     return <FileText size={size} className={cls} />
    case 'figma':    return <Figma size={size} className={cls} />
    case 'behance':  return <ExternalLink size={size} className={cls} />
    case 'drive':    return <ExternalLink size={size} className={cls} />
    default:         return <Link size={size} className={cls} />
  }
}

function LinkCard({ link, onUpdate, onRemove }) {
  const preset = LINK_PRESETS.find((p) => p.label === link.label) || LINK_PRESETS[7]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-xs group"
    >
      {/* Icon */}
      <div className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-500">
        {getIcon(link.icon)}
      </div>

      {/* Label */}
      <div className="w-36 flex-shrink-0">
        <select
          value={link.label}
          onChange={(e) => {
            const preset = LINK_PRESETS.find((p) => p.label === e.target.value)
            onUpdate(link.id, { label: e.target.value, icon: preset?.icon || 'link' })
          }}
          className="w-full border-0 bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
        >
          {LINK_PRESETS.map((p) => (
            <option key={p.label} value={p.label}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* URL */}
      <div className="relative flex-1">
        <input
          type="url"
          value={link.url}
          onChange={(e) => onUpdate(link.id, { url: e.target.value })}
          placeholder={preset.placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-gray-50 transition-all"
        />
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(link.id)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-danger-500 hover:bg-danger-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}

export default function Step5Links({ onNext, onPrev }) {
  const { form, addLink, updateLink, removeLink } = useProjectStore()
  const [selectedPreset, setSelectedPreset] = useState(LINK_PRESETS[0].label)

  const handleAddLink = () => {
    const preset = LINK_PRESETS.find((p) => p.label === selectedPreset) || LINK_PRESETS[0]
    addLink({ label: preset.label, url: '', icon: preset.icon })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Info banner */}
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4">
        <p className="text-sm text-brand-700 font-medium">
          Add links to your project's repository, demo, documentation, and more.
          These appear on your project page for the community to explore.
        </p>
      </div>

      {/* Existing links */}
      {form.links.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {form.links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onUpdate={updateLink}
                onRemove={removeLink}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Quick add row */}
      <div className="flex gap-2">
        <select
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white appearance-none cursor-pointer"
        >
          {LINK_PRESETS.map((p) => (
            <option key={p.label} value={p.label}>
              {p.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddLink}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 shadow-brand transition-colors"
        >
          <Plus size={16} />
          Add Link
        </button>
      </div>

      {/* Preset quick-add buttons */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">Quick Add</p>
        <div className="flex flex-wrap gap-2">
          {LINK_PRESETS.slice(0, 6).map((preset) => (
            <button
              key={preset.label}
              onClick={() => addLink({ label: preset.label, url: '', icon: preset.icon })}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50 transition-all duration-150"
            >
              {getIcon(preset.icon, 13)}
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button onClick={onPrev} className="px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
          ← Back
        </button>
        <button onClick={onNext} className="px-8 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-brand text-sm">
          Preview & Publish →
        </button>
      </div>
    </motion.div>
  )
}