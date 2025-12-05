<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { Database } from 'lucide-vue-next'
import { format } from 'sql-formatter'

const input = ref('SELECT * FROM users WHERE id = 1')
const output = ref('')
const error = ref('')

const formatSql = () => {
  error.value = ''
  try {
    output.value = format(input.value)
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Input SQL"
    output-label="Formatted SQL"
    input-placeholder="Paste SQL here..."
    output-placeholder="Result will appear here..."
    :error="error"
  >
    <template #toolbar>
      <Button @click="formatSql">
        <Database class="mr-2 h-4 w-4" />
        Format SQL
      </Button>
    </template>
  </TextTransformLayout>
</template>
