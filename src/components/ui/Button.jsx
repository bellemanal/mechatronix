import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const variants = {
  brand: [
    'bg-brand-500 text-white',
    'hover:bg-brand-600 active:bg-brand-700',
    'shadow-brand hover:shadow-brand-lg',
    'border border-brand-600/20',
  ].join(' '),
  brandOutline: [
    'bg-white text-brand-600',
    'hover:bg-brand-50 active:bg-brand-100',
    'border border-brand-200 hover:border-brand-300',
    'shadow-xs',
  ].join(' '),
  secondary: [
    'bg-white text-gray-700',
    'hover:bg-gray-50 active:bg-gray-100',
    'border border-gray-200 hover:border-gray-300',
    'shadow-xs hover:shadow-sm',
  ].join(' '),
  ghost: [
    'bg-transparent text-gray-600',
    'hover:bg-gray-100 active:bg-gray-200',
    'border border-transparent',
  ].join(' '),
  danger: [
    'bg-danger-500 text-white',
    'hover:bg-danger-600',
    'shadow-sm',
  ].join(' '),
  plasma: [
    'bg-brand-500 text-white hover:bg-brand-600 shadow-brand hover:shadow-brand-lg border border-brand-600/20',
  ].join(' '),
  arc: [
    'bg-violet-600 text-white hover:bg-violet-700 shadow-sm border border-violet-700/20',
  ].join(' '),
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  sm: 'px-4 py-2 text-sm gap-2 rounded-xl',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
  xl: 'px-8 py-4 text-lg gap-3 rounded-2xl',
}

export default function Button({
  children, variant = 'secondary', size = 'md',
  icon, iconRight, loading = false, disabled = false,
  className = '', onClick, type = 'button', ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      className={clsx(
        'inline-flex items-center font-semibold',
        'transition-all duration-200 cursor-pointer select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
        : icon ? <span className="flex-shrink-0">{icon}</span> : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  )}
