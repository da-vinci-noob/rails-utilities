<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'

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
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Input JSON"
    input-placeholder="Paste JSON..."
    :error="error"
  >
    <template #toolbar>
      <Button @click="formatJson">Format</Button>
      <Button @click="minifyJson">Minify</Button>
      <Button @click="validateJson">Validate</Button>
    </template>
  </TextTransformLayout>
</template>
