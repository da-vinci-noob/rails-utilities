<script setup lang="ts">
import { ref, watch } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'

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

watch(input, convert)
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 p-4">
    <TextTransformLayout
      v-model:input="input"
      v-model:output="output"
      :input-label="mode === 'encode' ? 'Plain Text' : 'HTML Entities'"
      :output-label="mode === 'encode' ? 'HTML Entities' : 'Plain Text'"
    >
      <template #toolbar>
        <Button @click="toggleMode">Switch to {{ mode === 'encode' ? 'Decode' : 'Encode' }}</Button>
      </template>
    </TextTransformLayout>
    <div class="mt-auto pt-4 border-t">
      <UtilityFeedback utility-title="HTML Entity Encode/Decode" />
    </div>
  </div>
</template>
