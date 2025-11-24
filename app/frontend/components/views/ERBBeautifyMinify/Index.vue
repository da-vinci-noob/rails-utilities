<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy, FileCode, Minimize2 } from 'lucide-vue-next'
import { html as beautifyHtml } from 'js-beautify'

const inputErb = ref('<div><% if true %><h1>Hello</h1><% end %></div>')
const outputErb = ref('')
const error = ref('')

const beautifyErb = () => {
  error.value = ''
  try {
    let code = inputErb.value
    const erbStore: Map<string, string> = new Map()
    let counter = 0

    // Replace all ERB tags with unique placeholders
    code = code.replace(/<%[\s\S]*?%>/g, (match) => {
      const placeholder = `__ERB_${counter++}__`
      erbStore.set(placeholder, match)

      // Determine if this is a block opener, closer, or inline
      if (
        /<%[-]?\s*(if|unless|case|while|until|for|begin)\b/.test(match) ||
        /<%[-]?\s*.*\b(do)\s*(\|.*\|)?\s*[-]?%>/.test(match)
      ) {
        return `<div data-erb="${placeholder}">`
      } else if (/<%[-]?\s*end\s*[-]?%>/.test(match)) {
        return `</div><!-- ${placeholder} -->`
      } else if (/<%[-]?\s*(else|elsif|when|rescue|ensure)\b/.test(match)) {
        return `</div><div data-erb="${placeholder}">`
      } else {
        return `<span data-erb="${placeholder}"></span>`
      }
    })

    // Beautify as HTML
    code = beautifyHtml(code, {
      indent_size: 2,
      indent_inner_html: true,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      wrap_line_length: 0
    })

    // Restore ERB tags
    erbStore.forEach((erbTag, placeholder) => {
      // Restore block openers
      code = code.replace(new RegExp(`<div data-erb="${placeholder}">`, 'g'), erbTag)
      // Restore block closers
      code = code.replace(new RegExp(`</div><!-- ${placeholder} -->`, 'g'), erbTag)
      // Restore inline tags
      code = code.replace(new RegExp(`<span data-erb="${placeholder}"></span>`, 'g'), erbTag)
    })

    outputErb.value = code
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyErb = () => {
  error.value = ''
  try {
    outputErb.value = inputErb.value
      .replace(/\>[\r\n ]+\</g, '><')
      .replace(/(<.*?>)|\s+/g, (m, $1) => ($1 ? $1 : ' '))
      .trim()
  } catch (e: any) {
    error.value = e.message
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(outputErb.value)
}
</script>

<template>
  <div class="p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex gap-4 mb-4">
      <Button @click="beautifyErb">
        <FileCode class="mr-2 h-4 w-4" />
        Beautify
      </Button>
      <Button variant="secondary" @click="minifyErb">
        <Minimize2 class="mr-2 h-4 w-4" />
        Minify
      </Button>
    </div>

    <div class="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
      <div class="flex flex-col gap-2 min-h-0">
        <Label>Input ERB</Label>
        <Textarea v-model="inputErb" placeholder="Paste ERB here..." class="flex-1 font-mono resize-none" />
      </div>
      <div class="flex flex-col gap-2 min-h-0">
        <div class="flex justify-between items-center">
          <Label>Output</Label>
          <Button variant="ghost" size="sm" @click="copyToClipboard" :disabled="!outputErb">
            <Copy class="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <Textarea
          v-model="outputErb"
          readonly
          placeholder="Result will appear here..."
          class="flex-1 font-mono resize-none bg-muted"
        />
      </div>
    </div>
    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
      {{ error }}
    </div>
  </div>
</template>
