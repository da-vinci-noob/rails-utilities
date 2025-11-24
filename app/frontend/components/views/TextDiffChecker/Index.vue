<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { diffLines } from 'diff'

const text1 = ref('')
const text2 = ref('')

const diff = computed(() => {
  return diffLines(text1.value, text2.value)
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader><CardTitle>Text Diff Checker</CardTitle></CardHeader>
      <CardContent class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Text 1</Label>
            <Textarea v-model="text1" placeholder="Enter first text..." class="h-48 font-mono" />
          </div>
          <div class="space-y-2">
            <Label>Text 2</Label>
            <Textarea v-model="text2" placeholder="Enter second text..." class="h-48 font-mono" />
          </div>
        </div>
        <div class="space-y-2">
          <Label>Diff</Label>
          <div class="p-4 bg-muted rounded-md font-mono text-sm space-y-1">
            <div v-for="(part, i) in diff" :key="i" 
                 :class="{ 'bg-red-200 dark:bg-red-900': part.removed, 'bg-green-200 dark:bg-green-900': part.added }">
              {{ part.value }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
