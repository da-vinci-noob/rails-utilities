<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useSnippets, listHistory, recordToolHistory, type WorkspaceSnippet } from '@/lib/workspace'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bookmark, History, Trash2 } from 'lucide-vue-next'

const props = defineProps<{ tool: string; input: string; output: string }>()
const emit = defineEmits<{ load: [snippet: WorkspaceSnippet] }>()
const { snippets, save, remove } = useSnippets(props.tool)
const history = ref(listHistory(props.tool))
let historyTimer: ReturnType<typeof setTimeout> | undefined

watch(() => [props.input, props.output], () => {
  clearTimeout(historyTimer)
  historyTimer = setTimeout(() => {
    recordToolHistory(props.tool, props.input, props.output)
    history.value = listHistory(props.tool)
  }, 800)
})
onUnmounted(() => clearTimeout(historyTimer))
function saveCurrent() {
  if (!props.input.trim()) return
  const name = window.prompt('Name this snippet')?.trim()
  if (name) save(name, props.input, props.output)
}

function loadSnippet(snippet: WorkspaceSnippet) {
  emit('load', snippet)
}
</script>

<template>
  <Card class="shrink-0">
    <CardHeader class="flex-row items-center justify-between space-y-0 py-3">
      <CardTitle class="flex items-center gap-2 text-sm"><Bookmark class="h-4 w-4" /> Saved snippets</CardTitle>
      <Button size="sm" variant="outline" :disabled="!input.trim()" @click="saveCurrent">Save current</Button>
    </CardHeader>
    <CardContent class="space-y-3 pt-0">
      <div v-if="snippets.length" class="flex flex-wrap gap-2">
        <div v-for="snippet in snippets" :key="snippet.id" class="group flex items-center gap-1 rounded-md border bg-muted/40 pl-3 text-sm">
          <button class="py-1.5 hover:text-primary" @click="loadSnippet(snippet)">{{ snippet.name }}</button>
          <button class="p-1.5 text-muted-foreground hover:text-destructive" :aria-label="`Delete ${snippet.name}`" @click="remove(snippet.id)"><Trash2 class="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <p v-else class="text-xs text-muted-foreground">Save useful inputs for quick reuse. Stored only in this browser.</p>
      <div v-if="history.length" class="border-t pt-3">
        <p class="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground"><History class="h-3.5 w-3.5" /> Recent history</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="entry in history.slice(0, 5)" :key="entry.id" class="max-w-full truncate rounded-md border px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary" @click="loadSnippet(entry)">
            {{ entry.input.slice(0, 32) }}{{ entry.input.length > 32 ? '…' : '' }}
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
