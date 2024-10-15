<script setup lang="ts">
// Imports
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/addons/Header.vue'

// Variables
const route = useRoute()
const searchQuery = ref('')

// Computed property to determine if the current route is 'Home'
const isHomeRoute = computed(() => route.name === 'Home')
</script>

<template>
  <div class="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-gray-950">
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:px-14">
      <Header @updateSearchQuery="(value) => (searchQuery = value)" />
      <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <router-view v-slot="{ Component }">
          <component :is="Component" v-bind="isHomeRoute ? { searchQuery } : {}" />
        </router-view>
      </main>
    </div>
  </div>
</template>
