<script setup lang="ts">
import { ref, watch } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const html = ref('<div class="container"><label for="input">Text</label></div>')
const jsx = ref('')

const convert = () => {
  jsx.value = html.value
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<(\w+)([^>]*)\/>/g, '<$1$2 />')
    .replace(/<!--(.*?)-->/g, '{/* $1 */}')
}

const copy = () => navigator.clipboard.writeText(jsx.value)

convert()

// Watch for input changes to ensure conversion happens after v-model updates
watch(html, convert)
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>HTML</Label>
        <Textarea v-model="html" placeholder="Enter HTML..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
          <Label>JSX</Label>
          <Button variant="ghost" size="sm" @click="copy" :disabled="!jsx"> <Copy class="h-4 w-4 mr-2" />Copy </Button>
        </div>
        <Textarea v-model="jsx" readonly placeholder="Result..." class="flex-1 font-mono resize-none bg-muted" />
      </div>
    </div>
  </div>
</template>
