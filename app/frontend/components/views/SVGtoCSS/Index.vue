<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const svgInput =
  ref(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 6v6l4 2"/>
</svg>`)

const cssOutput = computed(() => {
  if (!svgInput.value.trim()) return ''

  try {
    // Clean and encode the SVG
    let svg = svgInput.value.trim()

    // URL encode special characters
    const encoded = svg
      .replace(/"/g, "'")
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/{/g, '%7B')
      .replace(/}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
      .replace(/\s+/g, ' ')

    return `background-image: url("data:image/svg+xml,${encoded}");`
  } catch (e) {
    return 'Error encoding SVG'
  }
})

const base64Output = computed(() => {
  if (!svgInput.value.trim()) return ''

  try {
    const base64 = btoa(svgInput.value.trim())
    return `background-image: url("data:image/svg+xml;base64,${base64}");`
  } catch (e) {
    return 'Error encoding SVG'
  }
})

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>SVG to CSS</CardTitle>
        <CardDescription>Convert SVG to CSS background-image data URI</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>SVG Input</Label>
          <Textarea
            v-model="svgInput"
            placeholder="Paste SVG code here..."
            class="font-mono text-xs h-40 resize-none"
          />
        </div>

        <div v-if="svgInput.trim()" class="space-y-4">
          <div class="space-y-2">
            <Label>Preview</Label>
            <div class="border rounded-md p-4 bg-white dark:bg-gray-900 flex items-center justify-center h-24">
              <div v-html="svgInput" class="w-12 h-12"></div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <Label>CSS (URL Encoded)</Label>
              <Button variant="ghost" size="sm" @click="copyToClipboard(cssOutput)">
                <Copy class="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea :model-value="cssOutput" readonly class="font-mono text-xs h-20 resize-none bg-muted" />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <Label>CSS (Base64)</Label>
              <Button variant="ghost" size="sm" @click="copyToClipboard(base64Output)">
                <Copy class="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea :model-value="base64Output" readonly class="font-mono text-xs h-20 resize-none bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
