<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const asciiInput = ref('Hello')
const hexOutput = ref('')

const convert = () => {
  hexOutput.value = asciiInput.value
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

convert()

// Watch for input changes to ensure conversion happens after v-model updates
watch(asciiInput, convert)
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>ASCII Input</Label>
        <Textarea v-model="asciiInput" placeholder="Enter text..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Hex Output</Label>
        <Textarea v-model="hexOutput" readonly placeholder="Result..." class="flex-1 font-mono resize-none bg-muted" />
      </div>
    </div>
  </div>
</template>
