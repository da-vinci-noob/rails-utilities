<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { utilities, categories } from '@/data/utilities'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const expandedCategories = ref<Set<string>>(new Set(categories.filter((category) => category !== 'All')))

const groupedUtilities = computed(() => {
  const groups: Record<string, typeof utilities> = {}
  for (const category of categories) {
    if (category !== 'All') groups[category] = utilities.filter((utility) => utility.category === category)
  }
  return groups
})

const isActive = (pathName: string) => route.name === pathName
const isExpanded = (category: string) => expandedCategories.value.has(category)

function titleToPath(title: string) {
  return `/${title.replace(/\//g, '-').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()}`
}

function toggleCategory(category: string) {
  if (expandedCategories.value.has(category)) expandedCategories.value.delete(category)
  else expandedCategories.value.add(category)
  expandedCategories.value = new Set(expandedCategories.value)
}
</script>

<template>
  <aside class="hidden w-72 shrink-0 flex-col border-r bg-card/40 text-foreground md:flex">
    <div class="border-b px-5 py-5">
      <div class="flex items-center gap-2 font-semibold">
        <span class="text-lg tracking-tight">Rails Utilities</span>
      </div>
      <p class="mt-1 text-xs leading-relaxed text-muted-foreground">A focused toolkit for everyday developer tasks.</p>
    </div>
    <div class="flex-1 overflow-auto py-4">
      <nav class="grid gap-3 px-3">
        <div v-for="(items, category) in groupedUtilities" :key="category">
          <button
            class="flex w-full items-center justify-between rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition hover:bg-accent hover:text-foreground"
            @click="toggleCategory(category)"
          >
            <span>{{ category }}</span>
            <ChevronDown v-if="isExpanded(category)" class="h-3.5 w-3.5" />
            <ChevronRight v-else class="h-3.5 w-3.5" />
          </button>
          <div v-show="isExpanded(category)" class="ml-3 space-y-0.5 border-l border-border pl-2">
            <router-link
              v-for="utility in items"
              :key="utility.id"
              :to="titleToPath(utility.title)"
              class="block rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              :class="{ 'bg-accent font-medium text-accent-foreground': isActive(utility.title) }"
            >
              {{ utility.title }}
            </router-link>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>
