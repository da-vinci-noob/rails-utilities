<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const phpInput = ref(
  'a:4:{s:4:"name";s:4:"John";s:3:"age";i:30;s:6:"active";b:1;s:4:"tags";a:2:{i:0;s:1:"a";i:1;s:1:"b";}}'
)

const error = ref('')

const phpUnserialize = (input: string): { value: unknown; rest: string } => {
  const type = input[0]

  if (type === 'N') {
    return { value: null, rest: input.slice(2) }
  }

  if (type === 'b') {
    const value = input[2] === '1'
    return { value, rest: input.slice(4) }
  }

  if (type === 'i') {
    const match = input.match(/^i:(-?\d+);/)
    if (!match) throw new Error('Invalid integer')
    return { value: parseInt(match[1]), rest: input.slice(match[0].length) }
  }

  if (type === 'd') {
    const match = input.match(/^d:(-?[\d.]+);/)
    if (!match) throw new Error('Invalid double')
    return { value: parseFloat(match[1]), rest: input.slice(match[0].length) }
  }

  if (type === 's') {
    const match = input.match(/^s:(\d+):/)
    if (!match) throw new Error('Invalid string')
    const len = parseInt(match[1])
    const start = match[0].length + 1
    const value = input.slice(start, start + len)
    return { value, rest: input.slice(start + len + 2) }
  }

  if (type === 'a') {
    const match = input.match(/^a:(\d+):\{/)
    if (!match) throw new Error('Invalid array')
    const count = parseInt(match[1])
    let rest = input.slice(match[0].length)
    const result: Record<string, unknown> = {}
    let isSequential = true

    for (let i = 0; i < count; i++) {
      const keyResult = phpUnserialize(rest)
      rest = keyResult.rest
      const valueResult = phpUnserialize(rest)
      rest = valueResult.rest

      const key = String(keyResult.value)
      if (key !== String(i)) isSequential = false
      result[key] = valueResult.value
    }

    rest = rest.slice(1) // Remove closing }

    if (isSequential) {
      return { value: Object.values(result), rest }
    }
    return { value: result, rest }
  }

  throw new Error(`Unknown type: ${type}`)
}

const output = computed(() => {
  error.value = ''
  try {
    const { value } = phpUnserialize(phpInput.value.trim())
    return JSON.stringify(value, null, 2)
  } catch (e: any) {
    error.value = e.message || 'Invalid PHP serialized string'
    return '// Invalid input'
  }
})

const copyToClipboard = () => navigator.clipboard.writeText(output.value)
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>PHP Unserializer</CardTitle>
        <CardDescription>Convert PHP serialize() format to JSON</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>PHP Serialized Input</Label>
          <Textarea
            v-model="phpInput"
            placeholder="Paste PHP serialized string..."
            class="font-mono text-sm h-32 resize-none"
          />
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label>JSON Output</Label>
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
