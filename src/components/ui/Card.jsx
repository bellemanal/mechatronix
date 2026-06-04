import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export default function Card({
  children, className = '', hover = true, padding = 'md', onClick, ...props
}) {
  const pads = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6', xl: 'p-8' }
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
      className={clsx('card-base', pads[padding], hover && 'cursor-pointer', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

Card.Header = ({ children, className = '' }) => <div className={clsx('mb-4', className)}>{children}</div>
Card.Body   = ({ children, className = '' }) => <div className={clsx('', className)}>{children}</div>
Card.Footer = ({ children, className = '' }) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-100', className)}>{children}</div>
)
