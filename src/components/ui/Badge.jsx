import { clsx } from 'clsx'

const styles = {
  brand:   'badge-brand',
  violet:  'badge-violet',
  gray:    'badge-gray',
  success: 'badge-success',
  warning: 'badge-warning',
  // category map
  Robotics:    'badge-brand',
  Electronics: 'badge-violet',
  'AI & ML':   'badge-brand',
  IoT:         'badge-success',
  Drones:      'badge-gray',
  Mechanical:  'badge-gray',
}

export default function Badge({ children, variant = 'gray', icon, className = '' }) {
  const style = styles[variant] || styles[children] || 'badge-gray'
  return (
    <span className={clsx('badge', style, className)}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
