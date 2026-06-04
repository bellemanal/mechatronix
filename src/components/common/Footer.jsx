import { Link } from 'react-router-dom'
import { Cpu, Github, Youtube, Twitter, Linkedin } from 'lucide-react'

const links = {
  Platform:   [
    { label: 'About',    href: '/about'   },
    { label: 'Contact',  href: '/contact' },
    { label: 'Sign In',  href: '/login'   },
    { label: 'Sign Up',  href: '/signup'  },
  ],
  Categories: [
    { label: 'Robotics',     href: '/projects?cat=robotics'     },
    { label: 'AI Vision',    href: '/projects?cat=ai'           },
    { label: 'Electronics',  href: '/projects?cat=electronics'  },
    { label: 'IoT',          href: '/projects?cat=iot'          },
    { label: 'Automation',   href: '/projects?cat=automation'   },
    { label: 'Mechanical',   href: '/projects?cat=mechanical'   },
  ],
}

const socials = [
  { Icon: Github,   href: '#' },
  { Icon: Youtube,  href: '#' },
  { Icon: Twitter,  href: '#' },
  { Icon: Linkedin, href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative bg-gray-50 border-t border-gray-100 overflow-hidden">

      {/* Gradient separator at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent opacity-60" />

      {/* Ambient blob */}
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-brand-100 opacity-20 blur-[80px] pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-brand">
                <Cpu size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[17px] text-gray-900">
                Mecha<span className="text-brand-gradient">Tronix</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-[220px]">
              A community for real-world robotics & AI projects. Built by engineers, for engineers.
            </p>
            <a
              href="mailto:manalnahri01@gmail.com"
              className="text-sm text-gray-400 hover:text-brand-500 transition-colors"
            >
              manalnahri01@gmail.com
            </a>
            <div className="flex items-center gap-2 mt-5">
              {socials.map(({ Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-200 transition-all duration-150 shadow-xs">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Wave divider */}
        <div className="mb-6 overflow-hidden">
          <svg viewBox="0 0 1200 20" className="w-full" preserveAspectRatio="none" fill="none">
            <path d="M0,10 C200,0 400,20 600,10 C800,0 1000,20 1200,10" stroke="#E2E8F0" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2026 MechaTronix — All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} to="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}