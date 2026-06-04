import { motion } from 'framer-motion'

// ── Base skeleton block ───────────────────────────────────────────────────────
function Bone({ className = '' }) {
  return (
    <div className={`skeleton ${className}`} />
  )
}

// ── Project card skeleton ─────────────────────────────────────────────────────
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-card">
      {/* Image area */}
      <Bone className="h-44 rounded-none" />
      <div className="p-5 space-y-3">
        {/* Author */}
        <div className="flex items-center gap-2">
          <Bone className="w-5 h-5 rounded-full" />
          <Bone className="h-3 w-24" />
        </div>
        {/* Title */}
        <Bone className="h-5 w-3/4" />
        {/* Description */}
        <div className="space-y-1.5">
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-5/6" />
        </div>
        {/* Tags */}
        <div className="flex gap-2">
          <Bone className="h-5 w-12 rounded-lg" />
          <Bone className="h-5 w-16 rounded-lg" />
          <Bone className="h-5 w-10 rounded-lg" />
        </div>
        {/* Footer */}
        <div className="pt-3 border-t border-gray-50 flex gap-4">
          <Bone className="h-4 w-10" />
          <Bone className="h-4 w-10" />
          <Bone className="h-4 w-8" />
        </div>
      </div>
    </div>
  )
}

// ── Grid of project card skeletons ────────────────────────────────────────────
export function ProjectGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <ProjectCardSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

// ── Stats bar skeleton ────────────────────────────────────────────────────────
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-6 px-6">
          <Bone className="w-9 h-9 rounded-xl" />
          <div className="space-y-1.5">
            <Bone className="h-5 w-20" />
            <Bone className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Project detail skeleton ───────────────────────────────────────────────────
export function ProjectDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Hero */}
      <Bone className="h-72 md:h-96 rounded-3xl" />
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main */}
        <div className="md:col-span-2 space-y-4">
          <Bone className="h-8 w-3/4" />
          <div className="space-y-2">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-5/6" />
            <Bone className="h-4 w-4/5" />
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-4">
          <Bone className="h-32 rounded-2xl" />
          <Bone className="h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

// ── Comment skeleton ──────────────────────────────────────────────────────────
export function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-4">
      <Bone className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Bone className="h-3 w-32" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-3/4" />
      </div>
    </div>
  )
}