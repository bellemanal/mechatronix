import { motion } from 'framer-motion'
import { Layers, Search, AlertTriangle, WifiOff } from 'lucide-react'
import Button from './Button'

const icons = {
  empty:   Layers,
  search:  Search,
  error:   AlertTriangle,
  offline: WifiOff,
}

export default function EmptyState({
  type = 'empty',
  title,
  description,
  action,
  actionLabel,
  icon: CustomIcon,
}) {
  const Icon = CustomIcon || icons[type] || Layers

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
        type === 'error'   ? 'bg-danger-50 text-danger-400' :
        type === 'search'  ? 'bg-gray-100 text-gray-400'    :
        type === 'offline' ? 'bg-warning-50 text-warning-400' :
                             'bg-brand-50 text-brand-400'
      }`}>
        <Icon size={28} />
      </div>

      <h3 className="font-bold text-lg text-gray-900 mb-2">
        {title || 'Nothing here yet'}
      </h3>

      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
        {description || 'Content will appear here once available.'}
      </p>

      {action && (
        <Button variant="brand" size="md" onClick={action}>
          {actionLabel || 'Get Started'}
        </Button>
      )}
    </motion.div>
  )
}