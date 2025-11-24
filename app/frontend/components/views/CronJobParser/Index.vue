<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import cronstrue from 'cronstrue'

const cronExpression = ref('*/5 * * * *')

const description = computed(() => {
  if (!cronExpression.value) return ''
  try {
    return cronstrue.toString(cronExpression.value)
  } catch (e) {
    return 'Invalid Cron Expression'
  }
})
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Cron Job Parser</CardTitle>
        <CardDescription>Explain cron expressions in plain English</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Cron Expression</Label>
          <Input v-model="cronExpression" placeholder="*/5 * * * *" class="font-mono" />
        </div>
        
        <div class="p-6 bg-muted rounded-md text-center">
            <div class="text-2xl font-semibold text-primary">
                {{ description }}
            </div>
        </div>

        <div class="text-sm text-muted-foreground">
            <p>Common Examples:</p>
            <ul class="list-disc list-inside mt-2 space-y-1">
                <li><code class="bg-muted px-1 rounded">*/5 * * * *</code> - Every 5 minutes</li>
                <li><code class="bg-muted px-1 rounded">0 0 * * *</code> - At midnight every day</li>
                <li><code class="bg-muted px-1 rounded">0 9 * * 1</code> - At 9:00 AM on Monday</li>
            </ul>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
