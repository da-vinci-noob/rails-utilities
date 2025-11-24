<script setup lang="ts">
import { ref, watch } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')
const output = ref('')

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

const toggleMode = () => {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  input.value = output.value
  output.value = ''
}

const convert = () => {
  if (mode.value === 'encode') {
    output.value = input.value.replace(/[&<>"']/g, (match) => htmlEntities[match])
  } else {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = input.value
    output.value = textarea.value
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(output.value)
}

// Watch for input changes to ensure conversion happens after v-model updates
watch(input, convert)
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-2 mb-4">
      <Button @click="toggleMode">Switch to {{ mode === 'encode' ? 'Decode' : 'Encode' }}</Button>
    </div>
    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>{{ mode === 'encode' ? 'Plain Text' : 'HTML Entities' }}</Label>
        <Textarea v-model="input" placeholder="Enter text..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
          <Label>{{ mode === 'encode' ? 'HTML Entities' : 'Plain Text' }}</Label>
          <Button variant="ghost" size="sm" @click="copyToClipboard" :disabled="!output">
            <Copy class="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <Textarea v-model="output" readonly placeholder="Result..." class="flex-1 font-mono resize-none bg-muted" />
      </div>
    </div>
  </div>
</template>
