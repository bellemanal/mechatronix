import { supabase } from '@/lib/supabase'

// ─── Subscribe to project comments (realtime) ─────────────────────────────────
export function subscribeToProjectComments(projectId, callbacks) {
  const channel = supabase
    .channel(`comments:project:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => callbacks.onInsert?.(payload.new),
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'comments',
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => callbacks.onUpdate?.(payload.new),
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'comments',
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => callbacks.onDelete?.(payload.old),
    )
    .subscribe()

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel)
  }
}

// ─── Subscribe to project likes count ────────────────────────────────────────
export function subscribeToProjectLikes(projectId, onLikeChange) {
  const channel = supabase
    .channel(`likes:project:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'likes',
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => onLikeChange?.(payload),
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// ─── Subscribe to new projects (for live feed) ────────────────────────────────
export function subscribeToNewProjects(onNewProject) {
  const channel = supabase
    .channel('projects:new')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'projects',
        filter: 'published=eq.true',
      },
      (payload) => onNewProject?.(payload.new),
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// ─── Subscribe to specific project updates ───────────────────────────────────
export function subscribeToProject(projectId, onUpdate) {
  const channel = supabase
    .channel(`project:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${projectId}`,
      },
      (payload) => onUpdate?.(payload.new),
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// ─── CRUD Comments ────────────────────────────────────────────────────────────

export async function getComments(projectId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function addComment({ projectId, content, parentId = null }) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      project_id: projectId,
      content,
      parent_id: parentId,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateComment(commentId, content) {
  const { data, error } = await supabase
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteComment(commentId) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw new Error(error.message)
}