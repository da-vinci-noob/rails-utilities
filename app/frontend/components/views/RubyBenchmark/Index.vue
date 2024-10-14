<script setup lang="ts">
// Imports
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Variables
const route = useRoute()
const router = useRouter()
const message1 = ref(null)
const message2 = ref(null)
const results = ref({
  code1: { cpu_time: null, real_time: null },
  code2: { cpu_time: null, real_time: null },
  success: false,
  message: ''
})
const buttonActive = ref(true)
const errorMessage = ref('')

// Lifecycles
const currentRoute = computed(() => ({ name: route.name, path: route.path, description: route.meta?.description }))

// Functions
const goBack = () => {
  router.go(-1)
}

// Process Benchmark Function
const submitMessages = async () => {
  try {
    buttonActive.value = false
    const response = await fetch('/process_benchmark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({
        message1: message1.value,
        message2: message2.value
      })
    })
    results.value = await response.json()
  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error
  } finally {
    buttonActive.value = true
  }
}

// Theme Import
// prettier-ignore
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Textarea, Label, Loader2, ArrowLeft } from '@/components/addons/ThemeImport.vue'
</script>

<template>
  <div class="flex items-center">
    <div class="ml-auto mt-2.5">
      <Button size="sm" class="h-7" @click="goBack">
        <ArrowLeft class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Back
        </span>
      </Button>
    </div>
  </div>
  <Card class="mt-2.5">
    <CardHeader>
      <CardTitle>{{ currentRoute.name }}</CardTitle>
      <CardDescription>
        {{ currentRoute.description }}
      </CardDescription>
    </CardHeader>
    <CardContent class="flex sm:flex-row flex-col w-full sm:space-x-5">
      <div class="sm:w-1/2 flex flex-col">
        <Label for="message-2" class="mb-3">Your Code block</Label>
        <Textarea id="message-2" placeholder="Type your block of Code." v-model="message1" />
        <p class="text-sm text-muted-foreground mt-4">
          <span v-if="results.success">
            <p :class="{ 'text-green-400': results.code1.cpu_time < results.code2.cpu_time }">
              CPU Time: {{ parseFloat(results.code1.cpu_time) }}
            </p>
            <p :class="{ 'text-green-400': results.code1.real_time < results.code2.real_time }">
              Real Time: {{ parseFloat(results.code1.real_time) }}
            </p>
          </span>
        </p>
        <p class="text-red-600">
          {{ results.message }}
        </p>
      </div>
      <div class="sm:w-1/2 flex flex-col">
        <Label for="message-2" class="mb-3">Your Code block</Label>
        <Textarea id="message-2" placeholder="Type your block of Code." v-model="message2" />
        <p class="text-sm text-muted-foreground mt-4">
          <span v-if="results.success">
            <p :class="{ 'text-green-400': results.code1.cpu_time > results.code2.cpu_time }">
              CPU Time: {{ parseFloat(results.code2.cpu_time) }}
            </p>
            <p :class="{ 'text-green-400': results.code1.real_time > results.code2.real_time }">
              Real Time: {{ parseFloat(results.code2.real_time) }}
            </p>
          </span>
        </p>
      </div>
    </CardContent>
    <CardFooter>
      <div>
        <div v-if="!results.message && !results.success">Results will appear here</div>
        <Button variant="secondary" @click="submitMessages" v-if="buttonActive">Submit</Button>
        <Button disabled v-else>
          <Loader2 class="w-4 h-4 mr-2 animate-spin" />
          Please wait
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
