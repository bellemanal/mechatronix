import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// تم تعديل المسار هنا ليقرأ من البلاصة الصحيحة لـ realtimeService
import { getComments, addComment, updateComment, deleteComment } from '@/lib/realtimeService'

export const commentKeys = {
  all:     (projectId) => ['comments', projectId],
  replies: (parentId) => ['replies', parentId],
}

// ── Fetch comments ────────────────────────────────────────────────────────────
export function useComments(projectId) {
  return useQuery({
    queryKey: commentKeys.all(projectId),
    queryFn:  () => getComments(projectId),
    enabled:  !!projectId,
    staleTime: 1000 * 30,
  })
}

// ── Add comment mutation ──────────────────────────────────────────────────────
export function useAddComment(projectId) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload) => addComment({ projectId, ...payload }),

    onSuccess: (newComment) => {
      qc.setQueryData(commentKeys.all(projectId), (old = []) => [newComment, ...old])
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: commentKeys.all(projectId) })
    },
  })
}

// ── Delete comment mutation ───────────────────────────────────────────────────
export function useDeleteComment(projectId) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteComment,

    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: commentKeys.all(projectId) })
      const prev = qc.getQueryData(commentKeys.all(projectId))
      qc.setQueryData(commentKeys.all(projectId), (old = []) =>
        old.filter((c) => c.id !== commentId)
      )
      return { prev }
    },

    onError: (_err, _id, ctx) => {
      qc.setQueryData(commentKeys.all(projectId), ctx.prev)
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: commentKeys.all(projectId) })
    },
  })
}

// ── Update comment mutation ───────────────────────────────────────────────────
export function useUpdateComment(projectId) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, content }) => updateComment(commentId, content),

    onSuccess: (updated) => {
      qc.setQueryData(commentKeys.all(projectId), (old = []) =>
        old.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
      )
    },
  })
}