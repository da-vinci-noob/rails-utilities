<script setup lang="ts">
import { ref, watch } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'
import CryptoJS from 'crypto-js'

const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')
const output = ref('')

const toggleMode = () => {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  input.value = output.value
  output.value = ''
}

const convert = () => {
  try {
    if (mode.value === 'encode') {
      output.value = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input.value))
    } else {
      output.value = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(input.value))
    }
  } catch (e) {
    output.value = 'Error: Invalid input'
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
      <Button @click="toggleMode"> Switch to {{ mode === 'encode' ? 'Decode' : 'Encode' }} </Button>
    </div>
    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>{{ mode === 'encode' ? 'Plain Text' : 'Base64' }}</Label>
        <Textarea v-model="input" placeholder="Enter text..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
          <Label>{{ mode === 'encode' ? 'Base64' : 'Plain Text' }}</Label>
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
