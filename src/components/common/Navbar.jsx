import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Plus, Menu, X, Cpu, LogOut, User, Settings, ChevronDown, Command } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import { useAuth } from '@/features/auth/useAuth'
import { logOut } from '@/features/auth/authService'

const navLinks = [
  { label: 'Home',     href: '/'        },
  { label: 'Projects', href: '/projects' },
  { label: 'About',    href: '/about'   },
  { label: 'Contact',  href: '/contact' },
]

function UserMenu({ user, displayName, initials }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    try { await logOut(); toast.success('See you soon! 👋'); navigate('/') }
    catch { toast.error('Failed to sign out.') }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 transition-colors duration-150"
      >
        {user?.photoURL
          ? <img src={user.photoURL} alt={displayName} className="w-7 h-7 rounded-full ring-2 ring-brand-100" />
          : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
        }
        <span className="text-sm font-medium text-gray-700 max-w-24 truncate hidden sm:block">{displayName}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-dropdown overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
            </div>
            <div className="p-1.5">
              {[{ icon: User, label: 'My Profile', href: '/profile' }, { icon: Settings, label: 'Settings', href: '/settings' }].map(({ icon: Icon, label, href }) => (
                <Link key={label} to={href} onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-100 font-medium">
                  <Icon size={15} className="text-gray-400" />{label}
                </Link>
              ))}
            </div>
            <div className="p-1.5 border-t border-gray-100">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-danger-500 hover:bg-danger-50 transition-colors duration-100 font-medium">
                <LogOut size={15} />Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, displayName, initials } = useAuth()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const handleLogoutMobile = async () => {
    setMobileOpen(false)
    try { await logOut(); toast.success('See you soon! 👋'); navigate('/') }
    catch { toast.error('Failed to sign out.') }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-navbar' : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-brand">
                <Cpu size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[17px] text-gray-900 tracking-tight">
                Mecha<span className="text-brand-gradient">Tronix</span>
              </span>
            </Link>

            {/* Search bar */}
            <div className="hidden lg:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search projects, schematics, or topics..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-10 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all duration-200" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-gray-100 border border-gray-200 rounded-md px-1.5 py-0.5">
                  <Command size={10} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-mono">/</span>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <Link key={link.href} to={link.href}
                    className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-150 ${
                      isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}>
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Right actions */}
            <div className="hidden md:flex items-center gap-2.5">
              {isAuthenticated ? (
                <>
                  <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                    <Bell size={17} />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-500 rounded-full ring-1 ring-white" />
                  </button>
                  <Link to="/projects/create">
                    <Button variant="brand" size="sm" icon={<Plus size={15} />}>New Project</Button>
                  </Link>
                  <UserMenu user={user} displayName={displayName} initials={initials} />
                </>
              ) : (
                <>
                  <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                  <Link to="/signup"><Button variant="brand" size="sm">Get Started</Button></Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-white border-b border-gray-100 shadow-lg md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <div className="relative mb-3">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-300" />
              </div>
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      {user?.photoURL
                        ? <img src={user.photoURL} alt={displayName} className="w-8 h-8 rounded-full" />
                        : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                    <Link to="/projects/create" className="block">
                      <Button variant="brand" size="sm" icon={<Plus size={15} />} className="w-full justify-center">New Project</Button>
                    </Link>
                    <button onClick={handleLogoutMobile}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-50 transition-colors">
                      <LogOut size={15} />Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block"><Button variant="secondary" size="sm" className="w-full justify-center">Sign In</Button></Link>
                    <Link to="/signup" className="block"><Button variant="brand" size="sm" className="w-full justify-center">Get Started</Button></Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}