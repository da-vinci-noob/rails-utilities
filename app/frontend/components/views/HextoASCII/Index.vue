<script setup lang="ts">
import { ref, watch } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'

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
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Hex Input"
    output-label="ASCII Output"
    input-placeholder="Enter hex..."
  />
</template>
