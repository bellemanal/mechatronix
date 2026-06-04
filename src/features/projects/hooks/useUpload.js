import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { auth } from '@/lib/firebase'
import { BUCKETS } from '@/lib/storageService'

// ── Allowed file types ────────────────────────────────────────────────────────
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const ALLOWED_FILE_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/pdf',
  '.ino', '.stl', '.step', '.f3d', '.dwg',
]
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024   // 10MB
export const MAX_FILE_SIZE  = 50 * 1024 * 1024   // 50MB
export const MAX_IMAGES     = 10

// ── Validate image file ───────────────────────────────────────────────────────
export function validateImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, or GIF images are allowed.'
  }
  if (file.size > MAX_IMAGE_SIZE) return 'Image must be smaller than 10MB.'
  return null
}

// ── Validate engineering file ─────────────────────────────────────────────────
export function validateEngFile(file) {
  if (file.size > MAX_FILE_SIZE) return 'File must be smaller than 50MB.'
  return null
}

// ── Format file size ──────────────────────────────────────────────────────────
export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

// ── Upload a single file to Supabase Storage ──────────────────────────────────
export async function uploadToSupabase(bucket, path, file, onProgress) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw new Error(error.message)

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

// ── Main upload hook ──────────────────────────────────────────────────────────
export function useImageUpload({ projectId, onAdd, onUpdate, onRemove }) {
  const [isDragging, setIsDragging] = useState(false)

  const uid = auth.currentUser?.uid

  const upload = useCallback(async (file) => {
    const err = validateImage(file)
    if (err) return { error: err }

    const id = crypto.randomUUID()
    const preview = URL.createObjectURL(file)
    const ext = file.name.split('.').pop()
    const path = `${uid}/projects/${projectId || 'draft'}/gallery/${id}.${ext}`

    onAdd({ id, file, preview, url: null, uploading: true, progress: 0, error: null })

    try {
      const url = await uploadToSupabase(
        BUCKETS.PROJECTS,
        path,
        file,
        (progress) => onUpdate(id, { progress }),
      )
      onUpdate(id, { url, uploading: false, progress: 100 })
      return { id, url }
    } catch (err) {
      onUpdate(id, { uploading: false, error: err.message })
      return { id, error: err.message }
    }
  }, [uid, projectId, onAdd, onUpdate])

  const uploadMultiple = useCallback(async (files) => {
    return Promise.all(Array.from(files).slice(0, MAX_IMAGES).map(upload))
  }, [upload])

  const dragHandlers = {
    onDragEnter: (e) => { e.preventDefault(); setIsDragging(true) },
    onDragLeave: (e) => { e.preventDefault(); setIsDragging(false) },
    onDragOver:  (e) => { e.preventDefault() },
    onDrop: (e) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files).filter((f) => ALLOWED_IMAGE_TYPES.includes(f.type))
      uploadMultiple(files)
    },
  }

  return { upload, uploadMultiple, isDragging, dragHandlers }
}

// ── Cover image upload hook ───────────────────────────────────────────────────
export function useCoverUpload({ projectId, onSet }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError]       = useState(null)

  const uid = auth.currentUser?.uid

  const upload = useCallback(async (file) => {
    const err = validateImage(file)
    if (err) { setError(err); return }

    setUploading(true)
    setError(null)
    const preview = URL.createObjectURL(file)
    onSet({ file, preview, url: null, uploading: true, progress: 0 })

    const ext = file.name.split('.').pop()
    const path = `${uid}/projects/${projectId || 'draft'}/cover/cover.${ext}`

    try {
      const url = await uploadToSupabase(BUCKETS.PROJECTS, path, file, setProgress)
      onSet({ file, preview, url, uploading: false, progress: 100 })
    } catch (err) {
      setError(err.message)
      onSet(null)
    } finally {
      setUploading(false)
    }
  }, [uid, projectId, onSet])

  return { upload, uploading, progress, error }
}

// ── Avatar upload hook ────────────────────────────────────────────────────────
export function useAvatarUpload({ onSet }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const uid = auth.currentUser?.uid

  const upload = useCallback(async (file) => {
    const err = validateImage(file)
    if (err) { setError(err); return }

    setUploading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const path = `${uid}/${crypto.randomUUID()}.${ext}`

    try {
      const url = await uploadToSupabase(BUCKETS.AVATARS, path, file)
      onSet(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }, [uid, onSet])

  return { upload, uploading, error }
}

// ── Engineering file upload hook ──────────────────────────────────────────────
export function useFileUpload({ projectId, onAdd, onUpdate, onRemove }) {
  const uid = auth.currentUser?.uid

  const upload = useCallback(async (file) => {
    const err = validateEngFile(file)
    if (err) return { error: err }

    const id = crypto.randomUUID()
    const ext = file.name.split('.').pop()
    const path = `${uid}/projects/${projectId || 'draft'}/files/${id}-${file.name}`

    onAdd({ id, file, name: file.name, size: file.size, type: file.type, url: null, uploading: true, progress: 0, error: null })

    try {
      const url = await uploadToSupabase(
        BUCKETS.PROJECTS,
        path,
        file,
        (progress) => onUpdate(id, { progress }),
      )
      onUpdate(id, { url, uploading: false, progress: 100 })
      return { id, url }
    } catch (err) {
      onUpdate(id, { uploading: false, error: err.message })
      return { id, error: err.message }
    }
  }, [uid, projectId, onAdd, onUpdate])

  return { upload }
}