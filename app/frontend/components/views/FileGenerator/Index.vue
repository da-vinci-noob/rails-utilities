<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Download } from 'lucide-vue-next'

const fileTypes = [
  { value: 'txt', label: 'Text (.txt)', mime: 'text/plain' },
  { value: 'json', label: 'JSON (.json)', mime: 'application/json' },
  { value: 'csv', label: 'CSV (.csv)', mime: 'text/csv' },
  { value: 'html', label: 'HTML (.html)', mime: 'text/html' },
  { value: 'css', label: 'CSS (.css)', mime: 'text/css' },
  { value: 'js', label: 'JavaScript (.js)', mime: 'text/javascript' },
  { value: 'xml', label: 'XML (.xml)', mime: 'application/xml' },
  { value: 'md', label: 'Markdown (.md)', mime: 'text/markdown' },
  { value: 'sql', label: 'SQL (.sql)', mime: 'application/sql' },
  { value: 'yaml', label: 'YAML (.yaml)', mime: 'text/yaml' }
]

const selectedType = ref('txt')
const fileName = ref('file')
const content = ref('')

const templates: Record<string, string> = {
  txt: 'Hello, World!',
  json: '{\n  "name": "example",\n  "version": "1.0.0"\n}',
  csv: 'name,email,age\nJohn,john@example.com,30\nJane,jane@example.com,25',
  html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Title</title>\n</head>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>',
  css: 'body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}',
  js: 'function hello() {\n  console.log("Hello, World!");\n}\n\nhello();',
  xml: '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item>Hello</item>\n</root>',
  md: '# Title\n\n## Subtitle\n\nThis is a paragraph.\n\n- Item 1\n- Item 2',
  sql: 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100)\n);',
  yaml: 'name: example\nversion: 1.0.0\ndependencies:\n  - dep1\n  - dep2'
}

const loadTemplate = () => {
  content.value = templates[selectedType.value] || ''
}

const downloadFile = () => {
  const type = fileTypes.find((t) => t.value === selectedType.value)
  if (!type) return

  const blob = new Blob([content.value], { type: type.mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName.value}.${selectedType.value}`
  link.click()
  URL.revokeObjectURL(url)
}

loadTemplate()
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>File Generator</CardTitle>
        <CardDescription>Generate and download various file types</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>File Type</Label>
            <select
              v-model="selectedType"
              @change="loadTemplate"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option v-for="type in fileTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label>File Name</Label>
            <div class="flex gap-2">
              <Input v-model="fileName" placeholder="filename" />
              <span class="flex items-center text-muted-foreground">.{{ selectedType }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label>Content</Label>
            <Button variant="ghost" size="sm" @click="loadTemplate"> Load Template </Button>
          </div>
          <Textarea v-model="content" placeholder="Enter file content..." class="font-mono text-sm h-64 resize-none" />
        </div>

        <Button @click="downloadFile" :disabled="!content.trim()">
          <Download class="h-4 w-4 mr-2" />
          Download {{ fileName }}.{{ selectedType }}
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
