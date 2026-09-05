<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  utilityTitle: string
}>()

const bugReportUrl = computed(() => {
  const title = encodeURIComponent(`[BUG] Issue with ${props.utilityTitle}`)
  const labels = 'bug'
  return `https://github.com/da-vinci-noob/rails-utilities/issues/new?title=${title}&labels=${labels}&template=bug_report.md`
})

const featureRequestUrl = computed(() => {
  const title = encodeURIComponent(`[FEATURE] Enhancement for ${props.utilityTitle}`)
  const labels = 'enhancement'
  return `https://github.com/da-vinci-noob/rails-utilities/issues/new?title=${title}&labels=${labels}&template=feature_request.md`
})
</script>

<template>
  <div class="flex items-center gap-3 text-sm text-muted-foreground">
    <a
      :href="bugReportUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1 hover:text-foreground transition-colors"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Report Bug</span>
    </a>
    <span class="text-border">•</span>
    <a
      :href="featureRequestUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1 hover:text-foreground transition-colors"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>Request Feature</span>
    </a>
  </div>
</template>
