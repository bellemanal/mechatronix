import { useEffect, useRef, useCallback } from 'react'
import { useProjectStore } from './projectStore'
import { saveDraft } from './projectService'

const AUTOSAVE_INTERVAL = 30_000 // 30 seconds

export function useAutosave({ enabled = true, profileId = null } = {}) {
  const { form, isSavingDraft, setSavingDraft, setLastSavedAt, setProjectId } = useProjectStore()
  const timerRef = useRef(null)
  const lastSaveRef = useRef(null)

  const save = useCallback(async () => {
    // Don't save empty forms
    if (!form.title?.trim()) return
    // Prevent concurrent saves
    if (isSavingDraft) return

    const formSnapshot = JSON.stringify(form)
    if (formSnapshot === lastSaveRef.current) return // no changes
    lastSaveRef.current = formSnapshot

    setSavingDraft(true)
    try {
      const result = await saveDraft(form.projectId, form, profileId)
      if (!form.projectId) setProjectId(result.id)
      setLastSavedAt(new Date().toISOString())
    } catch (err) {
      // Silently fail autosave — user will be notified on manual save
      console.warn('[Autosave] Failed:', err.message)
    } finally {
      setSavingDraft(false)
    }
  }, [form, isSavingDraft, profileId, setSavingDraft, setLastSavedAt, setProjectId])

  useEffect(() => {
    if (!enabled) return

    timerRef.current = setInterval(save, AUTOSAVE_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [save, enabled])

  // Save on form changes (debounced — only if user has a project ID already)
  useEffect(() => {
    if (!enabled || !form.projectId) return

    const timeout = setTimeout(save, 5000) // debounce 5s after last change
    return () => clearTimeout(timeout)
  }, [form, save, enabled])

  return { save }
}