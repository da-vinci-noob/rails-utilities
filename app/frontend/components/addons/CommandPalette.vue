<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { utilities } from '@/data/utilities'
import { titleToPath } from '@/lib/routes'
import { recordVisit } from '@/lib/recents'
import { Command, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const open = ref(false)
const query = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)

const list = computed(() => {
  const base = utilities.filter((u) => u.title !== 'All Utilities')
  if (!query.value) return base
  const q = query.value.toLowerCase()
  return base.filter((u) => u.title.toLowerCase().includes(q) || u.description.toLowerCase().includes(q))
})

function toggle() {
  open.value = !open.value
  if (open.value) {
    query.value = ''
    activeIndex.value = 0
    requestAnimationFrame(() => inputEl.value?.focus())
  }
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    toggle()
  } else if (e.key === 'Escape' && open.value) {
    open.value = false
  }
}

function navigate(entry: (typeof list.value)[number]) {
  const path = `/${titleToPath(entry.title)}`
  recordVisit(entry.title)
  router.push(path)
  open.value = false
}

function onListKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, list.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter' && list.value[activeIndex.value]) {
    navigate(list.value[activeIndex.value])
  }
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
    <span class="hidden items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-xs text-muted-foreground sm:flex">
      <Command class="h-3 w-3" /> K
    </span>
  </button>

  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" @click.self="open = false">
      <div class="mx-auto mt-24 max-w-lg rounded-xl border bg-card shadow-2xl">
        <input
          ref="inputEl"
          v-model="query"
          type="search"
          placeholder="Search utilities..."
          class="w-full rounded-t-xl border-b bg-transparent px-4 py-3 outline-none text-foreground"
          @keydown="onListKeydown"
        />
        <ul v-if="list.length" class="max-h-80 overflow-auto p-2">
          <li
            v-for="(entry, idx) in list"
            :key="entry.id"
            :class="[
              'flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm',
              idx === activeIndex ? 'bg-accent text-accent-foreground' : ''
            ]"
            @click="navigate(entry)"
            @mouseenter="activeIndex = idx"
          >
            <span>{{ entry.title }}</span>
            <span class="text-xs text-muted-foreground">{{ entry.category }}</span>
          </li>
        </ul>
        <div v-else class="p-4 text-center text-sm text-muted-foreground">No utilities match</div>
      </div>
    </div>
  </Teleport>
</template>
