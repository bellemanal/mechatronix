import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Eye, MessageSquare, ArrowUpRight, Bookmark, BookmarkCheck } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { useToggleLike, useLikeStatus, useToggleSave, useSaveStatus } from '@/features/projects/useProjects'

const categoryStyles = {
  'Robotics':               { bg:'bg-brand-50',   text:'text-brand-600',   border:'border-brand-100'  },
  'Electronics':            { bg:'bg-violet-50',  text:'text-violet-600',  border:'border-violet-100' },
  'AI & ML':                { bg:'bg-brand-50',   text:'text-brand-600',   border:'border-brand-100'  },
  'IoT':                    { bg:'bg-success-50', text:'text-success-600', border:'border-green-100'  },
  'Drones':                 { bg:'bg-gray-100',   text:'text-gray-600',    border:'border-gray-200'   },
  'Mechanical':             { bg:'bg-warning-50', text:'text-warning-600', border:'border-yellow-100' },
  'Automation':             { bg:'bg-violet-50',  text:'text-violet-600',  border:'border-violet-100' },
  'Mechanical Engineering': { bg:'bg-warning-50', text:'text-warning-600', border:'border-yellow-100' },
}

const difficultyDot = { Beginner:'bg-success-500', Intermediate:'bg-warning-500', Advanced:'bg-brand-500' }

function fmt(n) {
  if (!n && n !== 0) return '0'
  if (n >= 1000) return `${(n/1000).toFixed(1)}k`
  return String(n)
}

function CircuitVisual({ category, coverImage }) {
  if (coverImage) return <img src={coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />
  const colors = {
    'Robotics':['#635BFF','#8b7eff'], 'Electronics':['#7c3aed','#a78bfa'],
    'AI & ML':['#635BFF','#c4b5fd'], 'IoT':['#059669','#34d399'],
    'Drones':['#475569','#94a3b8'], 'Mechanical':['#d97706','#fbbf24'],
  }
  const [c1,c2] = colors[category] || ['#635BFF','#8b7eff']
  const gid = `g-${(category||'').replace(/\s/g,'-')}-${Math.random().toString(36).slice(2,6)}`
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full" fill="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="280" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={c1} stopOpacity="0.08"/><stop offset="100%" stopColor={c2} stopOpacity="0.04"/>
      </linearGradient></defs>
      <rect width="280" height="160" fill={`url(#${gid})`}/>
      <path d="M20 80 L60 80 L60 40 L140 40 L140 60 L200 60 L200 80 L260 80" stroke={c1} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" strokeLinecap="round"/>
      <path d="M60 80 L60 120 L120 120 L120 100 L180 100 L180 120 L260 120" stroke={c2} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" strokeLinecap="round"/>
      <circle cx="60" cy="40" r="4" fill={c1} opacity="0.5"/><circle cx="140" cy="60" r="4" fill={c1} opacity="0.5"/>
      <rect x="104" y="50" width="32" height="20" rx="4" fill="white" stroke={c1} strokeWidth="1.5" opacity="0.7"/>
      {[108,114,120,126,132].map(x=><line key={x} x1={x} y1="54" x2={x} y2="66" stroke={c1} strokeWidth="1" opacity="0.5"/>)}
    </svg>
  )
}

export default function ProjectCard({ project, index = 0 }) {
  const { user } = useAuthStore()
  const profileId = user?.profileId || null
  const { data: liked = false } = useLikeStatus(project.id, profileId)
  const { data: saved = false } = useSaveStatus(project.id, profileId)
  const { mutate: toggleL } = useToggleLike(project.id)
  const { mutate: toggleS } = useToggleSave(project.id)
  const cat  = categoryStyles[project.category] || categoryStyles['Robotics']
  const diff = difficultyDot[project.difficulty] || 'bg-gray-300'
  const authorName = project.profiles?.display_name || 'Unknown'
  const authorInitials = authorName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)

  const handleLike = (e) => { e.preventDefault(); e.stopPropagation(); if (!profileId) return; toggleL({ profileId, currentlyLiked: liked }) }
  const handleSave = (e) => { e.preventDefault(); e.stopPropagation(); if (!profileId) return; toggleS({ profileId, currentlySaved: saved }) }

  return (
    <motion.article
      initial={{ opacity:0, y:20 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'-40px' }}
      transition={{ duration:0.45, delay:index*0.05, ease:[0.16,1,0.3,1] }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden cursor-pointer transition-all duration-250 hover:shadow-card-hover hover:border-brand-100 hover:-translate-y-0.5"
    >
      <Link to={`/projects/${project.slug}`} className="block">
        <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <CircuitVisual category={project.category} coverImage={project.cover_image} />
          <div className="absolute top-3 left-3 z-10">
            <span className={`badge ${cat.bg} ${cat.text} border ${cat.border} text-[11px]`}>{project.category}</span>
          </div>
          <div className="absolute top-3 right-10 z-10">
            <span className="badge badge-gray text-[10px] flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${diff}`}/>{project.difficulty}
            </span>
          </div>
          <button onClick={handleSave} className={`absolute top-3 right-3 z-20 w-7 h-7 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-xs transition-all duration-150 ${saved?'text-brand-500 border-brand-200':'text-gray-400 hover:text-brand-500 opacity-0 group-hover:opacity-100'}`}>
            {saved ? <BookmarkCheck size={13}/> : <Bookmark size={13}/>}
          </button>
          <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/4 transition-colors duration-300"/>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {project.profiles?.photo_url
              ? <img src={project.profiles.photo_url} alt={authorName} className="w-5 h-5 rounded-full object-cover"/>
              : <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white text-[8px] font-bold">{authorInitials}</div>}
            <span className="text-xs text-gray-400 font-medium">{authorName}</span>
          </div>
          <h3 className="font-bold text-base text-gray-900 mb-2 group-hover:text-brand-600 transition-colors duration-200 leading-tight line-clamp-1">{project.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{project.short_description}</p>
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.slice(0,3).map(tag=>(
                <span key={tag} className="font-mono text-[10px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-lg">{tag}</span>
              ))}
              {project.tags.length > 3 && <span className="text-[10px] text-gray-400">+{project.tags.length-3} more</span>}
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-4">
              <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors duration-150 group/like ${liked?'text-brand-500':'text-gray-400 hover:text-brand-500'}`}>
                <Heart size={14} className={`group-hover/like:scale-110 transition-transform duration-150 ${liked?'fill-brand-500':''}`}/>
                <span className="text-xs font-medium">{fmt(project.likes_count)}</span>
              </button>
              <div className="flex items-center gap-1.5 text-gray-400"><Eye size={14}/><span className="text-xs">{fmt(project.views_count)}</span></div>
              <div className="flex items-center gap-1.5 text-gray-400"><MessageSquare size={14}/><span className="text-xs">{fmt(project.comments_count)}</span></div>
            </div>
            <ArrowUpRight size={14} className="text-gray-300 group-hover:text-brand-400 transition-colors duration-200"/>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}