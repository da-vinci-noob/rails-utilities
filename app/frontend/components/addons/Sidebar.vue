<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { utilities } from '@/data/utilities'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-vue-next'

const route = useRoute()
const searchQuery = ref('')

const filteredUtilities = computed(() => {
  if (!searchQuery.value) return utilities
  const query = searchQuery.value.toLowerCase()
  return utilities.filter((utility) => utility.title.toLowerCase().includes(query))
})

const isActive = (pathName: string) => {
  // Convert title to the route name format (remove spaces)
  // Actually router names are just the title in utilities.ts
  // But the path is lowercase with underscores.
  // Let's check how routes are defined in router/index.js
  // name: utility.title
  return route.name === pathName
}

const titleToPath = (title: string) =>
  `/${title
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()}`
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
        <router-link
          v-for="utility in filteredUtilities"
          :key="utility.id"
          :to="titleToPath(utility.title)"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          :class="{ 'bg-accent text-accent-foreground': isActive(utility.title) }"
        >
          <!-- We can use the icon URL if we want, but for now let's just use text or a generic icon if the URL is external/complex -->
          <!-- The icon in data is a URL string. We can try to render it as an img or just ignore for now -->
          <!-- <img :src="utility.icon" class="h-4 w-4" /> -->
          {{ utility.title }}
        </router-link>
        <div v-if="filteredUtilities.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
          No utilities found.
        </div>
      </nav>
    </div>
  </aside>
</template>
