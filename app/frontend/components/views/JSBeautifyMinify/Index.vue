<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { FileCode, Minimize2 } from 'lucide-vue-next'
import { js as beautifyJsFn } from 'js-beautify'

const input = ref('function foo() { console.log("bar"); }')
const output = ref('')
const error = ref('')

const beautifyJs = () => {
  error.value = ''
  try {
    output.value = beautifyJsFn(input.value, { indent_size: 2 })
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyJs = () => {
  error.value = ''
  try {
    output.value = input.value
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/, '')
      .replace(/\s*([\{\}\(\)\[\];:,<>=!&\|\+\-\*\/%])\s*/g, '$1')
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Input JavaScript"
    input-placeholder="Paste JavaScript here..."
    output-placeholder="Result will appear here..."
    :error="error"
  >
    <template #toolbar>
      <Button @click="beautifyJs">
        <FileCode class="mr-2 h-4 w-4" />
        Beautify
      </Button>
      <Button variant="secondary" @click="minifyJs">
        <Minimize2 class="mr-2 h-4 w-4" />
        Minify (Simple)
      </Button>
    </template>
  </TextTransformLayout>
</template>
