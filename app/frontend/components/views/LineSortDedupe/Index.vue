<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

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
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-2 mb-4">
      <Button @click="sort">Sort</Button>
      <Button @click="dedupe">Dedupe</Button>
      <Button @click="sortAndDedupe">Sort & Dedupe</Button>
    </div>
    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Input</Label>
        <Textarea v-model="input" placeholder="One item per line..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Output</Label>
        <Textarea v-model="output" readonly placeholder="Result..." class="flex-1 font-mono resize-none bg-muted" />
      </div>
    </div>
  </div>
</template>
