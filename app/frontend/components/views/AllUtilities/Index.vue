<script setup lang="ts">
import { ref, computed } from 'vue'
import { utilities } from '@/data/utilities'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-vue-next'

const searchQuery = ref('')

const titleToPath = (title: string) =>
  `/${title
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()}`

const filteredUtilities = computed(() => {
  const list = utilities.filter((u) => u.title !== 'All Utilities')
  if (!searchQuery.value) return list
  const query = searchQuery.value.toLowerCase()
  return list.filter((u) => u.title.toLowerCase().includes(query) || u.description.toLowerCase().includes(query))
})

// Generate a consistent color based on utility title
const getGradient = (title: string) => {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-yellow-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-green-600',
    'from-fuchsia-500 to-pink-600'
  ]
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>All Utilities Gallery</CardTitle>
        <CardDescription>Browse and navigate to all {{ filteredUtilities.length }} utilities</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="relative">
          <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input v-model="searchQuery" placeholder="Search utilities..." class="pl-10" />
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <router-link
            v-for="utility in filteredUtilities"
            :key="utility.id"
            :to="titleToPath(utility.title)"
            class="group"
          >
            <div class="rounded-lg overflow-hidden border border-border hover:border-primary transition-colors">
              <!-- Preview area with gradient -->
              <div :class="['h-24 bg-gradient-to-br flex items-center justify-center', getGradient(utility.title)]">
                <span class="text-white text-2xl font-bold opacity-80">
                  {{ utility.title.charAt(0) }}
                </span>
              </div>
              <!-- Title and description -->
              <div class="p-3 bg-card">
                <h3 class="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  {{ utility.title }}
                </h3>
                <p class="text-xs text-muted-foreground truncate mt-1">
                  {{ utility.description }}
                </p>
              </div>
            </div>
          </router-link>
        </div>

        <div v-if="filteredUtilities.length === 0" class="text-center py-8 text-muted-foreground">
          No utilities found matching "{{ searchQuery }}"
        </div>
      </CardContent>
    </Card>
  </div>
</template>
