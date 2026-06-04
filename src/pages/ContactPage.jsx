import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Mail, Linkedin, Send, Paperclip, Clock, ChevronDown,
  MessageSquare, Handshake, Bug, Lightbulb, ArrowRight, Rocket
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

// ── Info Cards ────────────────────────────────────────────────────────────────
const infoCards = [
  {
    icon: MessageSquare,
    color: 'text-brand-500',
    bg: 'bg-brand-50',
    border: 'border-brand-100',
    title: 'General Inquiries',
    email: 'manalnahri01@gmail.com',
    desc: 'For general questions and platform support.',
  },
  {
    icon: Handshake,
    color: 'text-success-500',
    bg: 'bg-success-50',
    border: 'border-success-100',
    title: 'Partnerships',
    email: 'manalnahri01@gmail.com',
    desc: 'For companies, schools, sponsorships and collaborations.',
  },
  {
    icon: Bug,
    color: 'text-warning-500',
    bg: 'bg-warning-50',
    border: 'border-warning-100',
    title: 'Report a Bug',
    email: 'manalnahri01@gmail.com',
    desc: "Found something that isn't working as expected?",
  },
  {
    icon: Lightbulb,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    title: 'Feature Request',
    email: 'manalnahri01@gmail.com',
    desc: 'Share your ideas and help us build better.',
  },
]

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How can I publish a project on MechaTronix?',
    a: 'Create an account, click on "New Project" and follow the steps. It only takes a few minutes!',
  },
  {
    q: 'Is MechaTronix free to use?',
    a: 'Yes! MechaTronix is completely free for everyone. No hidden fees, ever.',
  },
  {
    q: 'Can I upload CAD files and schematics?',
    a: 'Absolutely! You can upload CAD files, schematics, code, images and many more.',
  },
  {
    q: 'Can I collaborate with other engineers?',
    a: 'Yes! You can connect, share ideas and collaborate on projects with the community.',
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      {...fadeUp(index * 0.08)}
      className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={13} className="text-brand-500" />
          </div>
          <span className="font-semibold text-sm text-gray-800">{item.q}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Contact Form ──────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [file, setFile] = useState(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Opens email client with pre-filled data
    const body = `Name: ${form.name}%0D%0ASubject: ${form.subject}%0D%0A%0D%0A${form.message}`
    window.open(`mailto:manalnahri01@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${body}`)
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Your Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Enter your name"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
          placeholder="What is this about?"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Message</label>
        <textarea
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Write your message here..."
          rows={5}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all resize-none"
        />
      </div>

      {/* File upload */}
      <div>
        <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-all text-center">
          <input
            type="file"
            className="hidden"
            onChange={e => setFile(e.target.files[0])}
          />
          <Paperclip size={16} className="text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">
            {file ? file.name : 'Attach files (optional) — Drag & drop or click to browse'}
          </p>
        </label>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors shadow-brand text-sm"
      >
        {sent ? '✓ Message Sent!' : <><Send size={15} /> Send Message</>}
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 We respect your privacy. Your information is safe with us.
      </p>
    </form>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-100 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-[-60px] right-[-40px] w-72 h-72 rounded-full bg-brand-100 opacity-30 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-20px] w-48 h-48 rounded-full bg-violet-100 opacity-25 blur-[60px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                Get in Touch
              </span>
              <h1 className="font-bold text-4xl md:text-5xl text-gray-900 leading-tight mb-4">
                Let's build something{' '}
                <span className="text-brand-gradient">amazing</span>{' '}
                together.
              </h1>
              <p className="text-gray-500 leading-relaxed mb-6 max-w-md">
                Have a question, suggestion, partnership request, or found a bug?
                We'd love to hear from you.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <Clock size={14} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-xs">Fast Response</p>
                    <p className="text-[11px] text-gray-400">Usually reply within 24–48 hours.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-xl bg-success-50 border border-success-100 flex items-center justify-center">
                    <Mail size={14} className="text-success-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-xs">We Care</p>
                    <p className="text-[11px] text-gray-400">Every message is read and appreciated.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Illustration */}
            <motion.div {...fadeUp(0.15)} className="flex items-center justify-center">
              <svg viewBox="0 0 320 260" className="w-full max-w-sm opacity-90" fill="none">
                {/* Background circle */}
                <circle cx="160" cy="130" r="110" fill="#F5F3FF" opacity="0.6" />

                {/* Main envelope */}
                <rect x="60" y="80" width="160" height="110" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
                <path d="M60 92 L160 148 L260 92" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
                <rect x="60" y="80" width="160" height="110" rx="12" fill="none" stroke="#E2E8F0" strokeWidth="2"/>

                {/* Lines inside envelope */}
                <rect x="90" y="115" width="80" height="6" rx="3" fill="#E2E8F0"/>
                <rect x="90" y="128" width="60" height="6" rx="3" fill="#E2E8F0"/>
                <rect x="90" y="141" width="70" height="6" rx="3" fill="#E2E8F0"/>

                {/* Paper plane */}
                <g transform="translate(195, 55) rotate(-20)">
                  <path d="M0 0 L40 15 L20 25 Z" fill="#635BFF" opacity="0.9"/>
                  <path d="M20 25 L25 40 L40 15 Z" fill="#4F46E5" opacity="0.7"/>
                  <path d="M0 0 L20 25" stroke="white" strokeWidth="1" opacity="0.5"/>
                </g>

                {/* Chat bubble */}
                <rect x="195" y="140" width="80" height="50" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
                <path d="M210 165 L195 175" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="207" y="152" width="52" height="4" rx="2" fill="#E2E8F0"/>
                <rect x="207" y="161" width="40" height="4" rx="2" fill="#635BFF" opacity="0.3"/>
                <rect x="207" y="170" width="46" height="4" rx="2" fill="#E2E8F0"/>

                {/* Decorative plus signs */}
                <text x="48" y="78" fontSize="16" fill="#635BFF" opacity="0.4" fontWeight="bold">+</text>
                <text x="268" y="105" fontSize="12" fill="#635BFF" opacity="0.3" fontWeight="bold">+</text>
                <text x="170" y="218" fontSize="10" fill="#635BFF" opacity="0.3" fontWeight="bold">+</text>

                {/* Dots */}
                <circle cx="80" cy="200" r="4" fill="#635BFF" opacity="0.2"/>
                <circle cx="260" cy="70" r="3" fill="#635BFF" opacity="0.3"/>
                <circle cx="50" cy="160" r="3" fill="#635BFF" opacity="0.2"/>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* ── Info Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {infoCards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div key={card.title} {...fadeUp(i * 0.08)}
                className={`bg-white rounded-2xl border ${card.border} p-5 shadow-xs hover:shadow-card transition-shadow`}
              >
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon size={18} className={card.color} />
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{card.title}</h3>
                <a href={`mailto:${card.email}`} className={`text-xs font-semibold ${card.color} hover:underline block mb-2`}>
                  {card.email}
                </a>
                <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* ── Contact Form + Sidebar ── */}
        <div className="grid md:grid-cols-[1fr_300px] gap-8">

          {/* Form */}
          <motion.div {...fadeUp(0)} className="bg-white rounded-3xl border border-gray-100 shadow-card p-8">
            <h2 className="font-bold text-xl text-gray-900 mb-1">Send us a message</h2>
            <p className="text-sm text-gray-400 mb-6">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <ContactForm />
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-4">
            <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="font-bold text-sm text-gray-700 mb-4">Other ways to reach us</h3>
              <p className="text-xs text-gray-400 mb-4">You can also contact us through these channels.</p>

              <div className="space-y-3">
                {/* Email */}
                <a href="mailto:manalnahri01@gmail.com"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:border-brand-300 transition-colors flex-shrink-0">
                    <Mail size={14} className="text-brand-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium">Email</p>
                    <p className="text-xs font-semibold text-gray-800 truncate">manalnahri01@gmail.com</p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/manal-nahri" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:border-brand-300 transition-colors flex-shrink-0">
                    <Linkedin size={14} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">LinkedIn</p>
                    <p className="text-xs font-semibold text-gray-800">linkedin.com/in/manal-nahri</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Response time card */}
            <motion.div {...fadeUp(0.15)} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h3 className="font-bold text-sm text-gray-700 mb-1">Response time</h3>
              <p className="text-xs text-gray-400 mb-3">We usually respond within</p>
              <p className="font-bold text-2xl text-brand-500 mb-3">24–48 hours</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={12} />
                <span>Monday to Friday, 9:00 AM – 6:00 PM (GMT+1)</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-bold text-2xl text-gray-900">Frequently asked questions</h2>
            <div className="h-0.5 w-12 bg-brand-400 rounded-full ml-1" />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} item={faq} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div {...fadeUp(0)}
          className="bg-gradient-to-br from-brand-500 to-violet-600 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-brand-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Rocket size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white mb-1">Let's build the future together</h3>
              <p className="text-sm text-white/75">
                Join thousands of engineers building, learning and inspiring each other.
              </p>
            </div>
          </div>
          <Link to="/projects">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-sm text-sm whitespace-nowrap flex-shrink-0">
              Explore Projects <ArrowRight size={15} />
            </button>
          </Link>
        </motion.div>
      </div>

      
    </div>
  )
}