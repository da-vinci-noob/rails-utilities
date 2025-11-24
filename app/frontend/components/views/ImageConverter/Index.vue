<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Download } from 'lucide-vue-next'

const formats = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' }
]

const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const outputFormat = ref('image/png')
const quality = ref(0.92)
const convertedImage = ref('')
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
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const convertImage = () => {
  if (!imagePreview.value) return

  error.value = ''
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      error.value = 'Canvas not supported'
      return
    }

    // Fill white background for JPEG (no transparency)
    if (outputFormat.value === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.drawImage(img, 0, 0)
    convertedImage.value = canvas.toDataURL(outputFormat.value, quality.value)
  }
  img.onerror = () => {
    error.value = 'Error loading image'
  }
  img.src = imagePreview.value
}

const downloadImage = () => {
  if (!convertedImage.value) return

  const format = formats.find((f) => f.value === outputFormat.value)
  const link = document.createElement('a')
  link.href = convertedImage.value
  link.download = `converted.${format?.ext || 'png'}`
  link.click()
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Image Converter</CardTitle>
        <CardDescription>Convert images between PNG, JPEG, and WebP formats</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
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
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Original</Label>
              <div class="border rounded-md p-4 bg-muted">
                <img :src="imagePreview" alt="Original" class="max-h-48 mx-auto" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Converted</Label>
              <div class="border rounded-md p-4 bg-muted min-h-[200px] flex items-center justify-center">
                <img v-if="convertedImage" :src="convertedImage" alt="Converted" class="max-h-48 mx-auto" />
                <span v-else class="text-muted-foreground">Click Convert</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Output Format</Label>
              <select
                v-model="outputFormat"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option v-for="format in formats" :key="format.value" :value="format.value">
                  {{ format.label }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <Label>Quality ({{ Math.round(quality * 100) }}%)</Label>
              <input type="range" v-model.number="quality" min="0.1" max="1" step="0.01" class="w-full h-10" />
            </div>
          </div>

          <div class="flex gap-2">
            <Button @click="convertImage">Convert</Button>
            <Button v-if="convertedImage" variant="outline" @click="downloadImage">
              <Download class="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {{ error }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
