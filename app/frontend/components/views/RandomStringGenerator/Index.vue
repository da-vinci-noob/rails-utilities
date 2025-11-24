<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw } from 'lucide-vue-next'

const length = ref(16)
const output = ref('')
const includeLowercase = ref(true)
const includeUppercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(false)

const generate = () => {
  let charset = ''
  if (includeLowercase.value) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (includeUppercase.value) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (includeNumbers.value) charset += '0123456789'
  if (includeSymbols.value) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz'

  let result = ''
  for (let i = 0; i < length.value; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  output.value = result
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
        <CardTitle>Random String Generator</CardTitle>
        <CardDescription>Generate random strings</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Length</Label>
          <Input type="number" v-model="length" min="1" max="256" />
        </div>

        <div class="space-y-2">
          <Label>Character Sets</Label>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="lowercase" v-model="includeLowercase" class="w-4 h-4" />
            <Label for="lowercase" class="cursor-pointer">Lowercase (a-z)</Label>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="uppercase" v-model="includeUppercase" class="w-4 h-4" />
            <Label for="uppercase" class="cursor-pointer">Uppercase (A-Z)</Label>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="numbers" v-model="includeNumbers" class="w-4 h-4" />
            <Label for="numbers" class="cursor-pointer">Numbers (0-9)</Label>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="symbols" v-model="includeSymbols" class="w-4 h-4" />
            <Label for="symbols" class="cursor-pointer">Symbols (!@#$...)</Label>
          </div>
        </div>

        <div class="flex gap-2">
          <Button @click="generate">
            <RefreshCw class="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button variant="outline" @click="copyToClipboard" :disabled="!output">
            <Copy class="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>

        <div class="space-y-2">
          <Label>Generated String</Label>
          <Input readonly :model-value="output" class="font-mono" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
