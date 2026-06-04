import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Eye, MessageSquare, Share2, Github, Globe, Youtube,
  ExternalLink, FileText, ArrowLeft, Cpu, Users, Zap,
  AlertTriangle, Send, Trash2, Edit, ChevronDown, ChevronUp,
  Mail, Phone, Linkedin
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import {
  useProject, useToggleLike, useLikeStatus,
  useToggleSave, useSaveStatus, useIncrementView
} from '@/features/projects/useProjects'
import { useComments, useAddComment, useDeleteComment } from '@/features/projects/useComments'
import { ProjectDetailSkeleton, CommentSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/authStore'
import { deleteProject } from '@/features/projects/projectService'

function fmt(n) { return n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n || 0) }

function LinkIcon({ icon }) {
  const map = { github: Github, globe: Globe, youtube: Youtube, docs: FileText }
  const Icon = map[icon] || ExternalLink
  return <Icon size={15}/>
}

// ── Full Description with Read More ──────────────────────────────────────────
function FullDescription({ text }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > 300

  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl text-gray-900 mb-3">About This Project</h2>
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {expanded || !isLong ? text : `${text.slice(0, 300)}...`}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
        >
          {expanded ? <><ChevronUp size={14}/> Show less</> : <><ChevronDown size={14}/> Read more</>}
        </button>
      )}
    </div>
  )
}

// ── Comment ───────────────────────────────────────────────────────────────────
function Comment({ comment, onDelete }) {
  const isOwn = comment.profiles?.firebase_uid === useAuthStore.getState().user?.uid
  const timeAgo = comment.created_at
    ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 py-4 group"
    >
      {comment.profiles?.photo_url
        ? <img src={comment.profiles.photo_url} alt={comment.profiles.display_name} className="w-8 h-8 rounded-full object-cover flex-shrink-0"/>
        : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(comment.profiles?.display_name || 'U').charAt(0).toUpperCase()}
          </div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900">{comment.profiles?.display_name || 'Unknown'}</span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
          {comment.is_edited && <span className="text-xs text-gray-400 italic">(edited)</span>}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
      </div>
      {isOwn && (
        <button
          onClick={() => onDelete(comment.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-danger-500 hover:bg-danger-50 opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0"
        >
          <Trash2 size={13}/>
        </button>
      )}
    </motion.div>
  )
}

// ── Comments Section ──────────────────────────────────────────────────────────
function CommentsSection({ projectId, commentsCount }) {
  const [content, setContent] = useState('')
  const { user } = useAuthStore()
  const { data: comments = [], isLoading } = useComments(projectId)
  const { mutate: addComment, isPending: adding } = useAddComment(projectId)
  const { mutate: deleteComment } = useDeleteComment(projectId)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    if (!user) { toast.error('Sign in to comment'); return }
    addComment(
      { authorId: user.profileId, content },
      {
        onSuccess: () => { setContent(''); toast.success('Comment added!') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg text-gray-900 mb-5 flex items-center gap-2">
        <MessageSquare size={18} className="text-brand-500"/>
        Comments ({commentsCount || comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button type="submit" variant="brand" size="sm" loading={adding} icon={<Send size={13}/>}>
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Sign in to join the discussion</p>
          <Link to="/login"><Button variant="brand" size="sm">Sign In</Button></Link>
        </div>
      )}

      {isLoading ? (
        <div>{[1,2,3].map(i => <CommentSkeleton key={i}/>)}</div>
      ) : comments.length === 0 ? (
        <EmptyState type="empty" title="No comments yet" description="Be the first to share your thoughts on this project."/>
      ) : (
        <div className="divide-y divide-gray-50">
          <AnimatePresence>
            {comments.map(c => (
              <Comment key={c.id} comment={c} onDelete={deleteComment}/>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const { slug }      = useParams()
  const navigate      = useNavigate()
  const { user }      = useAuthStore()
  const profileId     = user?.profileId || null
  const incrementView = useIncrementView()

  const { data: project, isLoading, isError, error } = useProject(slug)
  const { data: liked = false } = useLikeStatus(project?.id, profileId)
  const { data: saved = false } = useSaveStatus(project?.id, profileId)
  const { mutate: toggleL } = useToggleLike(project?.id)
  const { mutate: toggleS } = useToggleSave(project?.id)

  useEffect(() => {
    if (project?.id) incrementView(project.id)
  }, [project?.id])

  if (isLoading) return <ProjectDetailSkeleton/>

  if (isError || !project) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <EmptyState
        type="error"
        title="Project not found"
        description={error?.message || "This project doesn't exist or has been removed."}
        action={() => navigate('/projects')}
        actionLabel="Browse Projects"
      />
    </div>
  )

  const isOwner      = user?.uid === project.firebase_uid
  const authorName   = project.profiles?.display_name || 'Unknown'
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return
    try {
      await deleteProject(project.id)
      toast.success('Project deleted successfully!')
      navigate('/projects')
    } catch (err) {
      toast.error(err.message || 'Failed to delete project.')
    }
  }

  const categories = Array.isArray(project.category)
    ? project.category
    : [project.category].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform"/>
          Back to Projects
        </Link>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8">

          {/* Main */}
          <div>
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-card mb-8"
            >
              {project.cover_image ? (
                <img src={project.cover_image} alt={project.title} className="w-full h-72 md:h-96 object-cover"/>
              ) : (
                <div className="h-72 md:h-96 flex items-center justify-center bg-gradient-to-br from-brand-50 to-violet-50">
                  <Cpu size={64} className="text-brand-200"/>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>

              {/* Badges + owner actions */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {categories.map(cat => (
                  <span key={cat} className="badge badge-brand">{cat}</span>
                ))}
                <span className="badge badge-gray flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    project.difficulty === 'Beginner' ? 'bg-success-500' :
                    project.difficulty === 'Intermediate' ? 'bg-warning-500' : 'bg-brand-500'
                  }`}/>
                  {project.difficulty}
                </span>
                {project.tags?.slice(0,3).map(t => (
                  <span key={t} className="badge badge-gray font-mono text-[10px]">{t}</span>
                ))}
                {isOwner && (
                  <div className="ml-auto flex items-center gap-2">
                    <Link to={`/projects/${project.slug}/edit`}>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:border-brand-300 hover:text-brand-600 transition-all">
                        <Edit size={13}/> Edit
                      </button>
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-danger-500 border border-danger-200 rounded-xl hover:bg-danger-50 transition-all"
                    >
                      <Trash2 size={13}/> Delete
                    </button>
                  </div>
                )}
              </div>

              <h1 className="font-bold text-3xl md:text-4xl text-gray-900 leading-tight mb-4">{project.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{project.short_description}</p>

              {/* Action bar */}
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100 flex-wrap">
                <button
                  onClick={() => profileId && toggleL({ profileId, currentlyLiked: liked })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-150 ${
                    liked ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-white border-gray-200 text-gray-600 hover:border-brand-200 hover:text-brand-600'
                  }`}
                >
                  <Heart size={16} className={liked ? 'fill-brand-500' : ''}/>{fmt(project.likes_count)}
                </button>
                <button
                  onClick={() => profileId && toggleS({ profileId, currentlySaved: saved })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-150 ${
                    saved ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-white border-gray-200 text-gray-600 hover:border-brand-200 hover:text-brand-600'
                  }`}
                >
                  {saved ? 'Saved ✓' : 'Save'}
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-500">
                  <Eye size={16}/>{fmt(project.views_count)}
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 font-semibold transition-colors"
                >
                  <Share2 size={16}/>Share
                </button>
              </div>

              {project.full_description && <FullDescription text={project.full_description}/>}

              {/* Problem + Solution */}
              {(project.problem || project.solution) && (
                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                  {project.problem && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
                      <h3 className="font-bold text-base text-gray-900 mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-warning-500"/>Problem
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{project.problem}</p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
                      <h3 className="font-bold text-base text-gray-900 mb-2 flex items-center gap-2">
                        <Zap size={16} className="text-brand-500"/>Solution
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Key features */}
              {project.features?.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Key Features</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {project.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-white border border-gray-100 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap size={11} className="text-brand-500"/>
                        </div>
                        <span className="text-sm text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {project.technologies?.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Cpu size={18} className="text-brand-500"/>Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(t => (
                      <span key={t} className="font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {project.images?.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-full aspect-video object-cover rounded-xl border border-gray-100 hover:opacity-90 transition-opacity cursor-pointer"/>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges */}
              {project.challenges && (
                <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
                  <h3 className="font-bold text-base text-gray-900 mb-3">Challenges & Learnings</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{project.challenges}</p>
                </div>
              )}

              <CommentsSection projectId={project.id} commentsCount={project.comments_count}/>
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card sticky top-24">
              <h3 className="font-bold text-sm text-gray-700 mb-4">Project Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-400 flex-shrink-0">Category</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {categories.map(cat => (
                      <span key={cat} className="badge badge-brand text-[10px]">{cat}</span>
                    ))}
                  </div>
                </div>
                {[
                  { label: 'Difficulty', value: project.difficulty },
                  { label: 'Published',  value: project.published_at ? formatDistanceToNow(new Date(project.published_at), { addSuffix: true }) : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-gray-400">{label}</span>
                    <span className="font-semibold text-gray-700">{value}</span>
                  </div>
                ))}
              </div>

              {/* Author */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-sm text-gray-700 mb-3">Author</h3>
                <div className="flex items-center gap-3">
                  {project.profiles?.photo_url
                    ? <img src={project.profiles.photo_url} alt={authorName} className="w-10 h-10 rounded-full object-cover"/>
                    : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">{authorInitials}</div>}
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{authorName}</p>
                    {project.profiles?.bio && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{project.profiles.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Team */}
              {project.team_members?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-1.5">
                    <Users size={14}/>Team ({project.team_members.length})
                  </h3>
                  <div className="space-y-3">
                    {project.team_members.map((m, i) => {
                      const roles = Array.isArray(m.roles)
                        ? m.roles
                        : m.role ? m.role.split(',').map(r => r.trim()) : []

                      return (
                        <div key={i} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          {/* Avatar */}
                          {m.avatar_url
                            ? <img src={m.avatar_url} alt={m.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0"/>
                            : <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-300 to-violet-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {(m.name || '?').charAt(0).toUpperCase()}
                              </div>
                          }
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-800">{m.name}</p>
                            {/* Roles */}
                            {roles.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {roles.map((r, ri) => (
                                  <span key={ri} className="text-[10px] text-brand-600 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded-md">{r}</span>
                                ))}
                              </div>
                            )}
                            {/* Email */}
                            {m.email && (
                              <a href={`mailto:${m.email}`} className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 hover:text-brand-500 transition-colors truncate">
                                <Mail size={9}/>{m.email}
                              </a>
                            )}
                            {/* Phone */}
                            {m.phone && (
                              <a href={`tel:${m.phone}`} className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400 hover:text-brand-500 transition-colors">
                                <Phone size={9}/>{m.phone}
                              </a>
                            )}
                            {/* Social links */}
                            {(m.github || m.linkedin) && (
                              <div className="flex items-center gap-2 mt-1">
                                {m.github && (
                                  <a
                                    href={m.github.startsWith('http') ? m.github : `https://${m.github}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-brand-500 transition-colors"
                                  >
                                    <Github size={12}/>
                                  </a>
                                )}
                                {m.linkedin && (
                                  <a
                                    href={m.linkedin.startsWith('http') ? m.linkedin : `https://${m.linkedin}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-brand-500 transition-colors"
                                  >
                                    <Linkedin size={12}/>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Links */}
              {project.links?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="font-bold text-sm text-gray-700 mb-3">Links</h3>
                  <div className="space-y-2">
                    {project.links.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-brand-600 transition-colors group">
                        <span className="text-gray-400 group-hover:text-brand-400 transition-colors">
                          <LinkIcon icon={link.icon}/>
                        </span>
                        <span className="truncate">{link.label}</span>
                        <ExternalLink size={11} className="ml-auto text-gray-300 group-hover:text-brand-300 flex-shrink-0"/>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}