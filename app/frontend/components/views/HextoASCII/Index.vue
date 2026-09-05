<script setup lang="ts">
import { ref, watch } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'

const input = ref('48656c6c6f')
const output = ref('')

const convert = () => {
  try {
    output.value =
      input.value
        .match(/.{1,2}/g)
        ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
        .join('') || ''
  } catch (e) {
    output.value = 'Invalid hex'
  }
}

convert()
watch(input, convert)
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 p-4">
    <TextTransformLayout
      v-model:input="input"
      v-model:output="output"
      input-label="Hex Input"
      output-label="ASCII Output"
      input-placeholder="Enter hex..."
    />
    <div class="mt-auto pt-4 border-t">
      <UtilityFeedback utility-title="Hex to ASCII" />
    </div>
  </div>
</template>
