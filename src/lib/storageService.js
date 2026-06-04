export const BUCKETS = {
  PROJECTS: 'projects',
  AVATARS: 'avatars',
}

export const storageService = {
  getPublicUrl(bucket, path) {
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
  }
}
