<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import SavedSnippets from '@/components/addons/SavedSnippets.vue'
import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'

const definitions = {
  Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 },
  Mass: { kg: 1, g: 0.001, lb: 0.45359237, oz: 0.028349523125 },
  Temperature: { '°C': 1, '°F': 1, K: 1 },
  Data: { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 }
} as const

type Category = keyof typeof definitions
const category = ref<Category>('Length')
const fromUnit = ref('m')
const toUnit = ref('km')
const fromValue = ref('1')
const toValue = ref('')
let syncing = false

const units = computed(() => Object.keys(definitions[category.value]))

function convertTemperature(value: number, from: string, to: string) {
  let celsius = from === '°C' ? value : from === '°F' ? (value - 32) * 5 / 9 : value - 273.15
  return to === '°C' ? celsius : to === '°F' ? celsius * 9 / 5 + 32 : celsius + 273.15
}

function convert(value: number, from: string, to: string) {
  if (category.value === 'Temperature') return convertTemperature(value, from, to)
  const factors = definitions[category.value] as Record<string, number>
  return value * factors[from] / factors[to]
}

function format(value: number) {
  if (!Number.isFinite(value)) return ''
  return Number(value.toPrecision(7)).toString()
}

function updateFrom() {
  if (syncing) return
  syncing = true
  toValue.value = format(convert(Number(fromValue.value), fromUnit.value, toUnit.value))
  syncing = false
}
function updateTo() {
  if (syncing) return
  syncing = true
  fromValue.value = format(convert(Number(toValue.value), toUnit.value, fromUnit.value))
  syncing = false
}
function swap() {
  const oldUnit = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = oldUnit
  updateFrom()
}
function changeCategory() {
  const next = units.value
  fromUnit.value = next[0]
  toUnit.value = next[1] ?? next[0]
  fromValue.value = '1'
  updateFrom()
}

watch(fromValue, updateFrom, { flush: 'sync' })
watch(toValue, updateTo, { flush: 'sync' })
watch([fromUnit, toUnit], updateFrom, { flush: 'sync' })
watch(category, changeCategory)
updateFrom()
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4 p-4">
    <SavedSnippets tool="Unit Converter" :input="`${fromValue} ${fromUnit}`" :output="`${toValue} ${toUnit}`" @load="fromValue = $event.input.split(' ')[0] ?? fromValue" />
    <Card>
      <CardHeader><CardTitle>Unit converter</CardTitle></CardHeader>
      <CardContent class="space-y-5">
        <div class="flex flex-wrap gap-2">
          <Button v-for="name in Object.keys(definitions)" :key="name" :variant="category === name ? 'default' : 'outline'" @click="category = name as Category">{{ name }}</Button>
        </div>
        <div class="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div class="space-y-2"><Label for="from-value">From</Label><Input id="from-value" v-model="fromValue" type="number" step="any" /><select v-model="fromUnit" class="h-10 w-full rounded-md border bg-background px-3 text-sm"><option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option></select></div>
          <Button variant="outline" @click="swap">Swap</Button>
          <div class="space-y-2"><Label for="to-value">To</Label><Input id="to-value" v-model="toValue" type="number" step="any" /><select v-model="toUnit" class="h-10 w-full rounded-md border bg-background px-3 text-sm"><option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option></select></div>
        </div>
        <p class="text-sm text-muted-foreground">Values update instantly. Precision is limited to seven significant digits.</p>
      </CardContent>
    </Card>
    <div class="mt-auto pt-4 border-t">
      <UtilityFeedback utility-title="Unit Converter" />
    </div>
  </div>
</template>
