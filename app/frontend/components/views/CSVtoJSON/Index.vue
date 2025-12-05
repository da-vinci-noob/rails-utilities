<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
import Papa from 'papaparse'

const input = ref('name,age\nJohn,30\nJane,25')
const output = ref('')
const error = ref('')

const convert = () => {
  error.value = ''
  try {
    const result = Papa.parse(input.value, { header: true })
    output.value = JSON.stringify(result.data, null, 2)
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Input CSV"
    output-label="Output JSON"
    input-placeholder="Paste CSV here..."
    :error="error"
  >
    <template #toolbar>
      <Button @click="convert">
        <ArrowRight class="mr-2 h-4 w-4" />
        Convert
      </Button>
    </template>
  </TextTransformLayout>
</template>
