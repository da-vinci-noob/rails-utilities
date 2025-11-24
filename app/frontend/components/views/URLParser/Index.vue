<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const url = ref('https://example.com:8080/path?key=value#hash')

const parsed = computed(() => {
  try {
    const urlObj = new URL(url.value)
    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin,
      params: Array.from(urlObj.searchParams.entries())
    }
  } catch (e) {
    return null
  }
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>URL Parser</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>URL</Label>
          <Input v-model="url" placeholder="Enter URL..." />
        </div>
        <div v-if="parsed" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div><Label>Protocol</Label><Input readonly :model-value="parsed.protocol.replace(':', '')" /></div>
            <div><Label>Hostname</Label><Input readonly :model-value="parsed.hostname" /></div>
            <div><Label>Port</Label><Input readonly :model-value="parsed.port || 'default'" /></div>
            <div><Label>Pathname</Label><Input readonly :model-value="parsed.pathname" /></div>
            <div><Label>Search</Label><Input readonly :model-value="parsed.search" /></div>
            <div><Label>Hash</Label><Input readonly :model-value="parsed.hash" /></div>
            <div class="col-span-2"><Label>Origin</Label><Input readonly :model-value="parsed.origin" /></div>
          </div>
          <div v-if="parsed.params.length" class="space-y-2">
            <Label>Query Parameters</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="[key, value] in parsed.params" :key="key">
                  <TableCell>{{ key }}</TableCell>
                  <TableCell>{{ value }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div v-else class="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          Invalid URL
        </div>
      </CardContent>
    </Card>
  </div>
</template>
