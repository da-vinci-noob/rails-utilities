<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const input = ref('')
const output = ref('')
const error = ref('')

const formatJson = () => {
  error.value = ''
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, 2)
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyJson = () => {
  error.value = ''
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
  } catch (e: any) {
    error.value = e.message
  }
}

const validateJson = () => {
  error.value = ''
  try {
    JSON.parse(input.value)
    output.value = '✅ Valid JSON'
  } catch (e: any) {
    output.value = `❌ Invalid JSON: ${e.message}`
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-2 mb-4">
      <Button @click="formatJson">Format</Button>
      <Button @click="minifyJson">Minify</Button>
      <Button @click="validateJson">Validate</Button>
    </div>
    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Input JSON</Label>
        <Textarea v-model="input" placeholder="Paste JSON..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
          <Label>Output</Label>
          <Button variant="ghost" size="sm" @click="copyToClipboard" :disabled="!output">
            <Copy class="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <Textarea v-model="output" readonly placeholder="Result..." class="flex-1 font-mono resize-none bg-muted" />
      </div>
    </div>
    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
      {{ error }}
    </div>
  </div>
</template>
