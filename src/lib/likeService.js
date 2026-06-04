import { supabase } from '@/lib/supabase'
import { handleSupabaseError } from '@/lib/apiService' // تم تصحيح المسار هنا ليقرأ من lib
import { auth } from '@/lib/firebase'

// ── Check if current user liked a project ─────────────────────────────────────
export async function getLikeStatus(projectId, profileId) {
  if (!profileId) return false

  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('project_id', projectId)
    .eq('author_id', profileId)
    .maybeSingle()

  if (error) console.warn('getLikeStatus:', error.message)
  return !!data
}

// ── Toggle like ────────────────────────────────────────────────────────────────
export async function toggleLike({ projectId, profileId, currentlyLiked }) {
  const uid = auth.currentUser?.uid
  if (!uid || !profileId) throw new Error('Not authenticated')

  if (currentlyLiked) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('project_id', projectId)
      .eq('author_id', profileId)
      .eq('firebase_uid', uid)

    if (error) handleSupabaseError(error, 'unlike')
    return false
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({ project_id: projectId, author_id: profileId, firebase_uid: uid })

    if (error) handleSupabaseError(error, 'like')
    return true
  }
}

// ── Get like count for a project ──────────────────────────────────────────────
export async function getLikeCount(projectId) {
  const { count, error } = await supabase
    .from('likes')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)

  if (error) console.warn('getLikeCount:', error.message)
  return count || 0
}

// ── Get saved status ───────────────────────────────────────────────────────────
export async function getSaveStatus(projectId, profileId) {
  if (!profileId) return false

  const { data, error } = await supabase
    .from('saved_projects')
    .select('id')
    .eq('project_id', projectId)
    .eq('author_id', profileId)
    .maybeSingle()

  if (error) console.warn('getSaveStatus:', error.message)
  return !!data
}

// ── Toggle save ────────────────────────────────────────────────────────────────
export async function toggleSave({ projectId, profileId, currentlySaved }) {
  const uid = auth.currentUser?.uid
  if (!uid || !profileId) throw new Error('Not authenticated')

  if (currentlySaved) {
    const { error } = await supabase
      .from('saved_projects')
      .delete()
      .eq('project_id', projectId)
      .eq('author_id', profileId)

    if (error) handleSupabaseError(error, 'unsave')
    return false
  } else {
    const { error } = await supabase
      .from('saved_projects')
      .insert({ project_id: projectId, author_id: profileId, firebase_uid: uid })

    if (error) handleSupabaseError(error, 'save')
    return true
  }
}