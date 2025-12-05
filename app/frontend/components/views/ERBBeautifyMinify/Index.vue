<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'
import { FileCode, Minimize2 } from 'lucide-vue-next'
import { html as beautifyHtml } from 'js-beautify'

const input = ref('<div><% if true %><h1>Hello</h1><% end %></div>')
const output = ref('')
const error = ref('')

const beautifyErb = () => {
  error.value = ''
  try {
    let code = input.value
    const erbStore: Map<string, string> = new Map()
    let counter = 0

    code = code.replace(/<%[\s\S]*?%>/g, (match) => {
      const placeholder = `__ERB_${counter++}__`
      erbStore.set(placeholder, match)

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

    code = beautifyHtml(code, {
      indent_size: 2,
      indent_inner_html: true,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      wrap_line_length: 0
    })

    erbStore.forEach((erbTag, placeholder) => {
      code = code.replace(new RegExp(`<div data-erb="${placeholder}">`, 'g'), erbTag)
      code = code.replace(new RegExp(`</div><!-- ${placeholder} -->`, 'g'), erbTag)
      code = code.replace(new RegExp(`<span data-erb="${placeholder}"></span>`, 'g'), erbTag)
    })

    output.value = code
  } catch (e: any) {
    error.value = e.message
  }
}

const minifyErb = () => {
  error.value = ''
  try {
    output.value = input.value
      .replace(/\>[\r\n ]+\</g, '><')
      .replace(/(<.*?>)|\s+/g, (m, $1) => ($1 ? $1 : ' '))
      .trim()
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <TextTransformLayout
    v-model:input="input"
    v-model:output="output"
    input-label="Input ERB"
    input-placeholder="Paste ERB here..."
    output-placeholder="Result will appear here..."
    :error="error"
  >
    <template #toolbar>
      <Button @click="beautifyErb">
        <FileCode class="mr-2 h-4 w-4" />
        Beautify
      </Button>
      <Button variant="secondary" @click="minifyErb">
        <Minimize2 class="mr-2 h-4 w-4" />
        Minify
      </Button>
    </template>
  </TextTransformLayout>
</template>
