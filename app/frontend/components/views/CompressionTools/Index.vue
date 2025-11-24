<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, Minimize2, Maximize2 } from 'lucide-vue-next'

const mode = ref<'compress' | 'decompress'>('compress')
const input = ref('Hello, World! This is a test string for compression.')
const output = ref('')
const error = ref('')
const stats = ref({ original: 0, result: 0, ratio: 0 })

// Simple LZString-like compression using browser's CompressionStream API
const compress = async () => {
  error.value = ''
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(input.value)

    // Use CompressionStream API (gzip)
    const cs = new CompressionStream('gzip')
    const writer = cs.writable.getWriter()
    writer.write(data)
    writer.close()

    const compressedChunks: Uint8Array[] = []
    const reader = cs.readable.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      compressedChunks.push(value)
    }

    const compressed = new Uint8Array(compressedChunks.reduce((acc, chunk) => acc + chunk.length, 0))
    let offset = 0
    for (const chunk of compressedChunks) {
      compressed.set(chunk, offset)
      offset += chunk.length
    }

    // Convert to base64 for display
    output.value = btoa(String.fromCharCode(...compressed))
    stats.value = {
      original: input.value.length,
      result: output.value.length,
      ratio: Math.round((1 - compressed.length / data.length) * 100)
    }
  } catch (e: any) {
    error.value = e.message || 'Compression failed'
  }
}

const decompress = async () => {
  error.value = ''
  try {
    // Decode base64
    const binary = atob(input.value)
    const data = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      data[i] = binary.charCodeAt(i)
    }

    // Use DecompressionStream API
    const ds = new DecompressionStream('gzip')
    const writer = ds.writable.getWriter()
    writer.write(data)
    writer.close()

    const decompressedChunks: Uint8Array[] = []
    const reader = ds.readable.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      decompressedChunks.push(value)
    }

    const decompressed = new Uint8Array(decompressedChunks.reduce((acc, chunk) => acc + chunk.length, 0))
    let offset = 0
    for (const chunk of decompressedChunks) {
      decompressed.set(chunk, offset)
      offset += chunk.length
    }

    output.value = new TextDecoder().decode(decompressed)
    stats.value = {
      original: input.value.length,
      result: output.value.length,
      ratio: 0
    }
  } catch (e: any) {
    error.value = 'Decompression failed. Make sure input is valid gzip-compressed base64.'
  }
}

const process = () => {
  if (mode.value === 'compress') compress()
  else decompress()
}

const copyToClipboard = () => navigator.clipboard.writeText(output.value)

const toggleMode = () => {
  mode.value = mode.value === 'compress' ? 'decompress' : 'compress'
  output.value = ''
  error.value = ''
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Compression Tools</CardTitle>
        <CardDescription>Compress and decompress text using gzip</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex gap-2">
          <Button @click="toggleMode"> Switch to {{ mode === 'compress' ? 'Decompress' : 'Compress' }} </Button>
        </div>

        <div class="space-y-2">
          <Label>{{ mode === 'compress' ? 'Text Input' : 'Compressed Input (Base64)' }}</Label>
          <Textarea v-model="input" placeholder="Enter text..." class="font-mono text-sm h-32 resize-none" />
        </div>

        <Button @click="process">
          <component :is="mode === 'compress' ? Minimize2 : Maximize2" class="h-4 w-4 mr-2" />
          {{ mode === 'compress' ? 'Compress' : 'Decompress' }}
        </Button>

        <div v-if="output" class="space-y-4">
          <div v-if="mode === 'compress' && stats.ratio > 0" class="text-sm text-muted-foreground">
            Original: {{ stats.original }} bytes → Compressed: {{ stats.result }} bytes ({{ stats.ratio }}% reduction)
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <Label>{{ mode === 'compress' ? 'Compressed Output (Base64)' : 'Decompressed Output' }}</Label>
              <Button variant="ghost" size="sm" @click="copyToClipboard"> <Copy class="h-4 w-4 mr-2" /> Copy </Button>
            </div>
            <Textarea :model-value="output" readonly class="font-mono text-sm h-32 resize-none bg-muted" />
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {{ error }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
