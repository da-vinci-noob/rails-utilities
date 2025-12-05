<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { FileCode, Minimize2 } from 'lucide-vue-next'
import { css as beautifyCssFn } from 'js-beautify'

const input = ref('.class { width: 100%; .nested { color: red; } }')
const output = ref('')
const error = ref('')

const beautifyLess = () => {
  error.value = ''
  try {
    output.value = beautifyCssFn(input.value, { indent_size: 2 })
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyLess = () => {
  error.value = ''
  try {
    output.value = input.value
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([:;{}])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim()
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Input LESS"
    input-placeholder="Paste LESS here..."
    output-placeholder="Result will appear here..."
    :error="error"
  >
    <template #toolbar>
      <Button @click="beautifyLess">
        <FileCode class="mr-2 h-4 w-4" />
        Beautify
      </Button>
      <Button variant="secondary" @click="minifyLess">
        <Minimize2 class="mr-2 h-4 w-4" />
        Minify
      </Button>
    </template>
  </TextTransformLayout>
</template>
