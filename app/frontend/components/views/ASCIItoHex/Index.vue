<script setup lang="ts">
import { ref, watch } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'

const input = ref('Hello')
const output = ref('')

const convert = () => {
  output.value = input.value
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

convert()
watch(input, convert)
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 p-4">
    <TextTransformLayout
      v-model:input="input"
      v-model:output="output"
      input-label="ASCII Input"
      output-label="Hex Output"
    />
    <div class="mt-auto pt-4 border-t">
      <UtilityFeedback utility-title="ASCII to Hex" />
    </div>
  </div>
</template>
