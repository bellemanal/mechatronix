import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from './authStore'

export function useAuth() {
  const { user, loading, initialized } = useAuthStore()

  return {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    displayName: user?.displayName || user?.email || 'User',
    initials: user?.displayName
      ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : user?.email?.[0]?.toUpperCase() || 'U',
  }
}

export function useRequireAuth(redirectTo = '/login') {
  const { user, initialized } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (initialized && !user) {
      navigate(redirectTo, { replace: true })
    }
  }, [user, initialized, navigate, redirectTo])

  return { user, initialized }
}

export function useRedirectIfAuth(redirectTo = '/projects') {
  const { user, initialized } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (initialized && user) {
      navigate(redirectTo, { replace: true })
    }
  }, [user, initialized, navigate, redirectTo])

  return { user, initialized }
}