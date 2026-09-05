<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
import yaml from 'js-yaml'
import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'

const input = ref('name: John Doe\nage: 30\nlist:\n  - item 1\n  - item 2')
const output = ref('')
const error = ref('')

const convert = () => {
  error.value = ''
  try {
    const obj = yaml.load(input.value)
    output.value = JSON.stringify(obj, null, 2)
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
      input-label="Input YAML"
      output-label="Output JSON"
      input-placeholder="Paste YAML here..."
      output-placeholder="Result will appear here..."
      :error="error"
    >
      <template #toolbar>
        <Button @click="convert">
          <ArrowRight class="mr-2 h-4 w-4" />
          Convert to JSON
        </Button>
      </template>
    </TextTransformLayout>
    <div class="mt-auto pt-4 border-t">
      <UtilityFeedback utility-title="YAML to JSON" />
    </div>
  </div>
</template>
