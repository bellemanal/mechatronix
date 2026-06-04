// ─── Validation ───────────────────────────────────────────────────────────────

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required.'
  if (!re.test(email)) return 'Enter a valid email address.'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Password is required.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  return null
}

export function validateDisplayName(name) {
  if (!name || !name.trim()) return 'Full name is required.'
  if (name.trim().length < 2) return 'Name must be at least 2 characters.'
  return null
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Please confirm your password.'
  if (password !== confirm) return 'Passwords do not match.'
  return null
}

// ─── Password strength ────────────────────────────────────────────────────────

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 2) return { score, label: 'Fair', color: 'bg-yellow-500' }
  if (score <= 3) return { score, label: 'Good', color: 'bg-arc-500' }
  return { score, label: 'Strong', color: 'bg-plasma-500' }
}

// ─── Avatar helpers ───────────────────────────────────────────────────────────

export function getAvatarUrl(user) {
  if (user?.photoURL) return user.photoURL
  return null
}

export function getProviderName(user) {
  if (!user?.providerData?.length) return 'email'
  const provider = user.providerData[0]?.providerId
  if (provider === 'google.com') return 'google'
  return 'email'
}
