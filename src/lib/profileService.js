import { supabase } from '@/lib/supabase'
import { handleSupabaseError } from '@/lib/apiService'

// ─── Get profile by Firebase UID ──────────────────────────────────────────────
export async function getProfileByFirebaseUid(firebaseUid) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = row not found, which is expected for new users
    handleSupabaseError(error, 'getProfileByFirebaseUid')
  }

  return data || null
}

// ─── Get profile by ID ────────────────────────────────────────────────────────
export async function getProfileById(profileId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (error) handleSupabaseError(error, 'getProfileById')
  return data
}

// ─── Create profile (called after Firebase signup) ────────────────────────────
export async function createProfile({ firebaseUid, email, displayName, photoUrl }) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      firebase_uid: firebaseUid,
      email,
      display_name: displayName || email.split('@')[0],
      photo_url: photoUrl || null,
    })
    .select()
    .single()

  if (error) handleSupabaseError(error, 'createProfile')
  return data
}

// ─── Upsert profile (create or update) ───────────────────────────────────────
// Called by AuthProvider every time Firebase user changes
export async function upsertProfile({ firebaseUid, email, displayName, photoUrl }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        firebase_uid: firebaseUid,
        email,
        display_name: displayName || email.split('@')[0],
        photo_url: photoUrl || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'firebase_uid', ignoreDuplicates: false },
    )
    .select()
    .single()

  if (error) handleSupabaseError(error, 'upsertProfile')
  return data
}

// ─── Update profile ───────────────────────────────────────────────────────────
export async function updateProfile(firebaseUid, updates) {
  const allowed = ['display_name', 'bio', 'location', 'website', 'github_url', 'linkedin_url', 'skills', 'photo_url']
  const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k)),
  )

  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('firebase_uid', firebaseUid)
    .select()
    .single()

  if (error) handleSupabaseError(error, 'updateProfile')
  return data
}

// ─── Search profiles ──────────────────────────────────────────────────────────
export async function searchProfiles(query, limit = 10) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, photo_url, bio, projects_count')
    .ilike('display_name', `%${query}%`)
    .limit(limit)

  if (error) handleSupabaseError(error, 'searchProfiles')
  return data || []
}