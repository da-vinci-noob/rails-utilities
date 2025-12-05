<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

interface Props {
  inputLabel?: string
  outputLabel?: string
  inputPlaceholder?: string
  outputPlaceholder?: string
  showCopyButton?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  inputLabel: 'Input',
  outputLabel: 'Output',
  inputPlaceholder: 'Enter text...',
  outputPlaceholder: 'Result...',
  showCopyButton: true,
  error: ''
})

const input = defineModel<string>('input', { default: '' })
const output = defineModel<string>('output', { default: '' })

const copyToClipboard = () => {
  navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div v-if="$slots.toolbar" class="flex gap-2 mb-4">
      <slot name="toolbar" />
    </div>
    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Button variant="text" size="sm" class="justify-start">
          {{ inputLabel }}
        </Button>
        <Textarea v-model="input" :placeholder="inputPlaceholder" class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
          <Button variant="text" size="sm" class="justify-start">
            {{ outputLabel }}
          </Button>
          <Button v-if="showCopyButton" variant="outline" size="sm" @click="copyToClipboard" :disabled="!output">
            <Copy class="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <Textarea
          v-model="output"
          readonly
          :placeholder="outputPlaceholder"
          class="flex-1 font-mono resize-none bg-muted"
        />
      </div>
    </div>
    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
      {{ error }}
    </div>
  </div>
</template>
