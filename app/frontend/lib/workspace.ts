import { ref } from 'vue'

export interface WorkspaceSnippet {
  id: string
  tool: string
  name: string
  input: string
  output: string
  createdAt: number
}

export interface WorkspaceBackup {
  version: 1
  exportedAt: string
  snippets: WorkspaceSnippet[]
  history: WorkspaceSnippet[]
}

const SNIPPETS_KEY = 'rails-utilities:snippets'
const HISTORY_KEY = 'rails-utilities:history'
const MAX_HISTORY = 20

function read<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function listSnippets(tool: string): WorkspaceSnippet[] {
  return read<WorkspaceSnippet[]>(SNIPPETS_KEY, []).filter((snippet) => snippet.tool === tool)
}

export function saveSnippet(tool: string, name: string, input: string, output: string): WorkspaceSnippet {
  const snippet: WorkspaceSnippet = { id: crypto.randomUUID(), tool, name, input, output, createdAt: Date.now() }
  write(SNIPPETS_KEY, [snippet, ...read<WorkspaceSnippet[]>(SNIPPETS_KEY, [])])
  return snippet
}

export function deleteSnippet(id: string) {
  write(SNIPPETS_KEY, read<WorkspaceSnippet[]>(SNIPPETS_KEY, []).filter((snippet) => snippet.id !== id))
}

export function recordToolHistory(tool: string, input: string, output: string) {
  if (!input.trim()) return
  const entries = read<WorkspaceSnippet[]>(HISTORY_KEY, [])
  const next = { id: crypto.randomUUID(), tool, name: 'History', input, output, createdAt: Date.now() }
  write(HISTORY_KEY, [next, ...entries.filter((entry) => !(entry.tool === tool && entry.input === input)).slice(0, MAX_HISTORY - 1)])
}

export function listHistory(tool: string): WorkspaceSnippet[] {
  return read<WorkspaceSnippet[]>(HISTORY_KEY, []).filter((entry) => entry.tool === tool)
}

export function exportWorkspace(): string {
  const backup: WorkspaceBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    snippets: read<WorkspaceSnippet[]>(SNIPPETS_KEY, []),
    history: read<WorkspaceSnippet[]>(HISTORY_KEY, [])
  }
  return JSON.stringify(backup, null, 2)
}

function isSnippet(value: unknown): value is WorkspaceSnippet {
  if (!value || typeof value !== 'object') return false
  const snippet = value as Partial<WorkspaceSnippet>
  return typeof snippet.id === 'string' && typeof snippet.tool === 'string' && typeof snippet.name === 'string' && typeof snippet.input === 'string' && typeof snippet.output === 'string' && typeof snippet.createdAt === 'number'
}

export function importWorkspace(serialized: string): boolean {
  try {
    const backup = JSON.parse(serialized) as Partial<WorkspaceBackup>
    if (backup.version !== 1 || !Array.isArray(backup.snippets) || !Array.isArray(backup.history)) return false
    if (!backup.snippets.every(isSnippet) || !backup.history.every(isSnippet)) return false
    write(SNIPPETS_KEY, backup.snippets)
    write(HISTORY_KEY, backup.history.slice(0, MAX_HISTORY))
    return true
  } catch {
    return false
  }
}

export function useSnippets(tool: string) {
  const snippets = ref(listSnippets(tool))

  function refresh() {
    snippets.value = listSnippets(tool)
  }

  function save(name: string, input: string, output: string) {
    saveSnippet(tool, name, input, output)
    refresh()
  }

  function remove(id: string) {
    deleteSnippet(id)
    refresh()
  }

  return { snippets, save, remove, refresh }
}
