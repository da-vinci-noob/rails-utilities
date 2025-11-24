<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-vue-next'
import { format } from 'date-fns'

const currentUnix = ref(Math.floor(Date.now() / 1000))
const unixInput = ref('')
const dateOutput = ref({
  iso: '',
  local: '',
  utc: ''
})

const dateInput = ref('')
const unixOutput = ref('')

let interval: number

onMounted(() => {
  interval = window.setInterval(() => {
    currentUnix.value = Math.floor(Date.now() / 1000)
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})

const convertUnixToDate = () => {
  if (!unixInput.value) return
  const timestamp = parseInt(unixInput.value) * 1000
  const date = new Date(timestamp)
  dateOutput.value = {
    iso: date.toISOString(),
    local: format(date, 'yyyy-MM-dd HH:mm:ss'),
    utc: date.toUTCString()
  }
}

const convertDateToUnix = () => {
  if (!dateInput.value) return
  const timestamp = new Date(dateInput.value).getTime()
  unixOutput.value = Math.floor(timestamp / 1000).toString()
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

// Watch for input changes to ensure conversion happens after v-model updates
watch(unixInput, convertUnixToDate)
watch(dateInput, convertDateToUnix)
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Current Unix Timestamp</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-2">
          <Input readonly :model-value="currentUnix" class="font-mono text-2xl font-bold" />
          <Button variant="outline" size="icon" @click="copyToClipboard(currentUnix.toString())">
            <Copy class="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>

    <div class="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Unix to Date</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label>Unix Timestamp</Label>
            <Input v-model="unixInput" placeholder="1234567890" />
          </div>
          <div v-if="dateOutput.iso" class="space-y-4">
            <div class="space-y-2">
              <Label>ISO 8601</Label>
              <div class="flex gap-2">
                <Input readonly :model-value="dateOutput.iso" />
                <Button variant="outline" size="icon" @click="copyToClipboard(dateOutput.iso)">
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div class="space-y-2">
              <Label>Local</Label>
              <div class="flex gap-2">
                <Input readonly :model-value="dateOutput.local" />
                <Button variant="outline" size="icon" @click="copyToClipboard(dateOutput.local)">
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div class="space-y-2">
              <Label>UTC</Label>
              <div class="flex gap-2">
                <Input readonly :model-value="dateOutput.utc" />
                <Button variant="outline" size="icon" @click="copyToClipboard(dateOutput.utc)">
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date to Unix</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label>Date/Time</Label>
            <Input type="datetime-local" v-model="dateInput" />
          </div>
          <div v-if="unixOutput" class="space-y-2">
            <Label>Unix Timestamp</Label>
            <div class="flex gap-2">
              <Input readonly :model-value="unixOutput" class="font-mono" />
              <Button variant="outline" size="icon" @click="copyToClipboard(unixOutput)">
                <Copy class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
