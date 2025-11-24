<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Copy, RefreshCw } from 'lucide-vue-next'
import { loremIpsum } from 'lorem-ipsum'

const paragraphCount = ref(3)
const output = ref('')

const generate = () => {
  output.value = loremIpsum({
    count: paragraphCount.value,
    units: 'paragraphs',
    paragraphLowerBound: 3,
    paragraphUpperBound: 7,
    format: 'plain'
  })
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(output.value)
}

generate()
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Lorem Ipsum Generator</CardTitle>
        <CardDescription>Generate placeholder text</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex gap-4 items-end">
          <div class="w-32">
            <Label>Paragraphs</Label>
            <Input type="number" v-model="paragraphCount" min="1" max="50" />
          </div>
          <Button @click="generate">
            <RefreshCw class="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button variant="outline" @click="copyToClipboard" :disabled="!output">
            <Copy class="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
        <Textarea 
          v-model="output" 
          readonly 
          class="h-96 font-mono resize-none bg-muted"
        />
      </CardContent>
    </Card>
  </div>
</template>
