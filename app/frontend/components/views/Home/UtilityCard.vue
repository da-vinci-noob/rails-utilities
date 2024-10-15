<script lang="ts" setup>
import { ref } from 'vue'
import { format } from 'date-fns'

// Variables
const placeholder = ref('/placeholder.svg')
const props = defineProps<{
  utility: { title: string; icon: string; status: string; description: string; createdAt: Date }
}>()

// Functions
const formattedDate = (date: Date) => format(date, 'dd/MMM/yyyy')

const trimDescription = (description: string, maxLength: number = 100) =>
  description.length > maxLength ? `${description.slice(0, maxLength)}...` : description

const titleToPath = (title: string) => title.toLowerCase().replace(/\s+/g, '_')

// Theme Import
// prettier-ignore
import { MoreHorizontal, Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, TableCell, TableRow } from '@/components/addons/ThemeImport.vue'
</script>

<template>
  <TableRow>
    <TableCell class="hidden sm:table-cell">
      <img
        :alt="`${props.utility.title} icon`"
        class="aspect-square rounded-md object-cover"
        height="64"
        :src="props.utility.icon || placeholder"
        width="64"
      />
    </TableCell>
    <TableCell class="font-medium">
      <router-link :to="titleToPath(props.utility.title)">{{ props.utility.title }}</router-link>
    </TableCell>
    <TableCell>
      <Badge variant="outline">
        {{ props.utility.status }}
      </Badge>
    </TableCell>
    <TableCell class="hidden md:table-cell">
      {{ trimDescription(props.utility.description) }}
    </TableCell>
    <TableCell class="hidden md:table-cell whitespace-nowrap">
      {{ formattedDate(props.utility.createdAt) }}
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
</template>
