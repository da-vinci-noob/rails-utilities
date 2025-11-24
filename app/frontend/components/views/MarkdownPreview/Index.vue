<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { marked } from 'marked'

const markdown = ref('# Hello World\n\nThis is **markdown**.')

const html = computed(() => {
  return marked(markdown.value)
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader><CardTitle>Markdown Preview</CardTitle></CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Markdown</Label>
          <Textarea v-model="markdown" placeholder="Enter markdown..." class="h-48 font-mono" />
        </div>
        <div class="space-y-2">
          <Label>Preview</Label>
          <div class="p-4 border rounded-md prose dark:prose-invert" v-html="html" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
