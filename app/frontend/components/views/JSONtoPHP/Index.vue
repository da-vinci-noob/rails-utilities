<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const jsonInput = ref(`{
  "name": "John",
  "age": 30,
  "active": true,
  "tags": ["developer", "admin"],
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}`)

const error = ref('')

const jsonToPHP = (value: unknown, indent = 0): string => {
  const spaces = '    '.repeat(indent)
  const innerSpaces = '    '.repeat(indent + 1)

  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((v) => `${innerSpaces}${jsonToPHP(v, indent + 1)}`).join(',\n')
    return `[\n${items}\n${spaces}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '[]'
    const items = entries.map(([k, v]) => `${innerSpaces}'${k}' => ${jsonToPHP(v, indent + 1)}`).join(',\n')
    return `[\n${items}\n${spaces}]`
  }

  return 'null'
}

const output = computed(() => {
  error.value = ''
  try {
    const parsed = JSON.parse(jsonInput.value)
    return `<?php\n\n$data = ${jsonToPHP(parsed)};\n`
  } catch (e: any) {
    error.value = e.message
    return '// Invalid JSON'
  }
})

const copyToClipboard = () => navigator.clipboard.writeText(output.value)
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>JSON to PHP</CardTitle>
        <CardDescription>Convert JSON to PHP array syntax</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>JSON Input</Label>
          <Textarea v-model="jsonInput" placeholder="Paste JSON here..." class="font-mono text-sm h-40 resize-none" />
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label>PHP Output</Label>
            <Button variant="ghost" size="sm" @click="copyToClipboard"> <Copy class="h-4 w-4 mr-2" /> Copy </Button>
          </div>
          <Textarea :model-value="output" readonly class="font-mono text-sm h-48 resize-none bg-muted" />
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {{ error }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
