<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const phpInput = ref(`$data = [
    'name' => 'John',
    'age' => 30,
    'active' => true,
    'tags' => ['developer', 'admin'],
    'address' => [
        'city' => 'New York',
        'zip' => '10001'
    ]
];`)

const error = ref('')

const parsePHPArray = (input: string): unknown => {
  // Clean up PHP syntax to make it more JSON-like
  let cleaned = input
    .replace(/\$\w+\s*=\s*/g, '') // Remove variable assignment
    .replace(/;[\s]*$/g, '') // Remove trailing semicolon
    .replace(/array\s*\(/gi, '[') // Convert array() to [
    .replace(/\)/g, ']') // Close array
    .replace(/=>/g, ':') // Convert => to :
    .replace(/'([^']+)'\s*:/g, '"$1":') // Convert single-quoted keys to double
    .replace(/:\s*'([^']*)'/g, ': "$1"') // Convert single-quoted values to double
    .replace(/:\s*true/gi, ': true')
    .replace(/:\s*false/gi, ': false')
    .replace(/:\s*null/gi, ': null')
    .replace(/,(\s*[\]\}])/g, '$1') // Remove trailing commas
    .trim()

  // Handle PHP's [] array syntax
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    return JSON.parse(cleaned)
  }

  throw new Error('Could not parse PHP array')
}

const output = computed(() => {
  error.value = ''
  try {
    const parsed = parsePHPArray(phpInput.value)
    return JSON.stringify(parsed, null, 2)
  } catch (e: any) {
    error.value = 'Could not parse PHP array. Make sure it uses standard array syntax.'
    return '// Invalid PHP array'
  }
})

const copyToClipboard = () => navigator.clipboard.writeText(output.value)
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>PHP to JSON</CardTitle>
        <CardDescription>Convert PHP array syntax to JSON</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>PHP Array Input</Label>
          <Textarea
            v-model="phpInput"
            placeholder="Paste PHP array here..."
            class="font-mono text-sm h-40 resize-none"
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
