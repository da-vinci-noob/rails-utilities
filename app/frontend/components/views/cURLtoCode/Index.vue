<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-vue-next'

const curlInput = ref(`curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token123" \\
  -d '{"name": "John", "email": "john@example.com"}'`)

const outputLang = ref('fetch')

interface ParsedCurl {
  method: string
  url: string
  headers: Record<string, string>
  data: string | null
}

const parseCurl = (curl: string): ParsedCurl => {
  const result: ParsedCurl = { method: 'GET', url: '', headers: {}, data: null }

  // Normalize the command (remove line continuations)
  const normalized = curl
    .replace(/\\\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Extract URL
  const urlMatch =
    normalized.match(/curl\s+(?:[^'"\s]+\s+)*['"]?(https?:\/\/[^\s'"]+)['"]?/) ||
    normalized.match(/curl\s+['"]?(https?:\/\/[^\s'"]+)['"]?/)
  if (urlMatch) result.url = urlMatch[1]

  // Extract method
  const methodMatch = normalized.match(/-X\s+(\w+)/)
  if (methodMatch) result.method = methodMatch[1].toUpperCase()

  // Extract headers
  const headerRegex = /-H\s+['"]([^:]+):\s*([^'"]+)['"]/g
  let headerMatch
  while ((headerMatch = headerRegex.exec(normalized)) !== null) {
    result.headers[headerMatch[1]] = headerMatch[2]
  }

  // Extract data
  const dataMatch =
    normalized.match(/-d\s+['"](.+?)['"](?:\s|$)/) ||
    normalized.match(/--data\s+['"](.+?)['"](?:\s|$)/) ||
    normalized.match(/--data-raw\s+['"](.+?)['"](?:\s|$)/)
  if (dataMatch) {
    result.data = dataMatch[1]
    if (!methodMatch) result.method = 'POST'
  }

  return result
}

const generateFetch = (parsed: ParsedCurl): string => {
  const options: string[] = []

  if (parsed.method !== 'GET') {
    options.push(`  method: '${parsed.method}'`)
  }

  if (Object.keys(parsed.headers).length > 0) {
    const headers = Object.entries(parsed.headers)
      .map(([k, v]) => `    '${k}': '${v}'`)
      .join(',\n')
    options.push(`  headers: {\n${headers}\n  }`)
  }

  if (parsed.data) {
    options.push(`  body: JSON.stringify(${parsed.data})`)
  }

  const optionsStr = options.length > 0 ? `, {\n${options.join(',\n')}\n}` : ''

  return `fetch('${parsed.url}'${optionsStr})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
}

const generateAxios = (parsed: ParsedCurl): string => {
  const config: string[] = [`  url: '${parsed.url}'`]
  config.push(`  method: '${parsed.method.toLowerCase()}'`)

  if (Object.keys(parsed.headers).length > 0) {
    const headers = Object.entries(parsed.headers)
      .map(([k, v]) => `    '${k}': '${v}'`)
      .join(',\n')
    config.push(`  headers: {\n${headers}\n  }`)
  }

  if (parsed.data) {
    config.push(`  data: ${parsed.data}`)
  }

  return `axios({\n${config.join(',\n')}\n})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`
}

const generateNode = (parsed: ParsedCurl): string => {
  const urlObj = `new URL('${parsed.url}')`
  const options = [
    `  hostname: url.hostname`,
    `  port: url.port || (url.protocol === 'https:' ? 443 : 80)`,
    `  path: url.pathname + url.search`,
    `  method: '${parsed.method}'`
  ]

  if (Object.keys(parsed.headers).length > 0) {
    const headers = Object.entries(parsed.headers)
      .map(([k, v]) => `    '${k}': '${v}'`)
      .join(',\n')
    options.push(`  headers: {\n${headers}\n  }`)
  }

  return `const https = require('https');
const url = ${urlObj};

const options = {
${options.join(',\n')}
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});

req.on('error', (e) => console.error(e));
${parsed.data ? `req.write(JSON.stringify(${parsed.data}));` : ''}
req.end();`
}

const output = computed(() => {
  try {
    const parsed = parseCurl(curlInput.value)
    if (!parsed.url) return '// Could not parse URL from cURL command'

    switch (outputLang.value) {
      case 'fetch':
        return generateFetch(parsed)
      case 'axios':
        return generateAxios(parsed)
      case 'node':
        return generateNode(parsed)
      default:
        return generateFetch(parsed)
    }
  } catch (e) {
    return '// Error parsing cURL command'
  }
})

const copyToClipboard = () => {
  navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>cURL to Code</CardTitle>
        <CardDescription>Convert cURL commands to JavaScript code</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>cURL Command</Label>
          <Textarea
            v-model="curlInput"
            placeholder="Paste cURL command here..."
            class="font-mono text-sm h-32 resize-none"
          />
        </div>

        <div class="space-y-2">
          <Label>Output Language</Label>
          <div class="flex gap-2">
            <Button
              v-for="lang in ['fetch', 'axios', 'node']"
              :key="lang"
              :variant="outputLang === lang ? 'default' : 'outline'"
              size="sm"
              @click="outputLang = lang"
            >
              {{ lang === 'fetch' ? 'Fetch API' : lang === 'axios' ? 'Axios' : 'Node.js' }}
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label>Generated Code</Label>
            <Button variant="ghost" size="sm" @click="copyToClipboard">
              <Copy class="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <Textarea :model-value="output" readonly class="font-mono text-sm h-64 resize-none bg-muted" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
