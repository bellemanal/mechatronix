import { useEffect } from 'react'
import { useAuthStore } from './authStore'
import { upsertProfile } from '@/lib/profileService'

export default function AuthProvider({ children }) {
  const { user, initialized } = useAuthStore()

  useEffect(() => {
    if (!initialized || !user) return

    // Create or update profile in Supabase when user logs in
    upsertProfile({
      firebaseUid:  user.uid,
      email:        user.email,
      displayName:  user.displayName || user.email?.split('@')[0],
      photoUrl:     user.photoURL || null,
    }).catch(err => console.warn('Profile upsert failed:', err))

  }, [user?.uid, initialized])

  return children
}