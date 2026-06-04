import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { getProjects, getProjectBySlug, getMyProjects, incrementView } from './projectService'
import { getLikeStatus, toggleLike, getSaveStatus, toggleSave } from '@/lib/likeService' // تم تعديل المسار ليقرأ من lib بنجاح
import { useAuthStore } from '@/features/auth/authStore'

// ── Query keys factory ────────────────────────────────────────────────────────
export const projectKeys = {
  all:         ['projects'],
  lists:       () => [...projectKeys.all, 'list'],
  list:        (filters) => [...projectKeys.lists(), filters],
  infinite:    (filters) => [...projectKeys.all, 'infinite', filters],
  detail:      (slug) => [...projectKeys.all, 'detail', slug],
  mine:        () => [...projectKeys.all, 'mine'],
  likeStatus:  (projectId, profileId) => [...projectKeys.all, 'like', projectId, profileId],
  saveStatus:  (projectId, profileId) => [...projectKeys.all, 'save', projectId, profileId],
  stats:       () => [...projectKeys.all, 'stats'],
}

// ── Fetch projects (paginated) ────────────────────────────────────────────────
export function useProjects(filters = {}) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn:  () => getProjects(filters),
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
  })
}

// ── Infinite scroll projects ───────────────────────────────────────────────────
export function useInfiniteProjects(filters = {}) {
  return useInfiniteQuery({
    queryKey: projectKeys.infinite(filters),
    queryFn:  ({ pageParam = 1 }) => getProjects({ ...filters, page: pageParam }),
    getNextPageParam: (last) => {
      const loaded = last.page * last.pageSize
      return loaded < last.total ? last.page + 1 : undefined
    },
    staleTime: 1000 * 60 * 2,
  })
}

// ── Single project by slug ────────────────────────────────────────────────────
export function useProject(slug) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn:  () => getProjectBySlug(slug),
    enabled:  !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

// ── My projects ───────────────────────────────────────────────────────────────
export function useMyProjects() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: projectKeys.mine(),
    queryFn:  getMyProjects,
    enabled:  !!user,
    staleTime: 1000 * 30,
  })
}

// ── Platform stats (real counts from DB) ─────────────────────────────────────
export function usePlatformStats() {
  return useQuery({
    queryKey: projectKeys.stats(),
    queryFn:  async () => {
      const { supabase } = await import('@/lib/supabase')

      const [projectsRes, profilesRes, categoriesRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('projects')
          .select('category')
          .eq('published', true),
      ])

      // Count by category
      const categoryMap = {}
      if (categoriesRes.data) {
        for (const row of categoriesRes.data) {
          categoryMap[row.category] = (categoryMap[row.category] || 0) + 1
        }
      }

      return {
        projectsCount:  projectsRes.count  || 0,
        engineersCount: profilesRes.count  || 0,
        categories:      categoryMap,
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}

// ── Like status for current user ──────────────────────────────────────────────
export function useLikeStatus(projectId, profileId) {
  return useQuery({
    queryKey: projectKeys.likeStatus(projectId, profileId),
    queryFn:  () => getLikeStatus(projectId, profileId),
    enabled:  !!projectId && !!profileId,
    staleTime: 1000 * 60,
  })
}

// ── Toggle like mutation ──────────────────────────────────────────────────────
export function useToggleLike(projectId) {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: ({ profileId, currentlyLiked }) =>
      toggleLike({ projectId, profileId, currentlyLiked }),

    onMutate: async ({ profileId, currentlyLiked }) => {
      // Optimistic update
      const likeKey = projectKeys.likeStatus(projectId, profileId)
      const detailKey = projectKeys.detail

      await qc.cancelQueries({ queryKey: likeKey })
      const prev = qc.getQueryData(likeKey)

      qc.setQueryData(likeKey, !currentlyLiked)

      // Optimistically update likes_count on the project detail
      qc.setQueriesData({ queryKey: projectKeys.all }, (old) => {
        if (!old) return old
        // Handle both single-project and list formats
        if (old.projects) {
          return {
            ...old,
            projects: old.projects.map((p) =>
              p.id === projectId
                ? { ...p, likes_count: p.likes_count + (currentlyLiked ? -1 : 1) }
                : p
            ),
          }
        }
        if (old.id === projectId) {
          return { ...old, likes_count: old.likes_count + (currentlyLiked ? -1 : 1) }
        }
        return old
      })

      return { prev }
    },

    onError: (_err, { profileId, currentlyLiked }, ctx) => {
      const likeKey = projectKeys.likeStatus(projectId, profileId)
      qc.setQueryData(likeKey, ctx.prev)
    },

    onSettled: (_data, _err, { profileId }) => {
      qc.invalidateQueries({ queryKey: projectKeys.likeStatus(projectId, profileId) })
      qc.invalidateQueries({ queryKey: projectKeys.detail })
    },
  })
}

// ── Save status for current user ──────────────────────────────────────────────
export function useSaveStatus(projectId, profileId) {
  return useQuery({
    queryKey: projectKeys.saveStatus(projectId, profileId),
    queryFn:  () => getSaveStatus(projectId, profileId),
    enabled:  !!projectId && !!profileId,
    staleTime: 1000 * 60,
  })
}

// ── Toggle save mutation ──────────────────────────────────────────────────────
export function useToggleSave(projectId) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ profileId, currentlySaved }) =>
      toggleSave({ projectId, profileId, currentlySaved }),

    onMutate: async ({ profileId, currentlySaved }) => {
      const saveKey = projectKeys.saveStatus(projectId, profileId)
      await qc.cancelQueries({ queryKey: saveKey })
      const prev = qc.getQueryData(saveKey)
      qc.setQueryData(saveKey, !currentlySaved)
      return { prev }
    },

    onError: (_err, { profileId }, ctx) => {
      qc.setQueryData(projectKeys.saveStatus(projectId, profileId), ctx.prev)
    },

    onSettled: (_data, _err, { profileId }) => {
      qc.invalidateQueries({ queryKey: projectKeys.saveStatus(projectId, profileId) })
    },
  })
}

// ── Increment view (fire-and-forget) ─────────────────────────────────────────
export function useIncrementView() {
  return useCallback((projectId) => {
    incrementView(projectId).catch(() => {}) // silent fail
  }, [])
}