<script setup lang="ts">
import { ref, watch } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'

const mode = ref<'escape' | 'unescape'>('escape')
const input = ref('')
const output = ref('')

const toggleMode = () => {
  mode.value = mode.value === 'escape' ? 'unescape' : 'escape'
  input.value = output.value
  output.value = ''
}

const convert = () => {
  try {
    if (mode.value === 'escape') {
      output.value = JSON.stringify(input.value).slice(1, -1)
    } else {
      output.value = JSON.parse(`"${input.value}"`)
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
    :input-label="mode === 'escape' ? 'Plain Text' : 'Escaped Text'"
    :output-label="mode === 'escape' ? 'Escaped Text' : 'Plain Text'"
  >
    <template #toolbar>
      <Button @click="toggleMode">Switch to {{ mode === 'escape' ? 'Unescape' : 'Escape' }}</Button>
    </template>
  </TextTransformLayout>
</template>
