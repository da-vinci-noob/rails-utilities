<script setup lang="ts">
import { ref, onMounted } from 'vue'

// State for install prompt
const installPrompt = ref<any>(null)
const showInstallBanner = ref(false)

// Listen for beforeinstallprompt event
onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    installPrompt.value = e
    // Show banner after a short delay to avoid being intrusive
    setTimeout(() => {
      showInstallBanner.value = true
    }, 3000)
  })
})

// Handle install button click
const handleInstall = async () => {
  if (installPrompt.value) {
    installPrompt.value.prompt()
    const { outcome } = await installPrompt.value.userChoice
    if (outcome === 'accepted') {
      showInstallBanner.value = false
    }
    installPrompt.value = null
  }
}

// Dismiss banner
const dismiss = () => {
  showInstallBanner.value = false
  // Store dismissal in localStorage
  localStorage.setItem('pwa-install-dismissed', 'true')
}
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="showInstallBanner && !localStorage.getItem('pwa-install-dismissed')"
      class="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-4 rounded-lg border bg-background p-4 shadow-lg md:left-auto md:right-4 md:max-w-md"
    >
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div>
          <p class="font-medium">Install Rails Utilities</p>
          <p class="text-sm text-muted-foreground">Add to home screen for quick access</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="dismiss"
          class="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Dismiss
        </button>
        <button
          @click="handleInstall"
          class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Install
        </button>
      </div>
    </div>
  </transition>
</template>
