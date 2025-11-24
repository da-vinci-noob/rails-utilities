<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import QRCode from 'qrcode'

const inputText = ref('https://example.com')
const qrCodeDataUrl = ref('')

const generateQR = async () => {
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(inputText.value, {
      width: 300,
      margin: 2
    })
  } catch (e) {
    console.error(e)
  }
}

generateQR()

// Watch for input changes to ensure conversion happens after v-model updates
watch(inputText, generateQR)
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Generate QR codes from text</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Text or URL</Label>
          <Input v-model="inputText" placeholder="Enter text or URL..." />
        </div>
        <div v-if="qrCodeDataUrl" class="flex justify-center p-6 bg-white rounded-md">
          <img :src="qrCodeDataUrl" alt="QR Code" class="max-w-full" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
