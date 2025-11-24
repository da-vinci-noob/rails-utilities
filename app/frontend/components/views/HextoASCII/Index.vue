<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const hexInput = ref('48656c6c6f')
const asciiOutput = ref('')

const convert = () => {
  try {
    asciiOutput.value =
      hexInput.value
        .match(/.{1,2}/g)
        ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
        .join('') || ''
  } catch (e) {
    asciiOutput.value = 'Invalid hex'
  }
}

convert()

// Watch for input changes to ensure conversion happens after v-model updates
watch(hexInput, convert)
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Hex Input</Label>
        <Textarea v-model="hexInput" placeholder="Enter hex..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <Label>ASCII Output</Label>
        <Textarea
          v-model="asciiOutput"
          readonly
          placeholder="Result..."
          class="flex-1 font-mono resize-none bg-muted"
        />
      </div>
    </div>
  </div>
</template>
