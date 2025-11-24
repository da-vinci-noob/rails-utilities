<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy, FileCode, Minimize2 } from 'lucide-vue-next'
import { html as beautifyHtmlFn } from 'js-beautify'

const inputHtml = ref('<div><h1>Hello</h1><p>World</p></div>')
const outputHtml = ref('')
const error = ref('')

const beautifyHtml = () => {
  error.value = ''
  try {
    outputHtml.value = beautifyHtmlFn(inputHtml.value, { indent_size: 2 })
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyHtml = () => {
  error.value = ''
  try {
    // Simple regex-based minification for now as js-beautify doesn't strictly minify
    outputHtml.value = inputHtml.value
      .replace(/\>[\r\n ]+\</g, '><') // Remove spaces between tags
      .replace(/(<.*?>)|\s+/g, (m, $1) => ($1 ? $1 : ' ')) // Collapse whitespace
      .trim()
  } catch (e: any) {
    error.value = e.message
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(outputHtml.value)
}
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-4 mb-4">
      <Button @click="beautifyHtml">
        <FileCode class="mr-2 h-4 w-4" />
        Beautify
      </Button>
      <Button variant="secondary" @click="minifyHtml">
        <Minimize2 class="mr-2 h-4 w-4" />
        Minify
      </Button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Input HTML</Label>
        <Textarea v-model="inputHtml" placeholder="Paste HTML here..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
          <Label>Output</Label>
          <Button variant="ghost" size="sm" @click="copyToClipboard" :disabled="!outputHtml">
            <Copy class="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <Textarea
          v-model="outputHtml"
          readonly
          placeholder="Result will appear here..."
          class="flex-1 font-mono resize-none bg-muted"
        />
      </div>
    </div>
    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
      {{ error }}
    </div>
  </div>
</template>
