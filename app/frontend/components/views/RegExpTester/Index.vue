<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const pattern = ref('\\d+')
const flags = ref('g')
const testString = ref('abc 123 def 456')

const matches = computed(() => {
  try {
    const regex = new RegExp(pattern.value, flags.value)
    return Array.from(testString.value.matchAll(regex))
  } catch (e) {
    return []
  }
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader><CardTitle>RegExp Tester</CardTitle></CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Pattern</Label>
            <Input v-model="pattern" placeholder="\\d+" class="font-mono" />
          </div>
          <div class="space-y-2">
            <Label>Flags</Label>
            <Input v-model="flags" placeholder="g" class="font-mono" />
          </div>
        </div>
        <div class="space-y-2">
          <Label>Test String</Label>
          <Textarea v-model="testString" placeholder="Test text..." class="h-32" />
        </div>
        <div v-if="matches.length" class="space-y-2">
          <Label>Matches ({{ matches.length }})</Label>
          <div class="p-4 bg-muted rounded-md space-y-2">
            <div v-for="(match, i) in matches" :key="i" class="font-mono">
              {{ i }}: {{ match[0] }} (index: {{ match.index }})
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
