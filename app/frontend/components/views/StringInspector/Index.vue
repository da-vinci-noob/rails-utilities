<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const input = ref('Hello World')

const stats = computed(() => ({
  length: input.value.length,
  words: input.value.split(/\s+/).filter((w) => w).length,
  lines: input.value.split('\n').length,
  chars: input.value.length,
  charsNoSpaces: input.value.replace(/\s/g, '').length
}))
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>String Inspector</CardTitle>
        <CardDescription>Analyze string properties</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Input Text</Label>
          <Textarea v-model="input" placeholder="Enter text..." class="h-48" />
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="p-4 bg-muted rounded-md">
            <div class="text-2xl font-bold">{{ stats.length }}</div>
            <div class="text-sm text-muted-foreground">Characters</div>
          </div>
          <div class="p-4 bg-muted rounded-md">
            <div class="text-2xl font-bold">{{ stats.words }}</div>
            <div class="text-sm text-muted-foreground">Words</div>
          </div>
          <div class="p-4 bg-muted rounded-md">
            <div class="text-2xl font-bold">{{ stats.lines }}</div>
            <div class="text-sm text-muted-foreground">Lines</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
