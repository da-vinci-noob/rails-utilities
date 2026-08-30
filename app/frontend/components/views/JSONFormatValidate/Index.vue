<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/lib/useCopy'
import { shareUrl } from '@/lib/shareUrl'
const input = ref('')
const output = ref('')
const error = ref('')
const autoMod = ref('format')

function runParse(mode: string) {
  error.value = ''
  if (!input.value) {
    output.value = ''
    return
  }
  try {
    const parsed = JSON.parse(input.value)
    output.value = mode === 'minify' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2)
  } catch (e: any) {
    error.value = e.message
  }
}

const formatJson = () => runParse('format')
const minifyJson = () => runParse('minify')

const validateJson = () => {
  error.value = ''
  try {
    JSON.parse(input.value)
    output.value = '✅ Valid JSON'
  } catch (e: any) {
    output.value = `❌ Invalid JSON: ${e.message}`
  }
}

const { state: shareState, copy: copyShare } = useCopy()

function shareJson() {
  copyShare(shareUrl({ input: input.value }))
}

onMounted(() => {
  const sharedInput = new URLSearchParams(location.search).get('input')
  if (sharedInput) input.value = sharedInput
})


watch(input, () => {
  if (!input.value) {
    output.value = ''
    error.value = ''
    return
  }
  runParse(autoMod.value === 'minify' ? 'minify' : 'format')
})
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Input JSON"
    input-placeholder="Paste JSON..."
    :error="error"
  >
    <template #toolbar>
      <Button @click="formatJson">Format</Button>
      <Button @click="minifyJson">Minify</Button>
      <Button @click="validateJson">Validate</Button>
      <Button @click="shareJson">{{ shareState === 'copied' ? 'Copied URL!' : 'Share URL' }}</Button>
      <label class="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" v-model="autoMod" true-value="minify" false-value="format" class="h-4 w-4" />
        Live-minify
      </label>
    </template>
  </TextTransformLayout>
</template>
