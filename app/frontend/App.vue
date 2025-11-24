<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/addons/Header.vue'
import Sidebar from '@/components/addons/Sidebar.vue'

const route = useRoute()
const searchQuery = ref('')

const updateSearchQuery = (query: string) => {
  searchQuery.value = query
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex flex-col flex-1 overflow-hidden">
      <Header @updateSearchQuery="updateSearchQuery" />
      <main class="flex-1 overflow-auto">
        <router-view v-slot="{ Component }">
          <component :is="Component" :searchQuery="route.name === 'Home' ? searchQuery : undefined" />
        </router-view>
      </main>
    </div>
  </div>
</template>
