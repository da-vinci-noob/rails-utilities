<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const mode = ref<'focus' | 'short' | 'long'>('focus')
const presets = { focus: 25, short: 5, long: 15 }
const minutes = ref(presets.focus)
const remaining = ref(minutes.value * 60)
const running = ref(false)
const sessions = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const totalSeconds = computed(() => minutes.value * 60)
const progress = computed(() => totalSeconds.value ? (totalSeconds.value - remaining.value) / totalSeconds.value : 0)
const ring = computed(() => 2 * Math.PI * 45)
const dashOffset = computed(() => ring.value * (1 - progress.value))
const display = computed(() => `${String(Math.floor(remaining.value / 60)).padStart(2, '0')}:${String(remaining.value % 60).padStart(2, '0')}`)

function beep() {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextClass) return
  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.frequency.value = 740
  gain.gain.value = 0.08
  oscillator.connect(gain).connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.18)
}

function nextPhase() {
  beep()
  if (mode.value === 'focus') {
    sessions.value += 1
    mode.value = sessions.value % 4 === 0 ? 'long' : 'short'
  } else mode.value = 'focus'
  minutes.value = presets[mode.value]
  remaining.value = totalSeconds.value
}

function tick() {
  if (remaining.value > 0) remaining.value -= 1
  else nextPhase()
}

function toggle() {
  running.value = !running.value
  if (running.value) timer = setInterval(tick, 1000)
  else clearInterval(timer)
}

function reset() {
  running.value = false
  clearInterval(timer)
  minutes.value = presets[mode.value]
  remaining.value = minutes.value * 60
}

function setMode(next: 'focus' | 'short' | 'long') {
  mode.value = next
  minutes.value = presets[next]
  reset()
}

function setCustom() {
  if (minutes.value > 0 && minutes.value <= 120) {
    running.value = false
    clearInterval(timer)
    remaining.value = minutes.value * 60
  }
}

watch([running, display], () => {
  document.title = running.value ? `${display.value} · Rails Utilities` : 'Rails Utilities'
})
onUnmounted(() => {
  clearInterval(timer)
  document.title = 'Rails Utilities'
})
</script>

<template>
  <div class="mx-auto max-w-lg p-4">
    <Card>
      <CardHeader><CardTitle>Pomodoro focus timer</CardTitle></CardHeader>
      <CardContent class="space-y-6 text-center">
        <div class="flex justify-center gap-2">
          <Button :variant="mode === 'focus' ? 'default' : 'outline'" @click="setMode('focus')">Focus · 25m</Button>
          <Button :variant="mode === 'short' ? 'default' : 'outline'" @click="setMode('short')">Short · 5m</Button>
          <Button :variant="mode === 'long' ? 'default' : 'outline'" @click="setMode('long')">Long · 15m</Button>
        </div>
        <div class="relative mx-auto h-64 w-64">
          <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6" class="text-muted" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" class="text-primary transition-all duration-500" :stroke-dasharray="ring" :stroke-dashoffset="dashOffset" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="font-mono text-5xl font-semibold tracking-tight">{{ display }}</div>
            <div class="mt-2 text-sm capitalize text-muted-foreground">{{ mode }} session</div>
          </div>
        </div>
        <div class="flex justify-center gap-2">
          <Button size="lg" @click="toggle">{{ running ? 'Pause' : 'Start' }}</Button>
          <Button size="lg" variant="outline" @click="reset">Reset</Button>
        </div>
        <div class="flex items-end justify-center gap-2">
          <div class="space-y-1 text-left"><Label for="custom-minutes">Custom minutes</Label><Input id="custom-minutes" v-model.number="minutes" type="number" min="1" max="120" class="w-32" @change="setCustom" /></div>
          <span class="pb-2 text-sm text-muted-foreground">Completed focus sessions: <strong>{{ sessions }}</strong></span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
