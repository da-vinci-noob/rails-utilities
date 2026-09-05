<script setup lang="ts">
import { ref, computed } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import SavedSnippets from '@/components/addons/SavedSnippets.vue'
import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'
import { useCopy } from '@/lib/useCopy'
import { shareUrl } from '@/lib/shareUrl'

const input = ref('')
const output = ref('')
const error = ref('')
const { state: shareState, copy: copyShare } = useCopy()

// Statistics computed from input
const stats = computed(() => {
  if (!input.value) {
    return {
      words: 0,
      characters: 0,
      sentences: 0,
      paragraphs: 0,
      avgWordLength: 0
    }
  }

  const text = input.value.trim()
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  
  const totalWordLength = words.reduce((sum, word) => sum + word.length, 0)
  const avgWordLength = words.length > 0 ? (totalWordLength / words.length).toFixed(1) : 0

  return {
    words: words.length,
    characters: text.length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    avgWordLength: Number(avgWordLength)
  }
})

function analyze() {
  error.value = ''
  if (!input.value) {
    output.value = ''
    return
  }

  try {
    const analysis = [
      `Text Analysis Results`,
      `${'='.repeat(40)}`,
      ``,
      `Words: ${stats.value.words}`,
      `Characters: ${stats.value.characters}`,
      `Sentences: ${stats.value.sentences}`,
      `Paragraphs: ${stats.value.paragraphs}`,
      `Average Word Length: ${stats.value.avgWordLength} characters`,
      ``,
      `${'='.repeat(40)}`,
      `Reading Time: ~${Math.ceil(stats.value.words / 200)} minute(s)`,
      `Speaking Time: ~${Math.ceil(stats.value.words / 150)} minute(s)`
    ].join('\n')

    output.value = analysis
  } catch (e: any) {
    error.value = e.message
  }
}

function share() {
  copyShare(shareUrl({ input: input.value }))
}
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 p-4">
    <SavedSnippets 
      tool="Text Analyzer (Example)" 
      :input="input" 
      :output="output" 
      @load="input = $event.input; output = $event.output" 
    />
    
    <TextTransformLayout
      v-model:input="input"
      v-model:output="output"
      input-label="Text Input"
      input-placeholder="Enter or paste your text here..."
      :error="error"
    >
      <template #toolbar>
        <Button @click="analyze">Analyze Text</Button>
        <Button variant="outline" @click="share">
          {{ shareState === 'copied' ? 'Copied URL!' : 'Share URL' }}
        </Button>
      </template>
    </TextTransformLayout>
    
    <!-- Live statistics display -->
    <div v-if="input" class="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg">
      <div class="text-center">
        <div class="text-2xl font-bold">{{ stats.words }}</div>
        <div class="text-sm text-muted-foreground">Words</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">{{ stats.characters }}</div>
        <div class="text-sm text-muted-foreground">Characters</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">{{ stats.sentences }}</div>
        <div class="text-sm text-muted-foreground">Sentences</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">{{ stats.paragraphs }}</div>
        <div class="text-sm text-muted-foreground">Paragraphs</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">{{ stats.avgWordLength }}</div>
        <div class="text-sm text-muted-foreground">Avg Word Length</div>
      </div>
    </div>
    
    <div class="mt-auto pt-4 border-t">
      <UtilityFeedback utility-title="Text Analyzer (Example)" />
    </div>
  </div>
</template>
