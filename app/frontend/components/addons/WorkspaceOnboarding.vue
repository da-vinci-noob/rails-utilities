<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { utilities, categories } from '@/data/utilities'
import { getPinned, togglePinned } from '@/lib/pins'
import { completeOnboarding, hasCompletedOnboarding } from '@/lib/preferences'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-vue-next'

const open = ref(false)
const selected = ref<string[]>(['Converters', 'Formatters'])
const focusCategories = computed(() => categories.filter((category) => category !== 'All'))

function toggleCategory(category: string) {
  selected.value = selected.value.includes(category)
    ? selected.value.filter((value) => value !== category)
    : [...selected.value, category]
}

function finish() {
  const pinned = getPinned()
  for (const category of selected.value) {
    const suggestions = utilities.filter((utility) => utility.category === category).slice(0, 2)
    for (const utility of suggestions) {
      if (!pinned.includes(utility.title)) togglePinned(utility.title)
    }
  }
  completeOnboarding(selected.value)
  open.value = false
}

function skip() {
  completeOnboarding([])
  open.value = false
}

onMounted(() => {
  open.value = !hasCompletedOnboarding()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <section class="w-full max-w-lg rounded-2xl border bg-card p-6 text-card-foreground shadow-2xl sm:p-8">
        <div class="mb-6 flex items-start gap-3">
          <div class="rounded-xl bg-primary/10 p-2.5 text-primary"><Sparkles class="h-5 w-5" /></div>
          <div><p class="text-xs font-semibold uppercase tracking-wider text-primary">Welcome to Rails Utilities</p><h2 class="mt-1 text-2xl font-semibold tracking-tight">Shape your toolkit</h2><p class="mt-2 text-sm leading-5 text-muted-foreground">Choose what you work with most. We’ll pin a few useful tools to your dashboard. You can change this later.</p></div>
        </div>
        <div class="grid gap-2 sm:grid-cols-2">
          <button v-for="category in focusCategories" :key="category" class="flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition hover:border-primary" :class="selected.includes(category) ? 'border-primary bg-primary/5' : 'text-muted-foreground'" @click="toggleCategory(category)">
            <span>{{ category }}</span><Check v-if="selected.includes(category)" class="h-4 w-4 text-primary" />
          </button>
        </div>
        <div class="mt-7 flex items-center justify-between">
          <button class="text-sm text-muted-foreground hover:text-foreground" @click="skip">Skip for now</button>
          <Button :disabled="!selected.length" @click="finish">Personalize dashboard</Button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
