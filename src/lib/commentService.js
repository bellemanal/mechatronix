import { supabase } from '@/lib/supabase'
import { handleSupabaseError } from '@/lib/apiService' // تم تصحيح المسار هنا ليقرأ من lib
import { auth } from '@/lib/firebase'

// ── Fetch comments for a project ───────────────────────────────────────────────
export async function getComments(projectId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id, content, is_edited, created_at, updated_at, parent_id,
      profiles:author_id (
        id, display_name, photo_url, firebase_uid
      )
    `)
    .eq('project_id', projectId)
    .is('parent_id', null)       // top-level only; replies fetched separately
    .order('created_at', { ascending: false })

  if (error) handleSupabaseError(error, 'getComments')
  return data || []
}

// ── Fetch replies for a comment ────────────────────────────────────────────────
export async function getReplies(parentId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id, content, is_edited, created_at, parent_id,
      profiles:author_id (
        id, display_name, photo_url, firebase_uid
      )
    `)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true })

  if (error) handleSupabaseError(error, 'getReplies')
  return data || []
}

// ── Add comment ────────────────────────────────────────────────────────────────
export async function addComment({ projectId, authorId, content, parentId = null }) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('comments')
    .insert({
      project_id:  projectId,
      author_id:   authorId,
      firebase_uid: uid,
      content:     content.trim(),
      parent_id:   parentId || null,
    })
    .select(`
      id, content, is_edited, created_at, parent_id,
      profiles:author_id (
        id, display_name, photo_url, firebase_uid
      )
    `)
    .single()

  if (error) handleSupabaseError(error, 'addComment')
  return data
}

// ── Update comment ─────────────────────────────────────────────────────────────
export async function updateComment(commentId, content) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('comments')
    .update({ content: content.trim() })
    .eq('id', commentId)
    .eq('firebase_uid', uid)
    .select('id, content, is_edited, updated_at')
    .single()

  if (error) handleSupabaseError(error, 'updateComment')
  return data
}

// ── Delete comment ─────────────────────────────────────────────────────────────
export async function deleteComment(commentId) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('firebase_uid', uid)

  if (error) handleSupabaseError(error, 'deleteComment')
}