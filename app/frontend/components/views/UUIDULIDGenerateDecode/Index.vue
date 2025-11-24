<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RefreshCw, Copy } from 'lucide-vue-next'
import { v4 as uuidv4 } from 'uuid'
import { ulid, decodeTime } from 'ulid'

const uuid = ref('')
const ulidValue = ref('')
const ulidDecode = ref('')
const decodedTime = ref('')

const generateUUID = () => {
  uuid.value = uuidv4()
}

const generateULID = () => {
  ulidValue.value = ulid()
}

const decodeULID = () => {
  try {
    const timestamp = decodeTime(ulidDecode.value)
    decodedTime.value = new Date(timestamp).toISOString()
  } catch (e) {
    decodedTime.value = 'Invalid ULID'
  }
}

const copy = (text: string) => navigator.clipboard.writeText(text)

generateUUID()
generateULID()

// Watch for input changes to ensure conversion happens after v-model updates
watch(ulidDecode, decodeULID)
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader><CardTitle>UUID/ULID Generator</CardTitle></CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between">
            <Label>UUID v4</Label>
            <Button size="sm" @click="generateUUID"><RefreshCw class="h-4 w-4 mr-2" />Generate</Button>
          </div>
          <div class="flex gap-2">
            <Input readonly :model-value="uuid" class="font-mono" />
            <Button variant="outline" size="icon" @click="copy(uuid)"><Copy class="h-4 w-4" /></Button>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <Label>ULID</Label>
            <Button size="sm" @click="generateULID"><RefreshCw class="h-4 w-4 mr-2" />Generate</Button>
          </div>
          <div class="flex gap-2">
            <Input readonly :model-value="ulidValue" class="font-mono" />
            <Button variant="outline" size="icon" @click="copy(ulidValue)"><Copy class="h-4 w-4" /></Button>
          </div>
        </div>
        <div class="space-y-2">
          <Label>Decode ULID</Label>
          <Input v-model="ulidDecode" placeholder="Paste ULID..." class="font-mono" />
          <Input v-if="decodedTime" readonly :model-value="decodedTime" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
