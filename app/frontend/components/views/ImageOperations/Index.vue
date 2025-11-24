<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Download, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-vue-next'

const imagePreview = ref('')
const processedImage = ref('')
const error = ref('')
const width = ref(0)
const height = ref(0)
const newWidth = ref(0)
const newHeight = ref(0)
const maintainAspect = ref(true)
const rotation = ref(0)
const flipH = ref(false)
const flipV = ref(false)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file'
    return
  }

  error.value = ''
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      width.value = img.width
      height.value = img.height
      newWidth.value = img.width
      newHeight.value = img.height
      imagePreview.value = e.target?.result as string
      processedImage.value = ''
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const updateHeight = () => {
  if (maintainAspect.value && width.value > 0) {
    newHeight.value = Math.round((newWidth.value / width.value) * height.value)
  }
}

const updateWidth = () => {
  if (maintainAspect.value && height.value > 0) {
    newWidth.value = Math.round((newHeight.value / height.value) * width.value)
  }
}

const processImage = () => {
  if (!imagePreview.value) return

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Calculate dimensions based on rotation
    const rad = (rotation.value * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad))
    const cos = Math.abs(Math.cos(rad))

    if (rotation.value % 180 === 90) {
      canvas.width = newHeight.value
      canvas.height = newWidth.value
    } else {
      canvas.width = newWidth.value
      canvas.height = newHeight.value
    }

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(rad)
    ctx.scale(flipH.value ? -1 : 1, flipV.value ? -1 : 1)
    ctx.drawImage(img, -newWidth.value / 2, -newHeight.value / 2, newWidth.value, newHeight.value)

    processedImage.value = canvas.toDataURL('image/png')
  }
  img.src = imagePreview.value
}

const downloadImage = () => {
  if (!processedImage.value) return
  const link = document.createElement('a')
  link.href = processedImage.value
  link.download = 'processed-image.png'
  link.click()
}

const rotate90 = () => {
  rotation.value = (rotation.value + 90) % 360
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Image Operations</CardTitle>
        <CardDescription>Resize, rotate, and flip images</CardDescription>
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
          <div class="text-sm text-muted-foreground">Original: {{ width }} × {{ height }} px</div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="space-y-2">
              <Label>Width</Label>
              <Input type="number" v-model.number="newWidth" @input="updateHeight" min="1" />
            </div>
            <div class="space-y-2">
              <Label>Height</Label>
              <Input type="number" v-model.number="newHeight" @input="updateWidth" min="1" />
            </div>
            <div class="space-y-2 col-span-2">
              <Label>Rotation: {{ rotation }}°</Label>
              <input type="range" v-model.number="rotation" min="0" max="360" step="1" class="w-full" />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="maintainAspect" class="w-4 h-4" />
              <span class="text-sm">Maintain aspect ratio</span>
            </label>
          </div>

          <div class="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" @click="rotate90">
              <RotateCw class="h-4 w-4 mr-2" /> Rotate 90°
            </Button>
            <Button variant="outline" size="sm" @click="flipH = !flipH" :class="{ 'bg-accent': flipH }">
              <FlipHorizontal class="h-4 w-4 mr-2" /> Flip H
            </Button>
            <Button variant="outline" size="sm" @click="flipV = !flipV" :class="{ 'bg-accent': flipV }">
              <FlipVertical class="h-4 w-4 mr-2" /> Flip V
            </Button>
          </div>

          <div class="flex gap-2">
            <Button @click="processImage">Apply Changes</Button>
            <Button v-if="processedImage" variant="outline" @click="downloadImage">
              <Download class="h-4 w-4 mr-2" /> Download
            </Button>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Original</Label>
              <div class="border rounded-md p-2 bg-muted overflow-auto max-h-64">
                <img :src="imagePreview" alt="Original" class="max-w-full" />
              </div>
            </div>
            <div class="space-y-2">
              <Label>Result</Label>
              <div
                class="border rounded-md p-2 bg-muted overflow-auto max-h-64 flex items-center justify-center min-h-32"
              >
                <img v-if="processedImage" :src="processedImage" alt="Processed" class="max-w-full" />
                <span v-else class="text-muted-foreground">Click Apply</span>
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
