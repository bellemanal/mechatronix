import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronRight, Cpu, Code2, Users, BookOpen, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { usePlatformStats } from '@/features/projects/useProjects'

const techPills = ['ROS2', 'Arduino', 'CUDA', 'ESP32', 'OpenCV', 'PyTorch', 'STM32', 'TensorFlow']

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16,1,0.3,1] } }
}

function Plus({ size, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  )
}

// What You Can Do cards
const features = [
  { icon: Code2,     label: 'Publish Projects',           desc: 'Share your builds with the world'         },
  { icon: BookOpen,  label: 'Learn From Docs',            desc: 'Step-by-step guides & resources'          },
  { icon: Users,     label: 'Collaborate',                desc: 'Connect with real engineers'              },
  { icon: Trophy,    label: 'Build Your Portfolio',       desc: 'Showcase your engineering work'           },
]

export default function HeroSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const { data, isLoading } = usePlatformStats()

  const categoriesCount = isLoading ? '...' : `${Object.keys(data?.categories || {}).length}`
  const projectsCount   = isLoading ? '...' : `${data?.projectsCount || 0}`

  // Floating cards — بدون أرقام stats
  const floatingCards = [
    {
      id: 1,
      style: 'top-[8%] right-[6%]',
      animate: { y: [0, -12, 0] },
      duration: 5,
      content: (
        <div className="bg-white rounded-2xl shadow-floating border border-gray-100 p-4 w-52">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Users size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Community</p>
              <p className="text-[10px] text-gray-400">Growing fast 🚀</p>
            </div>
          </div>
          <div className="space-y-2">
            {['Community Driven', 'Open Source', 'Free Access', 'Engineering Focused'].map((item, i) => (
              <div key={item} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${['bg-brand-500','bg-violet-500','bg-success-500','bg-warning-500'][i]}`} />
                <span className="text-[11px] text-gray-600 font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-xs font-semibold text-success-500">● Live</span>
            <span className="text-[10px] text-gray-400">Beta Community</span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      style: 'bottom-[18%] right-[3%]',
      animate: { y: [0, -8, 0] },
      duration: 7,
      delay: 1.5,
      content: (
        <div className="bg-white rounded-2xl shadow-floating border border-gray-100 p-4 w-48">
          <p className="text-xs font-semibold text-gray-700 mb-3">Active Categories</p>
          {Object.entries(data?.categories || { Automation: 0, IoT: 0, Robotics: 0 })
            .slice(0, 3)
            .map(([name, count], idx) => {
              const colors = ['bg-brand-500', 'bg-violet-500', 'bg-success-500']
              return (
                <div key={name} className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors[idx]}`} />
                    <span className="text-[11px] text-gray-600 font-medium">{name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{count} projects</span>
                </div>
              )
            })}
          <Link to="/projects" className="text-[10px] text-brand-500 font-semibold flex items-center gap-1 mt-2">
            View All <ChevronRight size={10} />
          </Link>
        </div>
      ),
    },
    {
      id: 3,
      style: 'bottom-[10%] left-[2%]',
      animate: { y: [0, -10, 0] },
      duration: 6,
      delay: 0.8,
      content: (
        <div className="bg-white rounded-2xl shadow-floating border border-gray-100 p-4 w-52">
          <p className="text-xs font-semibold text-gray-700 mb-3">Platform</p>
          {[
            { label: 'Community Driven', color: 'bg-brand-500'   },
            { label: 'Open Source',      color: 'bg-violet-500'  },
            { label: 'Free Access',      color: 'bg-success-500' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-[10px] text-gray-600 font-medium">{s.label}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-50">
            <span className="text-[10px] text-warning-500 font-semibold">🚀 Beta — Early Access</span>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div ref={containerRef} className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden bg-white">

      {/* ── Mesh / blob background ── */}
      <div className="absolute inset-0 bg-hero-mesh" />
      <div className="absolute inset-0 bg-dots opacity-30" style={{ backgroundSize: '28px 28px' }} />

      {/* Blurred gradient blobs — Vercel-style */}
      <div className="absolute top-[-120px] right-[-80px] w-[520px] h-[520px] rounded-full bg-brand-200 opacity-30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full bg-violet-200 opacity-25 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-brand-100 opacity-20 blur-[80px] pointer-events-none" />

      <motion.div style={{ y }} className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-[1fr_480px] gap-12 lg:gap-6 items-center">

          {/* ── Left ── */}
          <motion.div variants={staggerChildren} initial="initial" animate="animate">
            <motion.div variants={fadeUp} className="mb-6">
              <span className="section-label">
                <span className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
                Build · Learn · Share
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="font-bold text-[52px] md:text-[64px] lg:text-[72px] leading-[1.05] tracking-tight text-gray-900 mb-6">
              Real Engineering.<br />
              Real People.<br />
              <span className="text-brand-gradient">Real Impact.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl text-gray-500 leading-relaxed max-w-lg mb-8">
              Join a growing community of engineers building the future
              of robotics, electronics, and AI.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link to="/projects">
                <Button variant="brand" size="lg" iconRight={<ArrowRight size={17} />}>
                  Start Exploring
                </Button>
              </Link>
              <Link to="/projects/create">
                <Button variant="secondary" size="lg" icon={<Plus size={16} />}>
                  Share Your Build
                </Button>
              </Link>
            </motion.div>

            {/* Social proof — بدون أرقام */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-2">
                {['YA','MN','OT','SE','AK'].map((i, idx) => (
                  <div key={idx}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Engineers building together
              </p>
            </motion.div>

            {/* What You Can Do */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-8 max-w-lg">
              {features.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-2.5 p-3 bg-white/70 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xs hover:border-brand-200 hover:bg-brand-50/40 transition-all duration-150">
                  <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={13} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{label}</p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {techPills.map((pill) => (
                <span key={pill} className="badge badge-gray font-mono text-[11px]">{pill}</span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right ── */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
            >
              {/* Robot illustration with mesh bg */}
              <div className="relative h-[380px] bg-gradient-to-br from-gray-100 via-gray-50 to-brand-50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-60" style={{ backgroundSize: '32px 32px' }} />

                {/* Extra ambient blobs inside card */}
                <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-brand-300 opacity-20 blur-3xl" />
                <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-violet-300 opacity-20 blur-2xl" />

                <svg viewBox="0 0 320 320" className="w-72 h-72 opacity-90 relative z-10" fill="none">
                  <rect x="100" y="140" width="120" height="100" rx="16" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <rect x="110" y="80" width="100" height="75" rx="14" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <circle cx="138" cy="110" r="12" fill="#635BFF" opacity="0.15"/>
                  <circle cx="138" cy="110" r="7" fill="#635BFF"/>
                  <circle cx="182" cy="110" r="12" fill="#635BFF" opacity="0.15"/>
                  <circle cx="182" cy="110" r="7" fill="#635BFF"/>
                  <circle cx="140" cy="108" r="2" fill="white"/>
                  <circle cx="184" cy="108" r="2" fill="white"/>
                  <rect x="140" y="128" width="40" height="6" rx="3" fill="#E2E8F0"/>
                  <line x1="160" y1="80" x2="160" y2="60" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="160" cy="55" r="6" fill="#635BFF"/>
                  <circle cx="160" cy="55" r="10" fill="#635BFF" opacity="0.15"/>
                  <rect x="60" y="145" width="40" height="18" rx="9" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <rect x="220" y="145" width="40" height="18" rx="9" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <circle cx="55" cy="154" r="10" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <circle cx="265" cy="154" r="10" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <rect x="118" y="240" width="30" height="50" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <rect x="172" y="240" width="30" height="50" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <rect x="112" y="282" width="42" height="14" rx="7" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <rect x="166" y="282" width="42" height="14" rx="7" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                  <rect x="120" y="160" width="80" height="50" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5"/>
                  <circle cx="140" cy="180" r="8" fill="#635BFF" opacity="0.15"/>
                  <circle cx="140" cy="180" r="4" fill="#635BFF"/>
                  <rect x="152" y="168" width="36" height="4" rx="2" fill="#E2E8F0"/>
                  <rect x="152" y="176" width="28" height="4" rx="2" fill="#E2E8F0"/>
                  <rect x="152" y="184" width="32" height="4" rx="2" fill="#E2E8F0"/>
                  <path d="M60 130 Q80 130 80 120 L120 120" stroke="#635BFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
                  <path d="M260 130 Q240 130 240 120 L200 120" stroke="#635BFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
                  <circle cx="80" cy="130" r="3" fill="#635BFF" opacity="0.5"/>
                  <circle cx="240" cy="130" r="3" fill="#635BFF" opacity="0.5"/>
                </svg>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center justify-between border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-gray-700">Open Source · Beta</span>
                    </div>
                    <span className="text-xs text-brand-500 font-semibold">{projectsCount} projects</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating cards */}
            {floatingCards.map((card) => (
              <motion.div
                key={card.id}
                className={`absolute z-10 ${card.style}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, ...card.animate }}
                transition={{
                  opacity: { duration: 0.5, delay: (card.delay || 0) + 0.5 },
                  scale:   { duration: 0.5, delay: (card.delay || 0) + 0.5 },
                  y: { duration: card.duration, repeat: Infinity, ease: 'easeInOut', delay: card.delay || 0 },
                }}
              >
                {card.content}
              </motion.div>
            ))}

            {/* Share CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4 bg-gradient-to-br from-brand-500 to-violet-600 rounded-2xl p-5 text-white shadow-brand-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-base mb-1">Share Your Project</p>
                  <p className="text-sm text-white/75">Inspire others with your build and get feedback from the community.</p>
                </div>
                <div className="w-12 h-12 flex-shrink-0">
                  <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.1)"/>
                    <rect x="16" y="26" width="16" height="12" rx="4" fill="white" opacity="0.9"/>
                    <rect x="18" y="16" width="12" height="12" rx="3" fill="white" opacity="0.7"/>
                    <circle cx="24" cy="22" r="3" fill="#635BFF"/>
                  </svg>
                </div>
              </div>
              <Link to="/projects/create">
                <button className="mt-4 bg-white text-brand-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-brand-50 transition-colors shadow-sm">
                  <Plus size={14} />New Project
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}