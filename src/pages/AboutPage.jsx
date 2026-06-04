import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Linkedin, ArrowRight, Cpu, Users, BookOpen, Code2, Zap, Heart } from 'lucide-react'
import { usePlatformStats } from '@/features/projects/useProjects'
 
const technologies = [
  'Arduino', 'ESP32', 'C/C++', 'Python', 'React',
  'Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Git & GitHub',
]
 
const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})
 
export default function AboutPage() {
  const { data, isLoading } = usePlatformStats()
 
  const stats = [
    { icon: Cpu,      value: isLoading ? '...' : `${data?.projectsCount || 0}+`,  label: 'Projects Shared'      },
    { icon: Users,    value: isLoading ? '...' : `${data?.engineersCount || 0}+`, label: 'Community Members'    },
    { icon: BookOpen, value: '15+',                                                label: 'Learning Resources'   },
    { icon: Code2,    value: '10+',                                                label: 'Technologies Covered' },
  ]
 
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
 
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-[280px_1fr_200px] gap-10 items-center">
 
            {/* Photo */}
            <motion.div {...anim(0)} className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-brand-100">
                  <img
                    src="/manal.jpg"
                    alt="Manal Nahri"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100">
                  <Cpu size={18} className="text-brand-500" />
                </div>
              </div>
              <p className="text-2xl text-brand-400 italic font-semibold">Manal Nahri</p>
            </motion.div>
 
            {/* Text */}
            <motion.div {...anim(0.1)}>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 mb-3">
                👋 Hello, I'm
              </span>
              <h1 className="font-bold text-5xl md:text-6xl text-gray-900 leading-tight mb-2">
                Manal <span className="text-brand-gradient">Nahri</span>
              </h1>
              <p className="text-brand-500 font-semibold text-lg mb-5">
                Founder & Developer of MechaTronix
              </p>
              <p className="text-gray-500 leading-relaxed mb-8 max-w-lg">
                I'm an engineering student and a passionate developer who loves
                building things that make a difference. MechaTronix is my way of
                helping makers, students and engineers learn, share and grow together.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/projects">
                  <button className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-brand text-sm">
                    View Projects <ArrowRight size={16} />
                  </button>
                </Link>
                <a href="mailto:manalnahri01@gmail.com">
                  <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    <Mail size={16} /> Contact Me
                  </button>
                </a>
              </div>
            </motion.div>
 
            {/* Robot */}
            <motion.div {...anim(0.2)} className="hidden md:flex items-center justify-center">
              <svg viewBox="0 0 200 220" className="w-44 h-44 opacity-80" fill="none">
                <rect x="60" y="90" width="80" height="70" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                <rect x="68" y="48" width="64" height="50" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                <circle cx="86" cy="70" r="8" fill="#635BFF" opacity="0.15" />
                <circle cx="86" cy="70" r="5" fill="#635BFF" />
                <circle cx="114" cy="70" r="8" fill="#635BFF" opacity="0.15" />
                <circle cx="114" cy="70" r="5" fill="#635BFF" />
                <circle cx="87" cy="69" r="1.5" fill="white" />
                <circle cx="115" cy="69" r="1.5" fill="white" />
                <rect x="88" y="82" width="24" height="4" rx="2" fill="#E2E8F0" />
                <line x1="100" y1="48" x2="100" y2="34" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="100" cy="30" r="5" fill="#635BFF" />
                <circle cx="100" cy="30" r="8" fill="#635BFF" opacity="0.15" />
                <rect x="30" y="95" width="30" height="12" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="140" y="95" width="30" height="12" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="26" cy="101" r="7" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="174" cy="101" r="7" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="72" y="160" width="20" height="36" rx="7" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="108" y="160" width="20" height="36" rx="7" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="68" y="188" width="28" height="10" rx="5" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="104" y="188" width="28" height="10" rx="5" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
                <rect x="76" y="108" width="48" height="34" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="90" cy="122" r="6" fill="#635BFF" opacity="0.15" />
                <circle cx="90" cy="122" r="3" fill="#635BFF" />
                <rect x="99" y="116" width="20" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="99" y="122" width="16" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="99" y="128" width="18" height="3" rx="1.5" fill="#E2E8F0" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>
 
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
 
        {/* My Story */}
        <motion.div {...anim(0)} className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
          <div className="flex items-center gap-2 mb-5">
            <Heart size={18} className="text-brand-500" />
            <h2 className="font-bold text-xl text-gray-900">My Story</h2>
            <div className="h-0.5 w-12 bg-brand-400 rounded-full ml-1" />
          </div>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              Hello, I'm <strong className="text-gray-900">Manal Nahri</strong>, the founder and developer of MechaTronix.
            </p>
            <p>
              My journey with technology started from a deep curiosity about how things work. Over time,
              that curiosity turned into a passion for electronics, embedded systems, robotics, and software development.
            </p>
            <p>
              While working on different projects, I realized that many students and makers build amazing things
              but often lack a place to share their work and connect with others. That's why I created MechaTronix.
            </p>
            <p>
              MechaTronix is my contribution to the engineering community — a platform where people can showcase
              projects, learn new skills, exchange knowledge, and inspire one another.
            </p>
            <p>
              Every feature on this platform is built with the vision of creating a stronger community of
              innovators and future engineers.
            </p>
            <p className="font-semibold text-gray-800">
              The journey has just begun, and I'm excited to see what we can build together. 🚀
            </p>
          </div>
        </motion.div>
 
        {/* About MechaTronix */}
        <motion.div {...anim(0.1)} className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
          <div className="flex items-center gap-2 mb-5">
            <Cpu size={18} className="text-brand-500" />
            <h2 className="font-bold text-xl text-gray-900">About MechaTronix</h2>
            <div className="h-0.5 w-12 bg-brand-400 rounded-full ml-1" />
          </div>
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <p className="text-gray-600 leading-relaxed">
              MechaTronix is a platform dedicated to electronics, robotics and embedded systems projects.
              Our goal is to inspire, educate and connect a global community of makers and engineers.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-[90px]">
                    <Icon size={20} className="text-brand-500 mb-1" />
                    <span className="font-bold text-xl text-gray-900">{s.value}</span>
                    <span className="text-xs text-gray-400 text-center leading-tight">{s.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <p className="text-brand-500 font-semibold text-sm mt-6 flex items-center gap-1">
            <Zap size={14} /> Growing Every Day 🚀
          </p>
        </motion.div>
 
        {/* Technologies */}
        <motion.div {...anim(0.1)} className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
          <div className="flex items-center gap-2 mb-5">
            <Code2 size={18} className="text-brand-500" />
            <h2 className="font-bold text-xl text-gray-900">Technologies & Tools</h2>
            <div className="h-0.5 w-12 bg-brand-400 rounded-full ml-1" />
          </div>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech) => (
              <span key={tech} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50 transition-all duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
 
        {/* Contact */}
        <motion.div {...anim(0.1)} className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
          <div className="flex items-center gap-2 mb-5">
            <Mail size={18} className="text-brand-500" />
            <h2 className="font-bold text-xl text-gray-900">Contact Me</h2>
            <div className="h-0.5 w-12 bg-brand-400 rounded-full ml-1" />
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Feel free to reach out if you have any questions, collaboration ideas, or just want to say hi!
          </p>
          <div className="space-y-4">
            <a
              href="mailto:manalnahri01@gmail.com"
              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-brand-200 hover:bg-brand-50 transition-all group"
            >
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center group-hover:border-brand-300 transition-colors">
                <Mail size={18} className="text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-800">manalnahri01@gmail.com</p>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/manal-nahri"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-brand-200 hover:bg-brand-50 transition-all group"
            >
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center group-hover:border-brand-300 transition-colors">
                <Linkedin size={18} className="text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">LinkedIn</p>
                <p className="text-sm font-semibold text-gray-800">linkedin.com/in/manal-nahri</p>
              </div>
            </a>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 rounded-2xl flex items-center gap-3">
            <Heart size={16} className="text-brand-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900">Let's build something amazing together!</p>
              <p className="text-xs text-gray-500">Always open to new opportunities and collaborations.</p>
            </div>
          </div>
        </motion.div>
      </div>
 
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500">
              © 2024 <strong className="text-gray-900">MechaTronix</strong>. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 justify-center md:justify-start">
              Built with <Heart size={11} className="text-brand-500" /> by Manal Nahri
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/manal-nahri"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-200 transition-all"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:manalnahri01@gmail.com"
              className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-200 transition-all"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}