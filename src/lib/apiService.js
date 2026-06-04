export function handleSupabaseError(error, context = 'API') {
  console.error(`[Supabase Error] inside [${context}]:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  })
  
  throw new Error(error.message || 'An unexpected database error occurred.')
}
