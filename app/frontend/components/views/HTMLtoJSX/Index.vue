<script setup lang="ts">
import { ref, watch } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'

const input = ref('<div class="container"><label for="input">Text</label></div>')
const output = ref('')

const convert = () => {
  output.value = input.value
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<(\w+)([^>]*)\/>/g, '<$1$2 />')
    .replace(/<!--(.*?)-->/g, '{/* $1 */}')
}

convert()
watch(input, convert)
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 p-4">
    <TextTransformLayout
      v-model:input="input"
      v-model:output="output"
      input-label="HTML"
      output-label="JSX"
      input-placeholder="Enter HTML..."
    />
    <div class="mt-auto pt-4 border-t">
      <UtilityFeedback utility-title="HTML to JSX" />
    </div>
  </div>
</template>
