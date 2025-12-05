<script setup lang="ts">
import { ref, watch } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
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

watch(input, convert)
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    :input-label="mode === 'encode' ? 'Plain Text' : 'Base64'"
    :output-label="mode === 'encode' ? 'Base64' : 'Plain Text'"
  >
    <template #toolbar>
      <Button @click="toggleMode">Switch to {{ mode === 'encode' ? 'Decode' : 'Encode' }}</Button>
    </template>
  </TextTransformLayout>
</template>
