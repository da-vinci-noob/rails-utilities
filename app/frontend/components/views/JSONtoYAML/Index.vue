<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy, ArrowRight } from 'lucide-vue-next'
import yaml from 'js-yaml'

const inputJson = ref('{\n  "name": "John Doe",\n  "age": 30,\n  "list": [\n    "item 1",\n    "item 2"\n  ]\n}')
const outputYaml = ref('')
const error = ref('')

const convert = () => {
  error.value = ''
  try {
    const obj = JSON.parse(inputJson.value)
    outputYaml.value = yaml.dump(obj)
  } catch (e: any) {
    error.value = e.message
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(outputYaml.value)
}
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-4 mb-4">
        <Button @click="convert">
            <ArrowRight class="mr-2 h-4 w-4" />
            Convert to YAML
        </Button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Input JSON</Label>
        <Textarea 
          v-model="inputJson" 
          placeholder="Paste JSON here..." 
          class="flex-1 font-mono resize-none"
        />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
            <Label>Output YAML</Label>
            <Button variant="ghost" size="sm" @click="copyToClipboard" :disabled="!outputYaml">
                <Copy class="h-4 w-4 mr-2" />
                Copy
            </Button>
        </div>
        <Textarea 
          v-model="outputYaml" 
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
