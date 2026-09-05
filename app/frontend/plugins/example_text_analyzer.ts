/**
 * Example Text Analyzer Plugin
 * 
 * This demonstrates how to register a custom utility using the plugin API.
 * The utility appears in the dashboard alongside built-in utilities.
 */

import { registerUtility } from '@/lib/pluginApi'

registerUtility({
  id: 999, // High ID to avoid conflicts with built-in utilities
  title: 'Text Analyzer (Example)',
  description: 'Analyze text statistics including word count, character count, and reading time',
  icon: 'https://api.iconify.design/lucide:bar-chart-2.svg',
  status: 'Beta',
  category: 'Text Tools',
  createdAt: new Date(),
  isPlugin: true,
  component: () => import('@/components/views/ExampleCustomUtility/Index.vue')
})

console.log('Text Analyzer (Example) plugin loaded')
