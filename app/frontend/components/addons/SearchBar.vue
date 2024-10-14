<script setup lang="ts">
// Imports
import { defineEmits } from 'vue'
import { Search, Input } from '@/components/addons/ThemeImport.vue'

// Emits
const emit = defineEmits(['updateSearchQuery'])
const updateSearchQuery = (event: Event) => emit('updateSearchQuery', (event.target as HTMLInputElement).value)
</script>
<template>
  <div class="relative ml-auto flex-1 md:grow-0">
    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-300" />
    <Input
      type="search"
      placeholder="Search..."
      class="w-full rounded-lg bg-background pl-8 dark:text-gray-300 transition-all md:w-[200px] lg:w-[320px]"
      @input="updateSearchQuery"
    />
  </div>
</template>
