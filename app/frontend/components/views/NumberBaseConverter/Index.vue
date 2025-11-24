<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-vue-next'

const binary = ref('')
const octal = ref('')
const decimal = ref('')
const hexadecimal = ref('')

const converting = ref(false)

const convertFrom = (value: string, base: number) => {
  if (converting.value || !value) return
  converting.value = true

  try {
    const num = parseInt(value, base)
    if (isNaN(num)) return

    binary.value = num.toString(2)
    octal.value = num.toString(8)
    decimal.value = num.toString(10)
    hexadecimal.value = num.toString(16).toUpperCase()
  } catch (e) {
    // ignore
  }

  converting.value = false
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

watch(binary, (val) => convertFrom(val, 2))
watch(octal, (val) => convertFrom(val, 8))
watch(decimal, (val) => convertFrom(val, 10))
watch(hexadecimal, (val) => convertFrom(val, 16))

decimal.value = '42'
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Number Base Converter</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Binary</Label>
          <div class="flex gap-2">
            <Input v-model="binary" placeholder="101010" class="font-mono" />
            <Button variant="outline" size="icon" @click="copyToClipboard(binary)">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div class="space-y-2">
          <Label>Octal</Label>
          <div class="flex gap-2">
            <Input v-model="octal" placeholder="52" class="font-mono" />
            <Button variant="outline" size="icon" @click="copyToClipboard(octal)">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div class="space-y-2">
          <Label>Decimal</Label>
          <div class="flex gap-2">
            <Input v-model="decimal" placeholder="42" class="font-mono" />
            <Button variant="outline" size="icon" @click="copyToClipboard(decimal)">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div class="space-y-2">
          <Label>Hexadecimal</Label>
          <div class="flex gap-2">
            <Input v-model="hexadecimal" placeholder="2A" class="font-mono" />
            <Button variant="outline" size="icon" @click="copyToClipboard(hexadecimal)">
              <Copy class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
