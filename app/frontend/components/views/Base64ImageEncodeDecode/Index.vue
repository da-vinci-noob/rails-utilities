<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy, Upload, Download } from 'lucide-vue-next'

const mode = ref<'encode' | 'decode'>('encode')
const imageFile = ref<File | null>(null)
const base64Output = ref('')
const imagePreview = ref('')
const error = ref('')

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file'
    return
  }

  error.value = ''
  imageFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    imagePreview.value = result
    // Extract just the base64 part (remove data:image/xxx;base64, prefix)
    base64Output.value = result.split(',')[1] || result
  }
  reader.onerror = () => {
    error.value = 'Error reading file'
  }
  reader.readAsDataURL(file)
}

const base64Input = ref('')
const decodedImage = ref('')

const decodeBase64 = () => {
  error.value = ''
  try {
    let base64 = base64Input.value.trim()
    // If it's already a data URL, use it directly
    if (base64.startsWith('data:image')) {
      decodedImage.value = base64
    } else {
      // Try to detect image type from base64 header or default to png
      let mimeType = 'image/png'
      if (base64.startsWith('/9j/')) mimeType = 'image/jpeg'
      else if (base64.startsWith('iVBOR')) mimeType = 'image/png'
      else if (base64.startsWith('R0lGO')) mimeType = 'image/gif'
      else if (base64.startsWith('UklGR')) mimeType = 'image/webp'

      decodedImage.value = `data:${mimeType};base64,${base64}`
    }
  } catch (e) {
    error.value = 'Invalid base64 string'
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const downloadImage = () => {
  if (!decodedImage.value) return
  const link = document.createElement('a')
  link.href = decodedImage.value
  link.download = 'decoded-image.png'
  link.click()
}

const toggleMode = () => {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  error.value = ''
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Base64 Image Encode/Decode</CardTitle>
        <CardDescription>Convert images to/from Base64 strings</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex gap-2 mb-4">
          <Button @click="toggleMode"> Switch to {{ mode === 'encode' ? 'Decode' : 'Encode' }} </Button>
        </div>

        <!-- Encode Mode -->
        <div v-if="mode === 'encode'" class="space-y-4">
          <div class="space-y-2">
            <Label>Select Image</Label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
          </div>

          <div v-if="imagePreview" class="space-y-4">
            <div class="space-y-2">
              <Label>Preview</Label>
              <div class="border rounded-md p-4 bg-muted">
                <img :src="imagePreview" alt="Preview" class="max-h-48 mx-auto" />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <Label>Base64 Output</Label>
                <Button variant="ghost" size="sm" @click="copyToClipboard(base64Output)">
                  <Copy class="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea :model-value="base64Output" readonly class="font-mono text-xs h-32 resize-none bg-muted" />
            </div>
          </div>
        </div>

        <!-- Decode Mode -->
        <div v-if="mode === 'decode'" class="space-y-4">
          <div class="space-y-2">
            <Label>Base64 Input</Label>
            <Textarea
              v-model="base64Input"
              placeholder="Paste base64 string here..."
              class="font-mono text-xs h-32 resize-none"
            />
          </div>

          <Button @click="decodeBase64">
            <Download class="h-4 w-4 mr-2" />
            Decode Image
          </Button>

          <div v-if="decodedImage" class="space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <Label>Decoded Image</Label>
                <Button variant="ghost" size="sm" @click="downloadImage">
                  <Download class="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div class="border rounded-md p-4 bg-muted">
                <img :src="decodedImage" alt="Decoded" class="max-h-64 mx-auto" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {{ error }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
