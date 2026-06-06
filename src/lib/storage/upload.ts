import { createClient } from '@/lib/supabase/client'

const BUCKET_NAME = 'meal-photos'

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()
}

export async function uploadMealPhoto(
  file: File,
  userId: string
): Promise<{ url: string; path: string }> {
  const supabase = createClient()

  const timestamp = Date.now()
  const sanitized = sanitizeFilename(file.name)
  const path = `${userId}/${timestamp}-${sanitized}`

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)

  return { url: publicUrl, path }
}
