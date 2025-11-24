<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { utilities, categories } from '@/data/utilities'
import { Input } from '@/components/ui/input'
import { Search, ChevronDown, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const searchQuery = ref('')
const expandedCategories = ref<Set<string>>(new Set(categories.filter((c) => c !== 'All')))

const filteredUtilities = computed(() => {
  if (!searchQuery.value) return utilities
  const query = searchQuery.value.toLowerCase()
  return utilities.filter(
    (utility) => utility.title.toLowerCase().includes(query) || utility.description.toLowerCase().includes(query)
  )
})

const groupedUtilities = computed(() => {
  const groups: Record<string, typeof utilities> = {}
  for (const cat of categories) {
    if (cat === 'All') continue
    groups[cat] = filteredUtilities.value.filter((u) => u.category === cat)
  }
  return groups
})

const isActive = (pathName: string) => route.name === pathName

const titleToPath = (title: string) =>
  `/${title
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()}`

const toggleCategory = (cat: string) => {
  if (expandedCategories.value.has(cat)) {
    expandedCategories.value.delete(cat)
  } else {
    expandedCategories.value.add(cat)
  }
  expandedCategories.value = new Set(expandedCategories.value)
}

const isExpanded = (cat: string) => expandedCategories.value.has(cat)
</script>

<template>
  <aside class="hidden w-64 flex-col border-r bg-background text-foreground md:flex">
    <div class="p-4">
      <div class="flex items-center gap-2 font-semibold">
        <span class="text-lg">DevUtils Clone</span>
      </div>
      <div class="mt-4 relative">
        <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input v-model="searchQuery" placeholder="Search utilities..." class="pl-8 bg-background text-foreground" />
      </div>
    </div>
    <div class="flex-1 overflow-auto py-2">
      <nav class="grid gap-1 px-2">
        <template v-for="(items, category) in groupedUtilities" :key="category">
          <div v-if="items.length > 0">
            <button
              @click="toggleCategory(category)"
              class="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <span>{{ category }}</span>
              <ChevronDown v-if="isExpanded(category)" class="h-3 w-3" />
              <ChevronRight v-else class="h-3 w-3" />
            </button>
            <div v-show="isExpanded(category)" class="space-y-0.5 ml-2 border-l border-border pl-2">
              <router-link
                v-for="utility in items"
                :key="utility.id"
                :to="titleToPath(utility.title)"
                class="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-accent hover:text-accent-foreground"
                :class="{ 'bg-accent text-accent-foreground': isActive(utility.title) }"
              >
                {{ utility.title }}
              </router-link>
            </div>
          </div>
        </template>
        <div v-if="filteredUtilities.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
          No utilities found.
        </div>
      </nav>
    </div>
  </aside>
</template>
