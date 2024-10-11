<script setup lang="ts">
// Imports
import { ref, onMounted, computed } from 'vue'
import { parseISO, format } from 'date-fns'
import DarkMode from '@/components/addons/DarkMode.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Variables
const utility = ref()
const utilitiesStatusList = ref(['All', 'Stable', 'Beta', 'Testing'])
const searchQuery = ref('')
const sortOrder = ref('asc')
const sortKey = ref('name')
const utilitiesByStatus = ref('All')
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
onMounted(() => {
  utility.value = route.name
})

// Functions
const formattedDate = (date: string) => {
  return format(parseISO(date), 'dd/MMM/yyyy')
}

const trimDescription = (description: string, maxLength: number = 100) =>
  description.length > maxLength ? `${description.slice(0, maxLength)}...` : description

// Process Code
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
    // debugger
    // if (results.value.success) {
    // }
    //   else{
    // }
  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error
  } finally {
    buttonActive.value = true
  }
}

// const filteredAndSortedUtilities = computed(() => {
//   let result = utilities.value

//   // Filter based on search query
//   if (searchQuery.value) {
//     const query = searchQuery.value.toLowerCase()
//     result = result.filter(
//       (utility: { title: string; description: string }) =>
//         utility.title.toLowerCase().includes(query) || utility.description.toLowerCase().includes(query)
//     )
//   }

//   // Filter Based on Status
//   if (utilitiesByStatus.value && utilitiesByStatus.value != 'All') {
//     result = result.filter((utility: { status: string }) => utility.status === utilitiesByStatus.value)
//   }

//   // Sort based on sortKey and sortOrder
//   // result.sort((a, b) => {
//   //   let modifier = sortOrder.value === 'asc' ? 1 : -1
//   //   if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier
//   //   if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier
//   //   return 0
//   // })

//   return result
// })

// Theme Import
// prettier-ignore
import { File, MoreHorizontal, PlusCircle, Search, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea, Label, Loader2 } from '@/components/addons/ThemeImport.vue'
</script>

<template>
  <div class="flex min-h-screen w-full flex-col bg-muted/40 dark:bg-gray-950">
    <div class="flex flex-col sm:gap-4 sm:py-4 sm:px-14">
      <header
        class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
      >
        <Breadcrumb class="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <a href="#">Dashboard</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <a href="#">{{utility?.title}}</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="relative ml-auto flex-1 md:grow-0">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-300" />
          <Input
            type="search"
            placeholder="Search..."
            v-model="searchQuery"
            class="w-full rounded-lg bg-background pl-8 dark:text-gray-300 transition-all md:w-[200px] lg:w-[320px]"
          />
        </div>
        <DarkMode></DarkMode>
      </header>
      <main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div class="flex items-center">
          <div
            class="mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300"
          >
            <div
              class="inline-flex items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            >
              <div
                v-for="(status, index) in utilitiesStatusList"
                :key="index"
                :class="[
                  utilitiesByStatus == status
                    ? 'dark:bg-gray-950 dark:text-gray-50 shadow-sm bg-white text-gray-950'
                    : ''
                ]"
                @click="utilitiesByStatus = status"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 cursor-pointer"
              >
                {{ status }}
              </div>
            </div>
          </div>

          <div class="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" class="h-7 gap-1">
              <File class="h-3.5 w-3.5" />
              <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" class="h-7 gap-1">
              <PlusCircle class="h-3.5 w-3.5" />
              <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Utility
              </span>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{{ utility?.title }}</CardTitle>
            <CardDescription>
              {{ utility?.description }}
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-row w-full space-x-5">
            <div class="w-1/2 flex flex-col">
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
                <span v-else>Results will appear here</span>
                <p class="text-red-600">
                  {{ results.message }}
                </p>
              </p>
            </div>
            <div class="w-1/2 flex flex-col">
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
            <Button variant="secondary" @click="submitMessages" v-if="buttonActive">Button</Button>
            <Button disabled v-else>
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Please wait
            </Button>
            <!-- <div class="text-xs text-muted-foreground">
              Showing
              <strong>
                {{ filteredAndSortedUtilities.length == 0 ? '0' : '1' }}-{{ filteredAndSortedUtilities.length }}
              </strong>
              of
              <strong>{{ utilities.length }}</strong>
              utilities
            </div> -->
          </CardFooter>
        </Card>
      </main>
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
import { ref, computed } from 'vue'

const sortUtilities = (e) => {
  console.log(e)

  // This function is called when the sort key changes
  // The actual sorting is done in the computed property
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}
</script> -->
