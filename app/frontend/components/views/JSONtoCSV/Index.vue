<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
import Papa from 'papaparse'

const input = ref('[{"name":"John","age":30},{"name":"Jane","age":25}]')
const output = ref('')
const error = ref('')

const convert = () => {
  error.value = ''
  try {
    const data = JSON.parse(input.value)
    output.value = Papa.unparse(data)
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Input JSON"
    output-label="Output CSV"
    input-placeholder="Paste JSON array..."
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
