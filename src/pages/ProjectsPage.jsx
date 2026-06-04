import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import ProjectCard from '@/components/project/ProjectCard'
import { ProjectGridSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import { useInfiniteProjects } from '@/features/projects/useProjects'

const CATEGORIES  = ['Robotics','Electronics','AI & ML','IoT','Drones','Mechanical','Automation']
const DIFFICULTIES = ['Beginner','Intermediate','Advanced']
const ORDER_OPTIONS = [
  { label:'Newest',       value:'created_at'  },
  { label:'Most Liked',   value:'likes_count' },
  { label:'Most Viewed',  value:'views_count' },
]

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [orderBy,    setOrderBy]    = useState('created_at')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  const handleSearch = (val) => {
    setSearch(val)
    clearTimeout(window._searchTimer)
    window._searchTimer = setTimeout(() => setDebouncedSearch(val), 500)
  }

  const filters = {
    category:   category   || undefined,
    difficulty: difficulty || undefined,
    search:     debouncedSearch || undefined,
    orderBy,    ascending: false,    pageSize: 12,
  }

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProjects(filters)
  const allProjects = data?.pages?.flatMap(p => p.projects) || []
  const total = data?.pages?.[0]?.total || 0
  const hasFilters = category || difficulty || search || orderBy !== 'created_at'

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.4 }}>
            <span className="section-label mb-4 inline-flex">Browse Projects</span>
            <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-3 tracking-tight">
              Explore Engineering <span className="text-brand-gradient">Projects</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl">Discover real builds from makers and engineers around the world.</p>
          </motion.div>
          <div className="flex items-center gap-8 mt-8">
            <div>
              <div className="font-bold text-xl text-gray-900">{isLoading ? '...' : total.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Projects</div>
            </div>
            <div><div className="font-bold text-xl text-gray-900">12</div><div className="text-xs text-gray-500">Categories</div></div>
            <div><div className="font-bold text-xl text-gray-900">100%</div><div className="text-xs text-gray-500">Open Source</div></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sort By</h3>
                <div className="space-y-0.5">
                  {ORDER_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setOrderBy(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${orderBy===opt.value?'bg-brand-50 text-brand-600 font-semibold':'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Difficulty</h3>
                <div className="space-y-0.5">
                  {DIFFICULTIES.map(d => (
                    <button key={d} onClick={() => setDifficulty(difficulty===d?null:d)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2 ${difficulty===d?'bg-brand-50 text-brand-600 font-semibold':'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                      <span className={`w-2 h-2 rounded-full ${d==='Beginner'?'bg-success-500':d==='Intermediate'?'bg-warning-500':'bg-brand-500'}`}/>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Categories</h3>
                <div className="space-y-0.5">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(category===cat?null:cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${category===cat?'bg-brand-50 text-brand-600 font-semibold':'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              {hasFilters && (
                <button onClick={() => { setSearch(''); setDebouncedSearch(''); setCategory(null); setDifficulty(null); setOrderBy('created_at') }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:text-danger-500 hover:border-danger-200 transition-all duration-150">
                  <X size={13}/> Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 max-w-xs">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="text" value={search} onChange={e => handleSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"/>
              </div>
              <div className="flex flex-wrap gap-2">
                {category && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-600 rounded-xl text-xs font-semibold">{category}<button onClick={()=>setCategory(null)}><X size={11}/></button></span>}
                {difficulty && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-600 rounded-xl text-xs font-semibold">{difficulty}<button onClick={()=>setDifficulty(null)}><X size={11}/></button></span>}
              </div>
              <div className="ml-auto text-sm text-gray-400">{!isLoading && `${total.toLocaleString()} projects`}</div>
            </div>

            {isLoading ? (
              <ProjectGridSkeleton count={6}/>
            ) : isError ? (
              <EmptyState type="error" title="Failed to load projects" description={error?.message} action={() => window.location.reload()} actionLabel="Retry"/>
            ) : allProjects.length === 0 ? (
              <EmptyState type="search"
                title={search ? `No results for "${search}"` : 'No projects yet'}
                description={search ? 'Try different keywords or clear your filters.' : 'Be the first to publish a project!'}
                action={() => navigate('/projects/create')} actionLabel="Create a Project"/>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {allProjects.map((project, i) => <ProjectCard key={project.id} project={project} index={i}/>)}
                </div>
                {hasNextPage && (
                  <div className="mt-10 text-center">
                    <Button variant="secondary" size="md" loading={isFetchingNextPage} onClick={() => fetchNextPage()}>
                      {isFetchingNextPage ? 'Loading...' : 'Load More Projects'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}