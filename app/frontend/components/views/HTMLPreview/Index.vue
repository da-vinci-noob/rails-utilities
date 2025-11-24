<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const html = ref('<h1>Hello World</h1>')
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader><CardTitle>HTML Preview</CardTitle></CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>HTML</Label>
          <Textarea v-model="html" placeholder="Enter HTML..." class="h-48 font-mono" />
        </div>
        <div class="space-y-2">
          <Label>Preview</Label>
          <div class="p-4 border rounded-md">
            <iframe :srcdoc="html" sandbox="allow-scripts" class="w-full h-96 border-0" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
