<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy, FileCode, Minimize2 } from 'lucide-vue-next'
import xmlFormat from 'xml-formatter'

const inputXml = ref('<root><child>value</child></root>')
const outputXml = ref('')
const error = ref('')

const beautifyXml = () => {
  error.value = ''
  try {
    outputXml.value = xmlFormat(inputXml.value, { indentation: '  ' })
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyXml = () => {
  error.value = ''
  try {
    outputXml.value = xmlFormat(inputXml.value, {
      indentation: '',
      collapseContent: true,
      lineSeparator: ''
    })
  } catch (e: any) {
    error.value = e.message
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(outputXml.value)
}
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-4 mb-4">
        <Button @click="beautifyXml">
            <FileCode class="mr-2 h-4 w-4" />
            Beautify
        </Button>
        <Button variant="secondary" @click="minifyXml">
            <Minimize2 class="mr-2 h-4 w-4" />
            Minify
        </Button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Input XML</Label>
        <Textarea 
          v-model="inputXml" 
          placeholder="Paste XML here..." 
          class="flex-1 font-mono resize-none"
        />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
            <Label>Output</Label>
            <Button variant="ghost" size="sm" @click="copyToClipboard" :disabled="!outputXml">
                <Copy class="h-4 w-4 mr-2" />
                Copy
            </Button>
        </div>
        <Textarea 
          v-model="outputXml" 
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
