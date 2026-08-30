<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { utilities } from '@/data/utilities'
import { titleToPath } from '@/lib/routes'
import { recordVisit, getRecents } from '@/lib/recents'
import { Command, History, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const open = ref(false)
const query = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)
const recentRank = computed(() => new Map(getRecents().map((entry, index) => [entry.title, index])))

const list = computed(() => {
  const base = utilities.filter((u) => u.title !== 'All Utilities')
  const filtered = query.value
    ? base.filter((u) => {
        const q = query.value.toLowerCase()
        return u.title.toLowerCase().includes(q) || u.description.toLowerCase().includes(q) || u.category.toLowerCase().includes(q)
      })
    : base
  return [...filtered].sort((a, b) => (recentRank.value.get(a.title) ?? 999) - (recentRank.value.get(b.title) ?? 999))
})

function toggle() {
  open.value = !open.value
  if (open.value) {
    query.value = ''
    activeIndex.value = 0
    requestAnimationFrame(() => inputEl.value?.focus())
  }
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    toggle()
  } else if (event.key === 'Escape' && open.value) open.value = false
}

function navigate(entry: (typeof list.value)[number]) {
  recordVisit(entry.title)
  router.push(`/${titleToPath(entry.title)}`)
  open.value = false
}

function onListKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, list.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === 'Enter' && list.value[activeIndex.value]) navigate(list.value[activeIndex.value])
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <button
    class="group flex min-w-[11rem] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-primary hover:bg-primary/10"
    aria-label="Open Command Center"
    @click="toggle"
  >
    <Sparkles class="h-4 w-4 text-primary transition-transform group-hover:rotate-12" />
    <span>Command Center</span>
    <span class="hidden items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-xs text-muted-foreground sm:flex"><Command class="h-3 w-3" /> K</span>
  </button>

  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 bg-black/40 p-4 backdrop-blur-sm" @click.self="open = false">
      <div class="mx-auto mt-20 max-w-xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div class="flex items-center gap-3 border-b px-4 py-3">
          <Sparkles class="h-4 w-4 text-primary" />
          <div><p class="text-sm font-semibold">Command Center</p><p class="text-xs text-muted-foreground">Jump to any utility</p></div>
          <Command class="ml-auto h-4 w-4 text-muted-foreground" />
        </div>
        <input ref="inputEl" v-model="query" type="search" placeholder="Type a utility, category, or task..." class="w-full border-b bg-transparent px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground" @keydown="onListKeydown" />
        <ul v-if="list.length" class="max-h-[min(28rem,60vh)] overflow-auto p-2">
          <li v-for="(entry, idx) in list" :key="entry.id" :class="['flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm', idx === activeIndex ? 'bg-accent text-accent-foreground' : '']" @click="navigate(entry)" @mouseenter="activeIndex = idx">
            <span class="flex items-center gap-2"><History v-if="recentRank.has(entry.title) && !query" class="h-3.5 w-3.5 text-muted-foreground" />{{ entry.title }}</span>
            <span class="text-xs text-muted-foreground">{{ entry.category }}</span>
          </li>
        </ul>
        <div v-else class="p-4 text-center text-sm text-muted-foreground">No utilities match</div>
      </div>
    </div>
  </Teleport>
</template>
