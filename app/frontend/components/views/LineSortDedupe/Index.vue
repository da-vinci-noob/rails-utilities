<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'

const input = ref('apple\nbanana\napple\ncherry')
const output = ref('')

const sort = () => {
  output.value = input.value.split('\n').sort().join('\n')
}

const dedupe = () => {
  output.value = [...new Set(input.value.split('\n'))].join('\n')
}

const sortAndDedupe = () => {
  output.value = [...new Set(input.value.split('\n'))].sort().join('\n')
}
</script>

<template>
  <TextTransformLayout v-model:input="input" v-model:output="output" input-placeholder="One item per line...">
    <template #toolbar>
      <Button @click="sort">Sort</Button>
      <Button @click="dedupe">Dedupe</Button>
      <Button @click="sortAndDedupe">Sort & Dedupe</Button>
    </template>
  </TextTransformLayout>
</template>
