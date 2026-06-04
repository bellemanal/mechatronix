import { clsx } from 'clsx'

export default function Section({ children, className = '', id, noPadding = false, gray = false }) {
  return (
    <section id={id} className={clsx(!noPadding && 'py-20 lg:py-28', gray && 'bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

Section.Label = ({ children }) => (
  <div className="flex justify-center mb-5">
    <span className="section-label">{children}</span>
  </div>
)

Section.LabelLeft = ({ children }) => (
  <div className="mb-5">
    <span className="section-label">{children}</span>
  </div>
)

Section.Title = ({ children, center = false, className = '' }) => (
  <h2 className={clsx(
    'font-bold text-3xl md:text-4xl text-gray-900 leading-tight mb-4',
    center && 'text-center',
    className
  )}>
    {children}
  </h2>
)

Section.Subtitle = ({ children, center = false, className = '' }) => (
  <p className={clsx('text-gray-500 text-lg leading-relaxed max-w-2xl', center && 'mx-auto text-center', className)}>
    {children}
  </p>
)
