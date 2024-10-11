<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'a',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn('transition-colors hover:text-gray-950 dark:hover:text-gray-50', props.class)"
  >
    <slot />
  </Primitive>
</template>
