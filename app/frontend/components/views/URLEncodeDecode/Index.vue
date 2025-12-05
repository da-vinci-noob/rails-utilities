<script setup lang="ts">
import { ref, watch } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'

const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')
const output = ref('')

const toggleMode = () => {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  input.value = output.value
  output.value = ''
}

const convert = () => {
  if (mode.value === 'encode') {
    output.value = encodeURIComponent(input.value)
  } else {
    try {
      output.value = decodeURIComponent(input.value)
    } catch (e) {
      output.value = 'Error: Invalid encoded string'
    }
  }
}

watch(input, convert)
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    :input-label="mode === 'encode' ? 'Plain URL' : 'Encoded URL'"
    :output-label="mode === 'encode' ? 'Encoded URL' : 'Plain URL'"
    input-placeholder="Enter URL..."
  >
    <template #toolbar>
      <Button @click="toggleMode">Switch to {{ mode === 'encode' ? 'Decode' : 'Encode' }}</Button>
    </template>
  </TextTransformLayout>
</template>
