export function shareUrl(params: Record<string, string>): string {
  const url = new URL(location.href)
  url.search = ''
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value)
  }
  return url.toString()
}
