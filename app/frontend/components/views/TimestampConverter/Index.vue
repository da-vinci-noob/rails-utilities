<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCopy } from '@/lib/useCopy'
import { shareUrl } from '@/lib/shareUrl'

const timestamp = ref('')
const dateInput = ref('')
const error = ref('')
const { state: copyState, copy } = useCopy()

const timestampDate = computed(() => {
  if (!timestamp.value.trim()) return null
  const numeric = Number(timestamp.value.trim())
  if (!Number.isFinite(numeric)) return null
  return new Date(Math.abs(numeric) < 1e11 ? numeric * 1000 : numeric)
})

const dateResult = computed(() => {
  if (!timestampDate.value || Number.isNaN(timestampDate.value.getTime())) return null
  return {
    iso: timestampDate.value.toISOString(),
    local: timestampDate.value.toLocaleString(),
    utc: timestampDate.value.toUTCString(),
    seconds: Math.floor(timestampDate.value.getTime() / 1000),
    milliseconds: timestampDate.value.getTime()
  }
})

const relative = computed(() => {
  if (!timestampDate.value) return ''
  const delta = timestampDate.value.getTime() - Date.now()
  const seconds = Math.round(Math.abs(delta) / 1000)
  const units: [number, string][] = [[31536000, 'year'], [2592000, 'month'], [86400, 'day'], [3600, 'hour'], [60, 'minute']]
  const unit = units.find(([size]) => seconds >= size) ?? [1, 'second']
  const value = Math.max(1, Math.round(seconds / unit[0]))
  return `${value} ${unit[1]}${value === 1 ? '' : 's'} ${delta >= 0 ? 'from now' : 'ago'}`
})

function convertDate() {
  error.value = ''
  const parsed = new Date(dateInput.value)
  if (!dateInput.value.trim() || Number.isNaN(parsed.getTime())) {
    error.value = 'Enter a valid ISO date or date/time.'
    return
  }
  timestamp.value = String(Math.floor(parsed.getTime() / 1000))
}

function setNow() {
  error.value = ''
  timestamp.value = String(Math.floor(Date.now() / 1000))
  dateInput.value = new Date().toISOString().slice(0, 16)
}

function shareTimestamp() {
  copy(shareUrl({ timestamp: timestamp.value }))
}

function swap() {
  dateInput.value = timestampDate.value?.toISOString() ?? ''
  timestamp.value = ''
}

onMounted(() => {
  const value = new URLSearchParams(location.search).get('timestamp')
  if (value) timestamp.value = value
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-4 p-4">
    <Card>
      <CardHeader><CardTitle>Unix timestamp converter</CardTitle></CardHeader>
      <CardContent class="space-y-5">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="timestamp">Unix timestamp</Label>
            <Input id="timestamp" v-model="timestamp" inputmode="numeric" placeholder="1700000000" />
            <p class="text-xs text-muted-foreground">Seconds or milliseconds accepted.</p>
          </div>
          <div class="space-y-2">
            <Label for="date">Date and time</Label>
            <Input id="date" v-model="dateInput" type="datetime-local" />
            <Button variant="outline" size="sm" @click="convertDate">Convert date to timestamp</Button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button @click="setNow">Now</Button>
          <Button variant="outline" @click="swap">Swap</Button>
          <Button v-if="dateResult" variant="outline" @click="copy(dateResult.iso)">
            {{ copyState === 'copied' ? 'Copied!' : 'Copy ISO' }}
          </Button>
          <Button v-if="dateResult" variant="outline" @click="shareTimestamp">
            {{ copyState === 'copied' ? 'Copied URL!' : 'Share URL' }}
          </Button>
        </div>
        <div v-if="dateResult" class="grid gap-3 rounded-lg border bg-muted/40 p-4 sm:grid-cols-2">
          <div><span class="text-xs text-muted-foreground">ISO 8601</span><p class="font-mono text-sm">{{ dateResult.iso }}</p></div>
          <div><span class="text-xs text-muted-foreground">Local time</span><p class="text-sm">{{ dateResult.local }}</p></div>
          <div><span class="text-xs text-muted-foreground">UTC</span><p class="text-sm">{{ dateResult.utc }}</p></div>
          <div><span class="text-xs text-muted-foreground">Relative</span><p class="text-sm">{{ relative }}</p></div>
          <div><span class="text-xs text-muted-foreground">Unix seconds</span><p class="font-mono text-sm">{{ dateResult.seconds }}</p></div>
          <div><span class="text-xs text-muted-foreground">Unix milliseconds</span><p class="font-mono text-sm">{{ dateResult.milliseconds }}</p></div>
        </div>
        <p v-if="timestamp && !dateResult" class="text-sm text-destructive">Enter a valid numeric timestamp.</p>
        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      </CardContent>
    </Card>
  </div>
</template>
