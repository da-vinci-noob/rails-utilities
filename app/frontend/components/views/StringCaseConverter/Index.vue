<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const input = ref('hello world')
const outputs = ref({
  camelCase: '',
  snakeCase: '',
  kebabCase: '',
  pascalCase: '',
  constantCase: '',
  lowercase: '',
  uppercase: ''
})

const convert = () => {
  const str = input.value
  outputs.value = {
    camelCase: str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
      .replace(/\s+/g, ''),
    snakeCase: str.toLowerCase().replace(/\s+/g, '_'),
    kebabCase: str.toLowerCase().replace(/\s+/g, '-'),
    pascalCase: str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w) => w.toUpperCase()).replace(/\s+/g, ''),
    constantCase: str.toUpperCase().replace(/\s+/g, '_'),
    lowercase: str.toLowerCase(),
    uppercase: str.toUpperCase()
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

convert()

// Watch for input changes to ensure conversion happens after v-model updates
watch(input, convert)
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>String Case Converter</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Input</Label>
          <Textarea v-model="input" placeholder="Enter text..." class="h-20" />
        </div>
        <div class="space-y-3">
          <div v-for="(value, key) in outputs" :key="key" class="flex gap-2 items-center">
            <Label class="w-32 capitalize">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</Label>
            <Textarea readonly :model-value="value" class="flex-1 font-mono h-10 resize-none" />
            <Button variant="outline" size="icon" @click="copyToClipboard(value)">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
