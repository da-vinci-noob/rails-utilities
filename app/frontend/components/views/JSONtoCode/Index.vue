<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const jsonInput = ref(`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}`)

const outputLang = ref('typescript')
const error = ref('')

const inferType = (value: unknown): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const types = new Set(value.map((v) => inferType(v)))
    if (types.size === 1) return `${[...types][0]}[]`
    return `(${[...types].join(' | ')})[]`
  }
  if (typeof value === 'object') return 'object'
  return typeof value
}

const generateTypeScript = (obj: Record<string, unknown>, name = 'Root'): string => {
  const lines: string[] = [`interface ${name} {`]

  for (const [key, value] of Object.entries(obj)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`

    if (value === null) {
      lines.push(`  ${safeKey}: null;`)
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        lines.push(`  ${safeKey}: ${key.charAt(0).toUpperCase() + key.slice(1)}Item[];`)
      } else {
        lines.push(`  ${safeKey}: ${inferType(value)};`)
      }
    } else if (typeof value === 'object') {
      lines.push(`  ${safeKey}: ${key.charAt(0).toUpperCase() + key.slice(1)};`)
    } else {
      lines.push(`  ${safeKey}: ${typeof value};`)
    }
  }

  lines.push('}')

  // Generate nested interfaces
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      lines.push('')
      lines.push(generateTypeScript(value as Record<string, unknown>, key.charAt(0).toUpperCase() + key.slice(1)))
    }
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      lines.push('')
      lines.push(
        generateTypeScript(value[0] as Record<string, unknown>, key.charAt(0).toUpperCase() + key.slice(1) + 'Item')
      )
    }
  }

  return lines.join('\n')
}

const generateGoStruct = (obj: Record<string, unknown>, name = 'Root'): string => {
  const goType = (value: unknown): string => {
    if (value === null) return 'interface{}'
    if (Array.isArray(value)) return `[]${value.length > 0 ? goType(value[0]) : 'interface{}'}`
    if (typeof value === 'object') return 'struct'
    if (typeof value === 'string') return 'string'
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64'
    if (typeof value === 'boolean') return 'bool'
    return 'interface{}'
  }

  const lines: string[] = [`type ${name} struct {`]

  for (const [key, value] of Object.entries(obj)) {
    const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
    const fieldType = typeof value === 'object' && value !== null && !Array.isArray(value) ? fieldName : goType(value)
    lines.push(`\t${fieldName} ${fieldType} \`json:"${key}"\``)
  }

  lines.push('}')
  return lines.join('\n')
}

const generatePythonClass = (obj: Record<string, unknown>, name = 'Root'): string => {
  const pyType = (value: unknown): string => {
    if (value === null) return 'None'
    if (Array.isArray(value)) return `List[${value.length > 0 ? pyType(value[0]) : 'Any'}]`
    if (typeof value === 'object') return 'dict'
    if (typeof value === 'string') return 'str'
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float'
    if (typeof value === 'boolean') return 'bool'
    return 'Any'
  }

  const lines: string[] = [
    'from dataclasses import dataclass',
    'from typing import List, Optional, Any',
    '',
    '@dataclass',
    `class ${name}:`
  ]

  for (const [key, value] of Object.entries(obj)) {
    lines.push(`    ${key}: ${pyType(value)}`)
  }

  return lines.join('\n')
}

const output = computed(() => {
  error.value = ''
  try {
    const parsed = JSON.parse(jsonInput.value)
    if (typeof parsed !== 'object' || parsed === null) {
      return '// Input must be a JSON object'
    }

    switch (outputLang.value) {
      case 'typescript':
        return generateTypeScript(parsed)
      case 'go':
        return generateGoStruct(parsed)
      case 'python':
        return generatePythonClass(parsed)
      default:
        return generateTypeScript(parsed)
    }
  } catch (e: any) {
    error.value = e.message
    return '// Invalid JSON'
  }
})

const copyToClipboard = () => navigator.clipboard.writeText(output.value)
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>JSON to Code</CardTitle>
        <CardDescription>Generate TypeScript interfaces, Go structs, or Python dataclasses from JSON</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>JSON Input</Label>
          <Textarea v-model="jsonInput" placeholder="Paste JSON here..." class="font-mono text-sm h-48 resize-none" />
        </div>

        <div class="space-y-2">
          <Label>Output Language</Label>
          <div class="flex gap-2">
            <Button
              v-for="lang in ['typescript', 'go', 'python']"
              :key="lang"
              :variant="outputLang === lang ? 'default' : 'outline'"
              size="sm"
              @click="outputLang = lang"
            >
              {{ lang === 'typescript' ? 'TypeScript' : lang === 'go' ? 'Go' : 'Python' }}
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label>Generated Code</Label>
            <Button variant="ghost" size="sm" @click="copyToClipboard"> <Copy class="h-4 w-4 mr-2" /> Copy </Button>
          </div>
          <Textarea :model-value="output" readonly class="font-mono text-sm h-64 resize-none bg-muted" />
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {{ error }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
