<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, RefreshCw } from 'lucide-vue-next'
import CryptoJS from 'crypto-js'

const length = ref(32)
const output = ref('')

const generate = () => {
  const bytes = CryptoJS.lib.WordArray.random(length.value)
  output.value = CryptoJS.enc.Hex.stringify(bytes)
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(output.value)
}

generate()
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Secret Generator</CardTitle>
        <CardDescription>Generate cryptographically secure secrets</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex gap-4 items-end">
          <div class="w-32">
            <Label>Length (bytes)</Label>
            <Input type="number" v-model="length" min="16" max="128" />
          </div>
          <Button @click="generate">
            <RefreshCw class="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button variant="outline" @click="copyToClipboard" :disabled="!output">
            <Copy class="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
        <div class="space-y-2">
          <Label>Generated Secret (Hex)</Label>
          <Input readonly :model-value="output" class="font-mono text-xs" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
