<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
import yaml from 'js-yaml'

const input = ref('{\n  "name": "John Doe",\n  "age": 30,\n  "list": [\n    "item 1",\n    "item 2"\n  ]\n}')
const output = ref('')
const error = ref('')

const convert = () => {
  error.value = ''
  try {
    const obj = JSON.parse(input.value)
    output.value = yaml.dump(obj)
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
    output-label="Output YAML"
    input-placeholder="Paste JSON here..."
    output-placeholder="Result will appear here..."
    :error="error"
  >
    <template #toolbar>
      <Button @click="convert">
        <ArrowRight class="mr-2 h-4 w-4" />
        Convert to YAML
      </Button>
    </template>
  </TextTransformLayout>
</template>
