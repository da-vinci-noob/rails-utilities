<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy, Database } from 'lucide-vue-next'
import { format } from 'sql-formatter'

const inputSql = ref('SELECT * FROM users WHERE id = 1')
const outputSql = ref('')
const error = ref('')

const formatSql = () => {
  error.value = ''
  try {
    outputSql.value = format(inputSql.value)
  } catch (e: any) {
    error.value = e.message
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(outputSql.value)
}
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-4 mb-4">
        <Button @click="formatSql">
            <Database class="mr-2 h-4 w-4" />
            Format SQL
        </Button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Input SQL</Label>
        <Textarea 
          v-model="inputSql" 
          placeholder="Paste SQL here..." 
          class="flex-1 font-mono resize-none"
        />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
            <Label>Formatted SQL</Label>
            <Button variant="ghost" size="sm" @click="copyToClipboard" :disabled="!outputSql">
                <Copy class="h-4 w-4 mr-2" />
                Copy
            </Button>
        </div>
        <Textarea 
          v-model="outputSql" 
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
