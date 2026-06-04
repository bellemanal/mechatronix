import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import Section from '@/components/ui/Section'
import ProjectCard from '@/components/project/ProjectCard'
import Button from '@/components/ui/Button'
import { useProjects } from '@/features/projects/useProjects'

const filters = ['All', 'Robotics', 'AI & ML', 'Electronics', 'IoT', 'Drones', 'Mechanical']

export default function TrendingSection() {
  const [activeFilter, setActiveFilter] = useState('All')

  const { data, isLoading, isError } = useProjects({
    category: activeFilter === 'All' ? null : activeFilter,
    orderBy: 'likes_count',
    pageSize: 6,
  })

  const projects = data?.projects || []

  return (
    <Section gray>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <Section.LabelLeft>Trending Projects</Section.LabelLeft>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 leading-tight mb-2">
            Fresh builds from real engineers<br className="hidden md:block" />
            <span className="text-brand-gradient"> — updated weekly.</span>
          </h2>
          <p className="text-gray-500 text-base">
            Discover cutting-edge builds from the community — robotics, AI, electronics, and beyond.
          </p>
        </div>
        <Link to="/projects">
          <Button variant="secondary" size="sm" iconRight={<ArrowRight size={14} />}>
            View All Projects
          </Button>
        </Link>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f, i) => (
          <motion.button
            key={f}
            onClick={() => setActiveFilter(f)}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium border transition-all duration-150 ${
              f === activeFilter
                ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50'
            }`}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader size={24} className="text-brand-500 animate-spin" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-20 text-gray-400">
          Failed to load projects.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && projects.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No projects yet in this category.
        </div>
      )}

      {/* Projects grid */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}

      {/* Load more */}
      {!isLoading && projects.length > 0 && (
        <div className="mt-10 text-center">
          <Link to="/projects">
            <Button variant="secondary" size="md" icon={<TrendingUp size={15} />}>
              Load More Projects
            </Button>
          </Link>
        </div>
      )}
    </Section>
  )
}