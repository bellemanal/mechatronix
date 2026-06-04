import { supabase } from '@/lib/supabase'
import { handleSupabaseError } from '@/lib/apiService'
import { auth } from '@/lib/firebase'

// ── Slug generator ─────────────────────────────────────────────────────────────
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Date.now().toString(36)
}

// ── Create project (draft) ────────────────────────────────────────────────────
export async function createProjectDraft(formData, authorProfileId) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const slug = toSlug(formData.title || 'untitled-project')
  const payload = buildPayload(formData, uid, authorProfileId, slug, false)

  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select('id, slug')
    .single()

  if (error) handleSupabaseError(error, 'createProjectDraft')
  return data
}

// ── Update project ─────────────────────────────────────────────────────────────
export async function updateProject(projectId, formData, authorProfileId) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const payload = buildPayload(formData, uid, authorProfileId, undefined, formData.published)
  delete payload.slug

  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', projectId)
    .eq('firebase_uid', uid)
    .select('id, slug')

  if (error) handleSupabaseError(error, 'updateProject')
  return data?.[0]
}

// ── Publish project ────────────────────────────────────────────────────────────
export async function publishProject(projectId) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .update({ published: true, published_at: new Date().toISOString() })
    .eq('id', projectId)
    .eq('firebase_uid', uid)
    .select('id, slug')

  if (error) handleSupabaseError(error, 'publishProject')
  return data?.[0]
}

// ── Delete project ─────────────────────────────────────────────────────────────
export async function deleteProject(projectId) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('firebase_uid', uid)

  if (error) handleSupabaseError(error, 'deleteProject')
}

// ── Save draft ─────────────────────────────────────────────────────────────────
export async function saveDraft(projectId, formData, authorProfileId) {
  if (!projectId) {
    return createProjectDraft(formData, authorProfileId)
  }
  return updateProject(projectId, formData, authorProfileId)
}

// ── Get projects (paginated, filtered) ────────────────────────────────────────
export async function getProjects({
  page = 1,
  pageSize = 12,
  category = null,
  difficulty = null,
  search = null,
  orderBy = 'created_at',
  ascending = false,
} = {}) {
  let query = supabase
    .from('projects')
    .select(`
      id, title, slug, short_description, category, difficulty,
      cover_image, images, tags, technologies,
      views_count, likes_count, comments_count, saves_count,
      published_at, created_at,
      profiles:author_id (
        id, display_name, photo_url
      )
    `, { count: 'exact' })
    .eq('published', true)
    .order(orderBy, { ascending })

  if (category) query = query.eq('category', category)
  if (difficulty) query = query.eq('difficulty', difficulty)
  if (search) {
    query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`)
  }

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, error, count } = await query
  if (error) handleSupabaseError(error, 'getProjects')

  return { projects: data || [], total: count || 0, page, pageSize }
}

// ── Get single project by slug ────────────────────────────────────────────────
export async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:author_id (
        id, display_name, photo_url, bio, github_url, linkedin_url
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) handleSupabaseError(error, 'getProjectBySlug')
  return data
}

// ── Get user's own projects ────────────────────────────────────────────────────
export async function getMyProjects() {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .select('id, title, slug, category, difficulty, published, cover_image, views_count, likes_count, created_at, updated_at')
    .eq('firebase_uid', uid)
    .order('updated_at', { ascending: false })

  if (error) handleSupabaseError(error, 'getMyProjects')
  return data || []
}

// ── Increment view ─────────────────────────────────────────────────────────────
export async function incrementView(projectId) {
  const { error } = await supabase.rpc('increment_view_count', { project_id: projectId })
  if (error) console.warn('View increment failed:', error)
}

// ── Internal: build DB payload ────────────────────────────────────────────────
function buildPayload(formData, uid, authorProfileId, slug, published) {
  const payload = {
    firebase_uid: uid,
    author_id: authorProfileId,
    title: formData.title || 'Untitled Project',
    short_description: formData.shortDescription || '',
    full_description: formData.fullDescription || '',
    category: formData.category || 'Other',
    difficulty: formData.difficulty || 'Beginner',
    tags: formData.tags || [],
    technologies: formData.technologies || [],
    features: formData.features || [],
    challenges: formData.challenges || '',
    solution: formData.solution || '',
    cover_image: formData.coverImage?.url || null,
    images: (formData.images || []).map((img) => img.url).filter(Boolean),
    video_url: formData.videoUrl || null,
    links: formData.links || [],
    team_members: (formData.teamMembers || []).map((m) => ({
      name: m.name,
      role: m.roles ? m.roles.join(', ') : m.role || '',
      roles: m.roles || (m.role ? [m.role] : []),
      email: m.email || '',
      phone: m.phone || '',
      github: m.github || '',
      linkedin: m.linkedin || '',
      avatar_url: m.avatar || m.avatar_url || null,
      is_author: m.isAuthor || false,
    })),
    published: published || false,
  }

  if (slug) payload.slug = slug
  return payload
}