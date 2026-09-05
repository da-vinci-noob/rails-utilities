<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { FileCode, Minimize2 } from 'lucide-vue-next'
import xmlFormat from 'xml-formatter'
import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'

const input = ref('<root><child>value</child></root>')
const output = ref('')
const error = ref('')

const beautifyXml = () => {
  error.value = ''
  try {
    output.value = xmlFormat(input.value, { indentation: '  ' })
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyXml = () => {
  error.value = ''
  try {
    output.value = xmlFormat(input.value, {
      indentation: '',
      collapseContent: true,
      lineSeparator: ''
    })
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 p-4">
    <TextTransformLayout
      v-model:input="input"
      v-model:output="output"
      input-label="Input XML"
      input-placeholder="Paste XML here..."
      output-placeholder="Result will appear here..."
      :error="error"
    >
      <template #toolbar>
        <Button @click="beautifyXml">
          <FileCode class="mr-2 h-4 w-4" />
          Beautify
        </Button>
        <Button variant="secondary" @click="minifyXml">
          <Minimize2 class="mr-2 h-4 w-4" />
          Minify
        </Button>
      </template>
    </TextTransformLayout>
    <div class="mt-auto pt-4 border-t">
      <UtilityFeedback utility-title="XML Beautify/Minify" />
    </div>
  </div>
</template>
