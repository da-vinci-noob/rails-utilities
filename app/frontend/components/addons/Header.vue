<script setup lang="ts">
// Imports
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DarkMode from '@/components/addons/DarkMode.vue'
import SearchBar from '@/components/addons/CommandPalette.vue'
import MobileNav from '@/components/addons/MobileNav.vue'

// Variables
const route = useRoute()

// Emits

// Lifecycle Hooks
const currentRoute = computed(() => ({ name: route.name, path: route.path, description: route.meta?.description }))

// Theme Import
// prettier-ignore
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/addons/ThemeImport.vue'
</script>

<template>
    <header class="sticky top-0 z-30 grid h-16 grid-cols-[1fr_auto_1fr] items-center border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
      <div class="flex items-center gap-3">
        <MobileNav />
        <Breadcrumb class="hidden min-w-0 md:flex">
        <BreadcrumbList class="truncate">
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
      </div>
      <div class="justify-self-center">
        <SearchBar />
      </div>
      <div class="justify-self-end">
        <DarkMode />
      </div>
  </header>
</template>
