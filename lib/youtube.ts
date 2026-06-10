export function getYoutubeId(url?: string | null): string | null {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}
export function getYoutubeThumb(youtubeUrl?: string | null, manualThumb?: string | null): string | null {
  if (manualThumb) return manualThumb
  const id = getYoutubeId(youtubeUrl)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
