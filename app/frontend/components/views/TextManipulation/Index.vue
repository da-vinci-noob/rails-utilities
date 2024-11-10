<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MD5, SHA1, SHA256, SHA512 } from 'crypto-js'

/**
 * Represents a text transformation operation
 * @interface TextOperation
 * @property {string} label - Display name of the operation
 * @property {() => void} action - Function to execute the operation
 * @property {string} [variant] - Optional button variant
 */
interface TextOperation {
  label: string
  action: () => void
  variant?: string
}

// Reactive Variables
const route = useRoute()
const router = useRouter()
const message = ref<string>('')
const errorMessage = ref<string>('')

/**
 * Computed property that returns current route information
 * @returns {Object} Object containing route name, path and description
 */
const currentRoute = computed(() => ({
  name: route.name,
  path: route.path,
  description: route.meta?.description
}))

/**
 * Handles text transformation operations with error handling
 * @param {(text: string) => string} transform - Function that performs the text transformation
 * @returns {void}
 */
const handleTransformation = (transform: (text: string) => string) => {
  if (!message.value) {
    errorMessage.value = 'Please enter some text first'
    return
  }
  try {
    message.value = transform(message.value)
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred'
  }
}

/**
 * Array of basic text transformation operations
 * Includes: UPPERCASE, lowercase, Title Case, and Sort Lines
 */
const textOperations: TextOperation[] = [
  {
    label: 'UPPERCASE',
    action: () => handleTransformation((text) => text.toUpperCase())
  },
  {
    label: 'lowercase',
    action: () => handleTransformation((text) => text.toLowerCase())
  },
  {
    label: 'Title Case',
    action: () =>
      handleTransformation((text) =>
        text
          .toLowerCase()
          .split('\n')
          .map((line) =>
            line
              .split(' ')
              .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
              .join(' ')
          )
          .join('\n')
      )
  },
  {
    label: 'Sort Lines',
    action: () =>
      handleTransformation((text) =>
        text
          .split('\n')
          .filter((line) => line.trim())
          .sort()
          .join('\n')
      )
  },
  {
    label: 'JSON Pretiify/Format',
    action: () =>
      handleTransformation((text) => {
        // Parse the JSON string and stringify it with proper formatting
        const parsedJson = JSON.parse(text)
        return JSON.stringify(parsedJson, null, 2)
      })
  }
]

/**
 * Object containing encoding and hashing operations
 * Groups: base64, url encoding, and cryptographic hashes
 */
const encodingOperations = {
  base64: [
    {
      label: 'Encode',
      action: () => handleTransformation(btoa)
    },
    {
      label: 'Decode',
      action: () => handleTransformation(atob)
    }
  ],
  url: [
    {
      label: 'Encode',
      action: () => handleTransformation(encodeURIComponent)
    },
    {
      label: 'Decode',
      action: () => handleTransformation(decodeURIComponent)
    }
  ],
  hashes: [
    {
      label: 'MD5',
      action: () => handleTransformation((text) => MD5(text).toString())
    },
    {
      label: 'SHA1',
      action: () => handleTransformation((text) => SHA1(text).toString())
    },
    {
      label: 'SHA256',
      action: () => handleTransformation((text) => SHA256(text).toString())
    },
    {
      label: 'SHA512',
      action: () => handleTransformation((text) => SHA512(text).toString())
    }
  ]
}

/**
 * Navigates back to the previous page
 * @returns {void}
 */
const goBack = () => router.go(-1)

// Theme Import
// prettier-ignore
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Textarea, Label, ArrowLeft } from '@/components/addons/ThemeImport.vue'
</script>

<template>
  <div class="flex items-center">
    <div class="ml-auto mt-2.5">
      <Button size="sm" class="h-7" @click="goBack">
        <ArrowLeft class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Back</span>
      </Button>
    </div>
  </div>

  <Card class="mt-2.5">
    <CardHeader>
      <CardTitle>{{ currentRoute.name }}</CardTitle>
      <CardDescription>{{ currentRoute.description }}</CardDescription>
    </CardHeader>

    <CardContent>
      <div>
        <Label for="text" class="mb-3">Your Text block</Label>
        <Textarea id="text" placeholder="Type your block of Text." v-model="message" class="min-h-[100px]" />
      </div>
    </CardContent>

    <CardFooter class="flex-col inline-flex items-start gap-4">
      <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>

      <!-- Text Manipulations -->
      <div class="w-full">
        <div class="text-sm font-medium mb-2">Text Manipulations</div>
        <div class="flex flex-wrap gap-2">
          <Button v-for="op in textOperations" :key="op.label" variant="secondary" @click="op.action">
            {{ op.label }}
          </Button>
        </div>
      </div>

      <!-- Encodings -->
      <div v-for="(ops, type) in encodingOperations" :key="type">
        <div class="w-full">
          <div class="text-sm font-medium mb-2 capitalize">{{ type }}</div>
          <div class="flex flex-wrap gap-2">
            <Button v-for="op in ops" :key="op.label" variant="secondary" @click="op.action">
              {{ op.label }}
            </Button>
          </div>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
