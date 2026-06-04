import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Shield, Palette, Lock, Smartphone, Monitor,
  Download, Trash2, Check, X, Camera, Plus, HelpCircle,
  ExternalLink, ChevronRight, Loader
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { getProfileByFirebaseUid, updateProfile } from '@/lib/profileService'
import toast from 'react-hot-toast'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] },
})

const navItems = [
  { id: 'account',    label: 'Account',           icon: User         },
  { id: 'profile',    label: 'Profile',            icon: User         },
  { id: 'security',   label: 'Security',           icon: Shield       },
  { id: 'appearance', label: 'Appearance',         icon: Palette      },
  { id: 'privacy',    label: 'Privacy',            icon: Lock         },
  { id: 'connected',  label: 'Connected Accounts', icon: ExternalLink },
  { id: 'data',       label: 'Data & Export',      icon: Download     },
]

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-brand-500' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function Card({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-card p-6 ${className}`}>
      {title && (
        <div className="mb-5">
          <h3 className="font-bold text-base text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all"
      />
    </div>
  )
}

function SkillTag({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-lg text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-danger-500 transition-colors">
        <X size={10} />
      </button>
    </span>
  )
}

function SessionRow({ icon: Icon, device, location, time, active }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon size={14} className="text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{device}</p>
          <p className="text-xs text-gray-400">{location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {active
          ? <span className="text-[10px] font-bold text-success-600 bg-success-50 border border-success-200 px-2 py-0.5 rounded-full">Active now</span>
          : <span className="text-xs text-gray-400">{time}</span>
        }
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeSection, setActiveSection] = useState('account')
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [savedOk, setSavedOk]   = useState(false)

  // Account
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')

  // Profile
  const [bio, setBio]           = useState('')
  const [skills, setSkills]     = useState([])
  const [newSkill, setNewSkill] = useState('')

  // Privacy
  const [publicProfile, setPublicProfile] = useState(true)
  const [showEmail, setShowEmail]         = useState(false)

  // Appearance
  const [theme, setTheme]   = useState('light')
  const [accent, setAccent] = useState('purple')

  // Security
  const [twoFA, setTwoFA] = useState(true)

  // Load profile from Supabase
  useEffect(() => {
    async function loadProfile() {
      if (!user?.uid) return
      try {
        const profile = await getProfileByFirebaseUid(user.uid)
        if (profile) {
          setFullName(profile.display_name || user.displayName || '')
          setUsername(profile.username || '')
          setEmail(profile.email || user.email || '')
          setPhone(profile.phone || '')
          setBio(profile.bio || '')
          setSkills(profile.skills || [])
          setPublicProfile(profile.public_profile ?? true)
          setShowEmail(profile.show_email ?? false)
        } else {
          setFullName(user.displayName || '')
          setEmail(user.email || '')
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  const handleSave = async () => {
    if (!user?.uid) return
    setSaving(true)
    try {
      await updateProfile(user.uid, {
        display_name:   fullName,
        username,
        email,
        phone,
        bio,
        skills,
        public_profile: publicProfile,
        show_email:     showEmail,
      })
      setSavedOk(true)
      toast.success('Settings saved successfully!')
      setTimeout(() => setSavedOk(false), 2000)
    } catch (err) {
      toast.error(err.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const accentColors = [
    { id: 'purple', color: 'bg-brand-500'  },
    { id: 'blue',   color: 'bg-blue-500'   },
    { id: 'teal',   color: 'bg-teal-500'   },
    { id: 'orange', color: 'bg-orange-500' },
    { id: 'red',    color: 'bg-red-500'    },
  ]

  const scrollTo = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size={32} className="text-brand-500 animate-spin"/>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-bold text-2xl text-gray-900 mb-8">Settings</h1>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8 items-start">

          {/* Sidebar */}
          <div className="sticky top-24 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                    activeSection === item.id
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={15} className={activeSection === item.id ? 'text-brand-500' : 'text-gray-400'} />
                  {item.label}
                </button>
              )
            })}

            <div className="mt-6 p-4 bg-brand-50 border border-brand-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle size={14} className="text-brand-500" />
                <p className="text-xs font-bold text-gray-800">Need help?</p>
              </div>
              <p className="text-[11px] text-gray-500 mb-3">Visit our Help Center for guides and support.</p>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline">
                Go to Help Center <ExternalLink size={10} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">

            {/* Account */}
            <motion.div id="account" {...fadeUp(0)}>
              <Card title="Account Information" subtitle="Update your account details.">
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <Field label="Full Name"    value={fullName} onChange={setFullName} placeholder="Your full name" />
                  <Field label="Username"     value={username} onChange={setUsername} placeholder="username" />
                  <Field label="Email"        value={email}    onChange={setEmail}    type="email" placeholder="email@example.com" />
                  <Field label="Phone Number" value={phone}    onChange={setPhone}    placeholder="+212 6 XX XX XX XX" />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                    savedOk ? 'bg-success-500 text-white' : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand'
                  }`}
                >
                  {saving
                    ? <><Loader size={14} className="animate-spin"/> Saving...</>
                    : savedOk
                      ? <><Check size={14}/> Saved!</>
                      : 'Save Changes'
                  }
                </button>
              </Card>
            </motion.div>

            {/* Profile */}
            <motion.div id="profile" {...fadeUp(0.05)}>
              <Card title="Profile" subtitle="Manage your public profile.">
                <div className="space-y-4">
                  {/* Profile Picture */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      {user?.photoURL
                        ? <img src={user.photoURL} alt={fullName} className="w-10 h-10 rounded-full object-cover"/>
                        : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                            {fullName.charAt(0) || 'M'}
                          </div>
                      }
                      <span className="text-sm font-semibold text-gray-700">Profile Picture</span>
                    </div>
                    <button className="px-4 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-all">
                      Change
                    </button>
                  </div>

                  {/* Cover Photo */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 rounded-lg bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center">
                        <Camera size={10} className="text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Cover Photo</span>
                    </div>
                    <button className="px-4 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-all">
                      Change
                    </button>
                  </div>

                  {/* Bio */}
                  <div className="py-3 border-b border-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Bio</span>
                    </div>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell the community about yourself..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Skills */}
                  <div className="py-3">
                    <span className="text-sm font-semibold text-gray-700 block mb-3">Skills</span>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map(s => (
                        <SkillTag key={s} label={s} onRemove={() => setSkills(skills.filter(sk => sk !== s))} />
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          value={newSkill}
                          onChange={e => setNewSkill(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addSkill()}
                          placeholder="Add skill..."
                          className="border border-dashed border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none focus:border-brand-400 w-24 bg-transparent"
                        />
                        <button onClick={addSkill} className="w-6 h-6 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center hover:bg-brand-100 transition-colors">
                          <Plus size={11} className="text-brand-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Save Profile */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-brand transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader size={14} className="animate-spin"/> : <Check size={14}/>}
                    Save Profile
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Security */}
            <motion.div id="security" {...fadeUp(0.05)}>
              <Card title="Security" subtitle="Keep your account secure.">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Password</p>
                      <p className="text-sm text-gray-400 tracking-widest mt-0.5">••••••••••••</p>
                    </div>
                    <button className="px-4 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-all">
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${twoFA ? 'text-success-600 bg-success-50 border border-success-200' : 'text-gray-500 bg-gray-100 border border-gray-200'}`}>
                        {twoFA ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <button onClick={() => setTwoFA(!twoFA)} className="px-4 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-all">
                      Edit
                    </button>
                  </div>
                  <div className="py-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Active Sessions</p>
                        <p className="text-xs text-gray-400">3 active sessions</p>
                      </div>
                    </div>
                    <div>
                      <SessionRow icon={Monitor}    device="Windows • Chrome" location="Casablanca, Morocco" active={true} />
                      <SessionRow icon={Smartphone} device="Android • Chrome" location="Rabat, Morocco"      time="2 hours ago" />
                      <SessionRow icon={Monitor}    device="MacOS • Safari"   location="Casablanca, Morocco" time="Yesterday" />
                    </div>
                    <button className="mt-3 text-sm font-semibold text-danger-500 hover:text-danger-600 transition-colors">
                      Log out from all devices
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Appearance */}
            <motion.div id="appearance" {...fadeUp(0.05)}>
              <Card title="Appearance" subtitle="Customize how MechaTronix looks for you.">
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Theme</p>
                    <div className="flex gap-2">
                      {[
                        { id: 'light',  label: 'Light',  icon: '☀️' },
                        { id: 'dark',   label: 'Dark',   icon: '🌙' },
                        { id: 'system', label: 'System', icon: '💻' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                            theme === t.id
                              ? 'bg-brand-50 border-brand-300 text-brand-600'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <span>{t.icon}</span>{t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Accent Color</p>
                    <div className="flex gap-2">
                      {accentColors.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setAccent(c.id)}
                          className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center transition-all ${
                            accent === c.id ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                          }`}
                        >
                          {accent === c.id && <Check size={12} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Privacy */}
            <motion.div id="privacy" {...fadeUp(0.05)}>
              <Card title="Privacy" subtitle="Manage your privacy settings.">
                <div className="space-y-4">
                  {[
                    { label: 'Public Profile', desc: 'Allow others to view your profile', value: publicProfile, onChange: setPublicProfile },
                    { label: 'Show Email',     desc: 'Display your email on your profile', value: showEmail,     onChange: setShowEmail     },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle value={item.value} onChange={item.onChange} />
                    </div>
                  ))}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-brand transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader size={14} className="animate-spin"/> : <Check size={14}/>}
                    Save Privacy Settings
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Connected Accounts */}
            <motion.div id="connected" {...fadeUp(0.05)}>
              <Card title="Connected Account" subtitle="Connect your account.">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/>
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.7-3-11.3-7.3l-6.5 5C9.6 39.5 16.3 44 24 44z"/>
                      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6l6.2 5.2C40.6 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
                    </svg>
                    <p className="text-sm font-semibold text-gray-800">Google</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-success-600 bg-success-50 border border-success-200 px-2.5 py-1 rounded-full">Connected</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Data & Export */}
            <motion.div id="data" {...fadeUp(0.05)}>
              <Card title="Data & Export" subtitle="Manage your data.">
                <div className="space-y-3">
                  {[
                    { label: 'Download My Data', desc: 'Export all your data',  icon: Download },
                    { label: 'Export Projects',  desc: 'Export your projects',  icon: Download },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer group">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-brand-300 transition-colors">
                        <item.icon size={14} className="text-gray-500 group-hover:text-brand-500 transition-colors" />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-sm font-semibold text-danger-500 hover:text-danger-600 transition-colors">
                      <Trash2 size={15} />
                      Delete Account
                    </button>
                    <p className="text-xs text-gray-400 mt-1">Permanently delete your account and all data.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}