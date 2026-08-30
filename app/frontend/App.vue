<script setup lang="ts">
import Header from '@/components/addons/Header.vue'
import Sidebar from '@/components/addons/Sidebar.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-muted/20">
    <Sidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden bg-background/60">
      <Header />
      <main class="flex-1 overflow-auto">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </main>
    </div>
  </div>
</template>
