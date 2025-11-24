<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, AlertCircle } from 'lucide-vue-next'

const domain = ref('example.com')
const result = ref<Record<string, string[]> | null>(null)
const loading = ref(false)
const error = ref('')

const lookup = async () => {
  if (!domain.value.trim()) return

  loading.value = true
  error.value = ''
  result.value = null

  try {
    // Use DNS-over-HTTPS (DoH) via Cloudflare's public API
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain.value)}&type=A`,
      { headers: { Accept: 'application/dns-json' } }
    )

    if (!response.ok) throw new Error('DNS lookup failed')

    const data = await response.json()

    const records: Record<string, string[]> = {}

    if (data.Answer) {
      for (const answer of data.Answer) {
        const type = getRecordType(answer.type)
        if (!records[type]) records[type] = []
        records[type].push(answer.data)
      }
    }

    // Also fetch other record types
    const types = ['AAAA', 'MX', 'TXT', 'NS', 'CNAME']
    for (const type of types) {
      try {
        const res = await fetch(
          `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain.value)}&type=${type}`,
          { headers: { Accept: 'application/dns-json' } }
        )
        const typeData = await res.json()
        if (typeData.Answer) {
          for (const answer of typeData.Answer) {
            const recordType = getRecordType(answer.type)
            if (!records[recordType]) records[recordType] = []
            if (!records[recordType].includes(answer.data)) {
              records[recordType].push(answer.data)
            }
          }
        }
      } catch {}
    }

    result.value = Object.keys(records).length > 0 ? records : null
    if (!result.value) error.value = 'No DNS records found'
  } catch (e: any) {
    error.value = e.message || 'DNS lookup failed'
  } finally {
    loading.value = false
  }
}

const getRecordType = (type: number): string => {
  const types: Record<number, string> = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    6: 'SOA',
    15: 'MX',
    16: 'TXT',
    28: 'AAAA',
    33: 'SRV',
    257: 'CAA'
  }
  return types[type] || `TYPE${type}`
}
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>DNS Lookup</CardTitle>
        <CardDescription>Look up DNS records for a domain using Cloudflare DNS-over-HTTPS</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex gap-2">
          <div class="flex-1">
            <Input v-model="domain" placeholder="Enter domain name..." @keyup.enter="lookup" />
          </div>
          <Button @click="lookup" :disabled="loading || !domain.trim()">
            <Search class="h-4 w-4 mr-2" :class="{ 'animate-pulse': loading }" />
            Lookup
          </Button>
        </div>

        <div
          v-if="error"
          class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md flex items-center gap-2"
        >
          <AlertCircle class="h-4 w-4" />
          {{ error }}
        </div>

        <div v-if="result" class="space-y-4">
          <div v-for="(records, type) in result" :key="type" class="space-y-2">
            <Label class="text-sm font-semibold">{{ type }} Records</Label>
            <div class="bg-muted rounded-md p-3 space-y-1">
              <div v-for="(record, i) in records" :key="i" class="font-mono text-sm break-all">
                {{ record }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="!result && !error && !loading" class="text-center text-muted-foreground py-8">
          Enter a domain name and click Lookup
        </div>
      </CardContent>
    </Card>
  </div>
</template>
