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
  "tags": ["a", "b"]
}`)

const error = ref('')

const phpSerialize = (value: unknown): string => {
  if (value === null) return 'N;'
  if (typeof value === 'boolean') return `b:${value ? 1 : 0};`
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return `i:${value};`
    return `d:${value};`
  }
  if (typeof value === 'string') return `s:${value.length}:"${value}";`

  if (Array.isArray(value)) {
    const items = value.map((v, i) => `${phpSerialize(i)}${phpSerialize(v)}`).join('')
    return `a:${value.length}:{${items}}`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    const items = entries.map(([k, v]) => `${phpSerialize(k)}${phpSerialize(v)}`).join('')
    return `a:${entries.length}:{${items}}`
  }

  return 'N;'
}

const output = computed(() => {
  error.value = ''
  try {
    const parsed = JSON.parse(jsonInput.value)
    return phpSerialize(parsed)
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
        <CardTitle>PHP Serializer</CardTitle>
        <CardDescription>Convert JSON to PHP serialize() format</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>JSON Input</Label>
          <Textarea v-model="jsonInput" placeholder="Paste JSON here..." class="font-mono text-sm h-40 resize-none" />
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label>PHP Serialized Output</Label>
            <Button variant="ghost" size="sm" @click="copyToClipboard"> <Copy class="h-4 w-4 mr-2" /> Copy </Button>
          </div>
          <Textarea :model-value="output" readonly class="font-mono text-sm h-32 resize-none bg-muted" />
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {{ error }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
