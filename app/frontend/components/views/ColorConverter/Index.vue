<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const hex = ref('#FF5733')

const rgb = computed(() => {
  const r = parseInt(hex.value.slice(1, 3), 16)
  const g = parseInt(hex.value.slice(3, 5), 16)
  const b = parseInt(hex.value.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
})

const hsl = computed(() => {
  const r = parseInt(hex.value.slice(1, 3), 16) / 255
  const g = parseInt(hex.value.slice(3, 5), 16) / 255
  const b = parseInt(hex.value.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Color Converter</CardTitle>
        <CardDescription>Convert between color formats</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Hex Color</Label>
          <Input type="color" v-model="hex" class="h-12" />
          <Input v-model="hex" class="font-mono" />
        </div>
        <div class="space-y-2">
          <Label>RGB</Label>
          <Input readonly :model-value="rgb" class="font-mono" />
        </div>
        <div class="space-y-2">
          <Label>HSL</Label>
          <Input readonly :model-value="hsl" class="font-mono" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
