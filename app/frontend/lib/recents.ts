import { titleToPath } from '@/lib/routes'

const RECENTS_KEY = 'rails-utilities:recents'
const MAX_RECENTS = 8

export interface RecentEntry {
  title: string
  path: string
  at: number
}

export function getRecents(): RecentEntry[] {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function recordVisit(title: string): RecentEntry[] {
  const recents = getRecents().filter((r) => r.title !== title)
  recents.unshift({ title, path: `/${titleToPath(title)}`, at: Date.now() })
  recents.length = Math.min(recents.length, MAX_RECENTS)
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents))
  return recents
}

export function clearRecents(): void {
  localStorage.removeItem(RECENTS_KEY)
}
