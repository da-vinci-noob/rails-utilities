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
      <div class="flex items-center gap-2 justify-self-end">
        <a
          href="https://github.com/da-vinci-noob/rails-utilities"
          target="_blank"
          rel="noopener noreferrer"
          title="Star rails-utilities on GitHub"
          aria-label="Star rails-utilities on GitHub" class="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
          <span class="hidden sm:inline">Star</span>
        </a>
        <DarkMode />
      </div>
  </header>
</template>
