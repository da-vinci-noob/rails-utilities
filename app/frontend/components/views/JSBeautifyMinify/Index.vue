<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy, FileCode, Minimize2 } from 'lucide-vue-next'
import { js as beautifyJsFn } from 'js-beautify'

const inputJs = ref('function foo() { console.log("bar"); }')
const outputJs = ref('')
const error = ref('')

const beautifyJs = () => {
  error.value = ''
  try {
    outputJs.value = beautifyJsFn(inputJs.value, { indent_size: 2 })
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyJs = () => {
  error.value = ''
  try {
    // Very naive minification for JS (removing comments and whitespace)
    // Proper JS minification requires a parser like UglifyJS or Terser which are heavy
    // This is a "best effort" simple minifier
    outputJs.value = inputJs.value
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/^\s+|\s+$/, '') // Trim
      .replace(/\s*([\{\}\(\)\[\];:,<>=!&\|\+\-\*\/%])\s*/g, '$1') // Remove space around operators
  } catch (e: any) {
    error.value = e.message
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(outputJs.value)
}
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-4 mb-4">
      <Button @click="beautifyJs">
        <FileCode class="mr-2 h-4 w-4" />
        Beautify
      </Button>
      <Button variant="secondary" @click="minifyJs">
        <Minimize2 class="mr-2 h-4 w-4" />
        Minify (Simple)
      </Button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Input JavaScript</Label>
        <Textarea v-model="inputJs" placeholder="Paste JavaScript here..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
          <Label>Output</Label>
          <Button variant="ghost" size="sm" @click="copyToClipboard" :disabled="!outputJs">
            <Copy class="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <Textarea
          v-model="outputJs"
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
