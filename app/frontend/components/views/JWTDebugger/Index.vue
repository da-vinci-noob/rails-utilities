<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { jwtDecode } from 'jwt-decode'

const token = ref('')
const decoded = computed(() => {
  if (!token.value) return null
  try {
    return jwtDecode(token.value)
  } catch (e) {
    return { error: 'Invalid JWT' }
  }
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader><CardTitle>JWT Debugger</CardTitle></CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>JWT Token</Label>
          <Textarea v-model="token" placeholder="Paste JWT..." class="h-32 font-mono" />
        </div>
        <div v-if="decoded" class="space-y-2">
          <Label>Decoded</Label>
          <pre class="p-4 bg-muted rounded-md overflow-auto">{{ JSON.stringify(decoded, null, 2) }}</pre>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
