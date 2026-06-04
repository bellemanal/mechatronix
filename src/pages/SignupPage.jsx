import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)

  const change = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Account created successfully! Welcome aboard 🚀')
    navigate('/projects')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel with dark background to ensure text is visible */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-grid opacity-10" style={{ backgroundSize: '32px 32px' }} />
        <div className="relative z-10 flex flex-col justify-center px-14 py-16 w-full">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Cpu size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-white">MechaTronix</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-bold text-[40px] text-white leading-tight mb-5">
              Join the Engineering Revolution.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-8">
              Build in public. Learn from experts. Ship hardware that matters.
            </p>
          </motion.div>

          <div className="space-y-3 text-sm text-slate-300 max-w-sm">
            {['Publish unlimited engineering projects', 'Access full schematics & source code', 'Connect with 50K+ engineers globally'].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel with clear dark gray text */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white text-slate-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-bold text-3xl text-slate-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>

          <Button variant="secondary" size="lg" className="w-full justify-center mb-5 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50" icon={<GoogleIcon />}>
            Sign up with Google
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or register with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="name" value={form.name} onChange={change} placeholder="Alex Engineer" className="w-full rounded-xl border border-slate-200 p-3 pl-10 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none bg-slate-50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 p-3 pl-10 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none bg-slate-50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={change} placeholder="••••••••" className="w-full rounded-xl border border-slate-200 p-3 pl-10 pr-10 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none bg-slate-50" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full justify-center mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md" iconRight={<ArrowRight size={16} />}>
              Create Account
            </Button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
            By registering, you agree to our{' '}
            <Link to="#" className="text-slate-500 hover:text-slate-700 underline">Terms</Link> and <Link to="#" className="text-slate-500 hover:text-slate-700 underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
