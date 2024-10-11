<script setup lang="ts">
// Imports
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { utilities } from '@/data/utilities'
import DarkMode from '@/components/addons/DarkMode.vue'

// Variables
const placeholder = ref('/placeholder.svg')
const utilitiesStatusList = ref(['All', 'Stable', 'Beta', 'Testing'])
const searchQuery = ref('')
const sortOrder = ref('asc')
const sortKey = ref('name')
const utilitiesByStatus = ref('All')

// Lifecycles
// onMounted(() => {
//   utilities.value = JSON.parse(home.dataset.utilities)
// })

// Functions
const formattedDate = (date: Date) => {
  return format(date, 'dd/MMM/yyyy')
}

const trimDescription = (description: string, maxLength: number = 100) =>
  description.length > maxLength ? `${description.slice(0, maxLength)}...` : description

const filteredAndSortedUtilities = computed(() => {
  let result = utilities

  // Filter based on search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (utility: { title: string; description: string }) =>
        utility.title.toLowerCase().includes(query) || utility.description.toLowerCase().includes(query)
    )
  }

  // Filter Based on Status
  if (utilitiesByStatus.value && utilitiesByStatus.value != 'All') {
    result = result.filter((utility: { status: string }) => utility.status === utilitiesByStatus.value)
  }

  // Sort based on sortKey and sortOrder
  // result.sort((a, b) => {
  //   let modifier = sortOrder.value === 'asc' ? 1 : -1
  //   if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier
  //   if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier
  //   return 0
  // })

  return result
})

// Theme Import
// prettier-ignore
import { File, MoreHorizontal, PlusCircle, Search, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/addons/ThemeImport.vue'
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
                <a href="#">Utility</a>
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
            <CardTitle>Utilities</CardTitle>
            <CardDescription>
              Manage your utilities and view their details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="hidden w-[100px] sm:table-cell">
                    <span class="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead class="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead class="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span class="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="utility in filteredAndSortedUtilities" :key="utility.title">
                  <TableCell class="hidden sm:table-cell">
                    <img
                      :alt="`${utility.title} icon`"
                      class="aspect-square rounded-md object-cover"
                      height="64"
                      :src="utility.icon || placeholder"
                      width="64"
                    />
                  </TableCell>
                  <TableCell class="font-medium">
                    {{ utility.title }}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {{ utility.status }}
                    </Badge>
                  </TableCell>
                  <TableCell class="hidden md:table-cell">
                    {{ trimDescription(utility.description) }}
                  </TableCell>
                  <TableCell class="hidden md:table-cell whitespace-nowrap">
                    {{ formattedDate(utility.createdAt) }}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal class="h-4 w-4" />
                          <span class="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div class="text-xs text-muted-foreground">
              Showing
              <strong>
                {{ filteredAndSortedUtilities.length == 0 ? '0' : '1' }}-{{ filteredAndSortedUtilities.length }}
              </strong>
              of
              <strong>{{ utilities.length }}</strong>
              utilities
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  </div>
</template>
