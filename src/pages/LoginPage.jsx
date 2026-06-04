import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { signInWithEmail, signInWithGoogle, getAuthErrorMessage } from '@/features/auth/authService'
import { useRedirectIfAuth } from '@/features/auth/useAuth'
import { validateEmail, validatePassword } from '@/features/auth/authUtils'
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

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/projects'

  useRedirectIfAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  const change = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: null }))
  }

  const validate = () => {
    const errs = {}
    const e = validateEmail(form.email); if (e) errs.email = e
    const p = validatePassword(form.password); if (p) errs.password = p
    setErrors(errs); return !Object.keys(errs).length
  }

  const handleEmail = async (ev) => {
    ev.preventDefault(); if (!validate()) return
    setLoadingEmail(true)
    try {
      await signInWithEmail(form.email, form.password)
      toast.success('Welcome back! 🚀')
      navigate(from, { replace: true })
    } catch (err) {
      const m = getAuthErrorMessage(err.code)
      toast.error(m)
      setErrors({ password: m })
    } finally {
      setLoadingEmail(false)
    }
  }

  const handleGoogle = async () => {
    setLoadingGoogle(true)
    try {
      await signInWithGoogle()
      toast.success('Welcome back! 🚀')
      navigate(from, { replace: true })
    } catch (err) {
      const m = getAuthErrorMessage(err.code)
      if (err.code !== 'auth/popup-closed-by-user') toast.error(m)
    } finally {
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-violet-600">
        <div className="absolute inset-0 bg-grid opacity-10" style={{ backgroundSize: '32px 32px' }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-14 py-16">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Cpu size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-white">MechaTronix</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-bold text-[42px] text-white leading-[1.1] tracking-tight mb-5">
              Welcome back,<br />Engineer.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm mb-14">
              Your projects, schematics, and community are waiting for you.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-2 gap-3 max-w-xs">
            {[{ v: '50K+', l: 'Engineers' }, { v: '12.5K+', l: 'Projects' }, { v: '25K+', l: 'Schematics' }, { v: '150+', l: 'Countries' }].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                <div className="font-bold text-xl text-white">{s.v}</div>
                <div className="text-sm text-white/60 mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="lg:hidden absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-brand"><Cpu size={16} className="text-white" strokeWidth={2.5} /></div>
            <span className="font-bold text-[17px] text-gray-900">Mecha<span className="text-brand-gradient">Tronix</span></span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-bold text-3xl text-gray-900 mb-2 tracking-tight">Sign in</h2>
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-500 hover:text-brand-600 font-semibold transition-colors">Create one free</Link>
            </p>
          </div>

          {/* Google */}
          <Button variant="secondary" size="lg" onClick={handleGoogle} loading={loadingGoogle} disabled={loadingEmail}
            className="w-full justify-center mb-5" icon={!loadingGoogle ? <GoogleIcon /> : null}>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form onSubmit={handleEmail} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={change}
                  placeholder="you@example.com" autoComplete="email"
                  className={`input-base pl-10 ${errors.email ? 'input-error' : ''}`} />
              </div>
              {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-danger-500 text-xs mt-1.5 font-medium"><AlertCircle size={12} />{errors.email}</motion.p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link to="/reset-password" className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={change}
                  placeholder="••••••••" autoComplete="current-password"
                  className={`input-base pl-10 pr-10 ${errors.password ? 'input-error' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-danger-500 text-xs mt-1.5 font-medium"><AlertCircle size={12} />{errors.password}</motion.p>}
            </div>

            <Button type="submit" variant="brand" size="lg" loading={loadingEmail} disabled={loadingGoogle}
              iconRight={!loadingEmail ? <ArrowRight size={16} /> : null} className="w-full justify-center mt-1">
              Sign In
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
            By signing in you agree to our{' '}
            <Link to="/terms" className="text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-2">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
