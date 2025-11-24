<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
</script>

<template>
  <div class="p-4 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>PHPUnserializer</CardTitle>
        <CardDescription>Language-specific conversion tool</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="p-4 bg-muted rounded-md text-center">
          <p class="text-muted-foreground">This utility requires language-specific parsing.</p>
          <p class="text-muted-foreground text-sm mt-2">Implementation coming soon.</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>