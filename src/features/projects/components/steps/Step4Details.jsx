import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Wrench, Zap, Code2, AlertTriangle, Rocket, Plus, X } from 'lucide-react'
import { useProjectStore } from '../../projectStore'
function TagInput({ tags, onAdd, onRemove, placeholder, max = 20 }) {
  const [input, setInput] = useState('')

  const handleKey = (e) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault()
      if (input.trim()) { onAdd(input.trim()); setInput('') }
    }
  }

  return (
    <div>
      {/* Existing tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm"
              >
                {tag}
                <button onClick={() => onRemove(tag)} className="hover:text-danger-500 transition-colors">
                  <X size={12} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}
      {/* Input */}
      {tags.length < max && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
          />
          <button
            onClick={() => { if (input.trim()) { onAdd(input.trim()); setInput('') } }}
            className="w-10 h-10 bg-brand-50 border border-brand-200 text-brand-500 rounded-xl flex items-center justify-center hover:bg-brand-100 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

function TextArea({ value, onChange, placeholder, rows = 4, icon: Icon, label, hint }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <Icon size={15} className="text-brand-500" />
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all resize-none leading-relaxed"
      />
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  )
}

export default function Step4Details({ onNext, onPrev }) {
  const {
    form, setField,
    addFeature, removeFeature,
    addTechnology, removeTechnology,
  } = useProjectStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Problem */}
      <TextArea
        value={form.problem}
        onChange={(e) => setField('problem', e.target.value)}
        icon={Lightbulb}
        label="Problem"
        placeholder="What problem does this project solve? What need or challenge inspired you to build it?"
        hint="Describe the real-world problem clearly and concisely."
        rows={3}
      />

      {/* Solution */}
      <TextArea
        value={form.solution}
        onChange={(e) => setField('solution', e.target.value)}
        icon={Wrench}
        label="Solution"
        placeholder="How does your project solve the problem? What's your approach and key innovation?"
        rows={3}
      />

      {/* Key Features */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Zap size={15} className="text-brand-500" />
          Key Features
        </label>
        <TagInput
          tags={form.features}
          onAdd={addFeature}
          onRemove={removeFeature}
          placeholder="Add a feature and press Enter (e.g. Autonomous navigation)"
          max={15}
        />
        <p className="text-xs text-gray-400 mt-1.5">List the main capabilities and features of your project.</p>
      </div>

      {/* Technologies */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Code2 size={15} className="text-brand-500" />
          Technologies Used
        </label>
        <TagInput
          tags={form.technologies}
          onAdd={addTechnology}
          onRemove={removeTechnology}
          placeholder="Add a technology and press Enter (e.g. ROS2, Python, OpenCV)"
          max={20}
        />
        <p className="text-xs text-gray-400 mt-1.5">Hardware, software, libraries, frameworks, and tools.</p>
      </div>

      {/* Challenges */}
      <TextArea
        value={form.challenges}
        onChange={(e) => setField('challenges', e.target.value)}
        icon={AlertTriangle}
        label="Challenges & Learnings"
        placeholder="What were the biggest technical or design challenges? What did you learn from them?"
        rows={3}
      />

      {/* Future Improvements */}
      <TextArea
        value={form.futureImprovements}
        onChange={(e) => setField('futureImprovements', e.target.value)}
        icon={Rocket}
        label="Future Improvements"
        placeholder="What would you improve or add in the next version? What's your roadmap?"
        rows={3}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button onClick={onPrev} className="px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
          ← Back
        </button>
        <button onClick={onNext} className="px-8 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-brand text-sm">
          Continue →
        </button>
      </div>
    </motion.div>
  )
}