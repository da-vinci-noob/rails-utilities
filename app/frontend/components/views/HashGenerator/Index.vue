<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-vue-next'
import CryptoJS from 'crypto-js'

const inputText = ref('Hello World')

const hashes = computed(() => ({
  md5: CryptoJS.MD5(inputText.value).toString(),
  sha1: CryptoJS.SHA1(inputText.value).toString(),
  sha256: CryptoJS.SHA256(inputText.value).toString(),
  sha512: CryptoJS.SHA512(inputText.value).toString(),
  sha3: CryptoJS.SHA3(inputText.value).toString()
}))

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Hash Generator</CardTitle>
        <CardDescription>Generate cryptographic hashes</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Input Text</Label>
          <Textarea v-model="inputText" placeholder="Enter text..." class="font-mono" />
        </div>

        <div class="space-y-4 pt-4">
          <div v-for="(value, algo) in hashes" :key="algo" class="space-y-2">
            <Label class="uppercase">{{ algo }}</Label>
            <div class="flex gap-2">
              <Input readonly :model-value="value" class="font-mono text-xs" />
              <Button variant="outline" size="icon" @click="copyToClipboard(value)">
                <Copy class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
