<script setup lang="ts">
// Imports
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DarkMode from '@/components/addons/DarkMode.vue'
import SearchBar from '@/components/addons/SearchBar.vue'

// Variables
const route = useRoute()

// Emits
const emit = defineEmits(['updateSearchQuery'])
const handleSearchQueryUpdate = (value: string) => {
  emit('updateSearchQuery', value)
}

// Lifecycle Hooks
const currentRoute = computed(() => ({ name: route.name, path: route.path, description: route.meta?.description }))

// Theme Import
// prettier-ignore
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/addons/ThemeImport.vue'
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
  >
    <Breadcrumb class="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <router-link to="/">Dashboard</router-link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem v-if="currentRoute.path != '/'">
          <BreadcrumbSeparator />
          <BreadcrumbLink as-child>
            <router-link :to="currentRoute.path">{{ currentRoute.name }}</router-link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="relative ml-auto flex-1 md:grow-0">
      <SearchBar @updateSearchQuery="handleSearchQueryUpdate" v-if="currentRoute.name == 'Home'" />
    </div>
    <DarkMode />
  </header>
</template>
