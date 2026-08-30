const PINS_KEY = 'rails-utilities:pins'

export function getPinned(): string[] {
  try {
    return JSON.parse(localStorage.getItem(PINS_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function isPinned(title: string): boolean {
  return getPinned().includes(title)
}

export function togglePinned(title: string): boolean {
  const pinned = getPinned()
  const index = pinned.indexOf(title)
  if (index === -1) pinned.unshift(title)
  else pinned.splice(index, 1)
  localStorage.setItem(PINS_KEY, JSON.stringify(pinned))
  return index === -1
}
