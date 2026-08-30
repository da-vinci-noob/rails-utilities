<script setup lang="ts">
import { computed, ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/lib/useCopy'
import { Check, Copy, Eye, EyeOff, X } from 'lucide-vue-next'

const password = ref('')
const showPassword = ref(false)
const guessesPerSecond = ref(10_000_000_000)

const guessOptions = [
  { label: '10 /sec — throttled online attack', value: 10 },
  { label: '10,000 /sec — unthrottled online attack', value: 10_000 },
  { label: '10 billion /sec — offline GPU attack', value: 10_000_000_000 },
  { label: '100 billion /sec — well-funded attacker', value: 100_000_000_000 }
]

const COMMON_SEQUENCE =
  /(.)\1{2,}|(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)|qwerty|asdf|zxcv|password|letmein/i

interface Check {
  label: string
  weight: number
  pass: (pw: string) => boolean
}

const checks: Check[] = [
  { label: 'At least 8 characters', weight: 15, pass: (pw) => pw.length >= 8 },
  { label: 'At least 12 characters', weight: 15, pass: (pw) => pw.length >= 12 },
  { label: 'At least 16 characters', weight: 10, pass: (pw) => pw.length >= 16 },
  {
    label: 'Uppercase and lowercase letters',
    weight: 15,
    pass: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw)
  },
  { label: 'At least one digit', weight: 15, pass: (pw) => /\d/.test(pw) },
  {
    label: 'At least one symbol',
    weight: 15,
    pass: (pw) => /[^a-zA-Z0-9]/.test(pw)
  },
  {
    label: 'No common sequences (aaa, 123, qwerty...)',
    weight: 15,
    pass: (pw) => pw.length === 0 || !COMMON_SEQUENCE.test(pw)
  }
]

const results = computed(() =>
  checks.map((check) => ({ label: check.label, weight: check.weight, ok: check.pass(password.value) }))
)

const score = computed(() => {
  if (!password.value) return 0
  return results.value.reduce((total, r) => total + (r.ok ? r.weight : 0), 0)
})

const poolSize = computed(() => {
  const pw = password.value
  let pool = 0
  if (/[a-z]/.test(pw)) pool += 26
  if (/[A-Z]/.test(pw)) pool += 26
  if (/\d/.test(pw)) pool += 10
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32
  return pool
})

const crackTime = computed(() => {
  const pw = password.value
  if (!pw || poolSize.value === 0) return '—'
  const seconds = Math.pow(poolSize.value, pw.length) / 2 / guessesPerSecond.value
  return formatDuration(seconds)
})

function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '—'
  if (seconds < 1) return 'instantly'
  const units: Array<[number, string]> = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [365, 'day'],
    [Number.POSITIVE_INFINITY, 'year']
  ]
  let value = seconds
  let unit = 'second'
  for (const [factor, name] of units) {
    if (value < factor) {
      unit = name
      break
    }
    value /= factor
    unit = name
  }
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded.toLocaleString()} ${unit}${rounded === 1 ? '' : 's'}`
}

const barColor = computed(() => {
  const s = score.value
  if (s < 35) return 'bg-red-500'
  if (s < 70) return 'bg-yellow-500'
  return 'bg-green-500'
})

const strengthLabel = computed(() => {
  const s = score.value
  if (!password.value) return 'Enter a password'
  if (s < 35) return 'Weak'
  if (s < 70) return 'Fair'
  if (s < 100) return 'Strong'
  return 'Very strong'
})

const { state: copyState, copy } = useCopy()
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Password Strength</CardTitle>
        <CardDescription>Analyze password strength with live checks and crack-time estimates</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="password">Password</Label>
          <div class="flex gap-2">
            <Input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Type a password to analyze"
              class="font-mono"
              autocomplete="off"
            />
            <Button
              variant="outline"
              @click="showPassword = !showPassword"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              <Eye v-if="!showPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </Button>
            <Button variant="outline" @click="copy(password)" :disabled="!password">
              <Copy class="mr-2 h-4 w-4" />
              {{ copyState === 'copied' ? 'Copied' : 'Copy' }}
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>{{ strengthLabel }}</span>
            <span class="font-mono">{{ score }}/100</span>
          </div>
          <div class="h-2 w-full rounded bg-muted overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :class="barColor"
              :style="{ width: `${score}%` }"
            />
          </div>
        </div>

        <div class="space-y-1">
          <Label>Checks</Label>
          <ul class="space-y-1">
            <li v-for="r in results" :key="r.label" class="flex items-center gap-2 text-sm">
              <Check v-if="r.ok && password" class="h-4 w-4 text-green-500" />
              <X v-else class="h-4 w-4 text-red-500" />
              <span :class="r.ok && password ? '' : 'text-muted-foreground'">{{ r.label }}</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <Label for="guesses">Crack-time estimate</Label>
          <select
            id="guesses"
            v-model="guessesPerSecond"
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option v-for="opt in guessOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <p class="text-sm">
            Time to crack: <span class="font-mono font-medium">{{ crackTime }}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
