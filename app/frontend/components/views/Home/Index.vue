<script setup lang="ts">
// Imports
import { ref, computed } from 'vue'
import { utilities } from '@/data/utilities'
import UtilityCard from './UtilityCard.vue'

// Define props
const props = defineProps<{
  searchQuery: string
}>()

// Variables
const utilitiesStatusList = ref(['All', 'Stable', 'Beta', 'Testing'])
const utilitiesByStatus = ref('All')

// Functions
const filteredAndSortedUtilities = computed(() => {
  const query = props.searchQuery.toLowerCase()
  return utilities.filter((utility) => {
    const matchesQuery =
      !props.searchQuery ||
      utility.title.toLowerCase().includes(query) ||
      utility.description.toLowerCase().includes(query)
    const matchesStatus = utilitiesByStatus.value === 'All' || utility.status === utilitiesByStatus.value
    return matchesQuery && matchesStatus
  })
})

// Theme Import
// prettier-ignore
import { File, PlusCircle, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/addons/ThemeImport.vue'
</script>

<template>
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
            utilitiesByStatus == status ? 'dark:bg-gray-950 dark:text-gray-50 shadow-sm bg-white text-gray-950' : ''
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
          <UtilityCard :utility="utility" v-for="utility in filteredAndSortedUtilities" :key="utility.title" />
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
</template>
