<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { utilities, categories } from '@/data/utilities'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const open = ref(false)
const expanded = ref(new Set<string>(['Converters', 'Formatters']))

function titleToPath(title: string) {
  return `/${title.replace(/\//g, '-').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`
}

function toggle(category: string) {
  if (expanded.value.has(category)) expanded.value.delete(category)
  else expanded.value.add(category)
  expanded.value = new Set(expanded.value)
}

function navigate(title: string) {
  router.push(titleToPath(title))
  open.value = false
}
</script>

<template>
  <button class="rounded-md border p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden" aria-label="Open tools menu" @click="open = true">
    <Menu class="h-5 w-5" />
  </button>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 bg-black/50 md:hidden" @click.self="open = false">
      <aside class="h-full w-[min(88vw,22rem)] overflow-auto border-r bg-card p-4 text-card-foreground shadow-2xl">
        <div class="mb-5 flex items-center justify-between border-b pb-4">
          <div><p class="font-semibold">Rails Utilities</p><p class="text-xs text-muted-foreground">Choose a tool</p></div>
          <button class="rounded-md p-2 hover:bg-accent" aria-label="Close tools menu" @click="open = false"><X class="h-5 w-5" /></button>
        </div>
        <nav class="space-y-3">
          <div v-for="category in categories.filter((item) => item !== 'All')" :key="category">
            <button class="flex w-full items-center justify-between rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground" @click="toggle(category)">
              {{ category }}
              <ChevronDown v-if="expanded.has(category)" class="h-4 w-4" /><ChevronRight v-else class="h-4 w-4" />
            </button>
            <div v-show="expanded.has(category)" class="ml-2 border-l pl-2">
              <button v-for="utility in utilities.filter((item) => item.category === category)" :key="utility.id" class="block w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground" :class="{ 'bg-accent text-accent-foreground': route.name === utility.title }" @click="navigate(utility.title)">
                {{ utility.title }}
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  </Teleport>
</template>
