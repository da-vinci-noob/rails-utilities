<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, RefreshCw, Download } from 'lucide-vue-next'

const algorithms = [
  { value: 'RSA-OAEP', label: 'RSA-OAEP (2048-bit)', bits: 2048 },
  { value: 'RSA-PSS', label: 'RSA-PSS (2048-bit)', bits: 2048 },
  { value: 'ECDSA', label: 'ECDSA (P-256)', curve: 'P-256' },
  { value: 'ECDH', label: 'ECDH (P-256)', curve: 'P-256' }
]

const selectedAlgo = ref('RSA-OAEP')
const publicKey = ref('')
const privateKey = ref('')
const loading = ref(false)
const error = ref('')

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const formatPEM = (base64: string, type: 'PUBLIC' | 'PRIVATE'): string => {
  const lines = base64.match(/.{1,64}/g) || []
  return `-----BEGIN ${type} KEY-----\n${lines.join('\n')}\n-----END ${type} KEY-----`
}

const generateKeyPair = async () => {
  loading.value = true
  error.value = ''
  publicKey.value = ''
  privateKey.value = ''

  try {
    const algo = algorithms.find((a) => a.value === selectedAlgo.value)
    if (!algo) throw new Error('Invalid algorithm')

    let keyPair: CryptoKeyPair

    if (selectedAlgo.value.startsWith('RSA')) {
      keyPair = await crypto.subtle.generateKey(
        {
          name: selectedAlgo.value,
          modulusLength: algo.bits || 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        selectedAlgo.value === 'RSA-OAEP' ? ['encrypt', 'decrypt'] : ['sign', 'verify']
      )
    } else {
      keyPair = await crypto.subtle.generateKey(
        {
          name: selectedAlgo.value,
          namedCurve: algo.curve || 'P-256'
        },
        true,
        selectedAlgo.value === 'ECDH' ? ['deriveKey', 'deriveBits'] : ['sign', 'verify']
      )
    }

    const pubKeyData = await crypto.subtle.exportKey('spki', keyPair.publicKey)
    const privKeyData = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

    publicKey.value = formatPEM(arrayBufferToBase64(pubKeyData), 'PUBLIC')
    privateKey.value = formatPEM(arrayBufferToBase64(privKeyData), 'PRIVATE')
  } catch (e: any) {
    error.value = e.message || 'Failed to generate key pair'
  } finally {
    loading.value = false
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const downloadKey = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Key Pair Generator</CardTitle>
        <CardDescription>Generate cryptographic key pairs using Web Crypto API</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex gap-4 items-end">
          <div class="flex-1 space-y-2">
            <Label>Algorithm</Label>
            <select
              v-model="selectedAlgo"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option v-for="algo in algorithms" :key="algo.value" :value="algo.value">
                {{ algo.label }}
              </option>
            </select>
          </div>
          <Button @click="generateKeyPair" :disabled="loading">
            <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
            Generate
          </Button>
        </div>

        <div v-if="publicKey" class="space-y-4">
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <Label>Public Key</Label>
              <div class="flex gap-2">
                <Button variant="ghost" size="sm" @click="copyToClipboard(publicKey)">
                  <Copy class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" @click="downloadKey(publicKey, 'public_key.pem')">
                  <Download class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea :model-value="publicKey" readonly class="font-mono text-xs h-32 resize-none bg-muted" />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <Label>Private Key</Label>
              <div class="flex gap-2">
                <Button variant="ghost" size="sm" @click="copyToClipboard(privateKey)">
                  <Copy class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" @click="downloadKey(privateKey, 'private_key.pem')">
                  <Download class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Textarea :model-value="privateKey" readonly class="font-mono text-xs h-40 resize-none bg-muted" />
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {{ error }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
