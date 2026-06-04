import { create } from 'zustand'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { supabase } from '@/lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
}))

onAuthStateChanged(auth, async (firebaseUser) => {
  if (!firebaseUser) {
    useAuthStore.setState({ user: null, loading: false, initialized: true })
    return
  }

  // Fetch profileId from Supabase profiles table
  let profileId = null
  try {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('firebase_uid', firebaseUser.uid)
      .single()

    if (data?.id) {
      profileId = data.id
    } else {
      // Profile مكاينش — نشأو
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          firebase_uid: firebaseUser.uid,
          display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photo_url: firebaseUser.photoURL || null,
        })
        .select('id')
        .single()

      profileId = newProfile?.id || null
    }
  } catch (err) {
    console.warn('Failed to fetch profileId:', err)
  }

  useAuthStore.setState({
    user: {
      uid:           firebaseUser.uid,
      email:         firebaseUser.email,
      displayName:   firebaseUser.displayName,
      photoURL:      firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      profileId,
    },
    loading: false,
    initialized: true,
  })
})