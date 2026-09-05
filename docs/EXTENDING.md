# Extending Rails Utilities

This guide explains how to extend Rails Utilities with custom utilities using the plugin API.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Creating a Custom Utility](#creating-a-custom-utility)
  - [Using the Generator](#using-the-generator)
  - [Manual Creation](#manual-creation)
- [Plugin API Reference](#plugin-api-reference)
- [Advanced Usage](#advanced-usage)
- [Distributing Plugins](#distributing-plugins)
- [Examples](#examples)

## Overview

Rails Utilities includes a plugin API that allows you to:

- Register custom utilities that appear alongside built-in utilities
- Dynamically load utility components
- Distribute utilities as separate packages
- Extend the utility system without modifying core code

## Quick Start

### 1. Generate a new utility

```bash
rails utility:generate[MyCustomUtility]
```

This creates:
- `app/frontend/components/views/MyCustomUtility/Index.vue` - The UI component
- `app/frontend/plugins/my_custom_utility.ts` - The plugin registration

### 2. Edit the component

Implement your utility logic in the generated Vue component.

### 3. Register the plugin

Import it from `app/frontend/entrypoints/application.js`, **after** the router import so
`router.addRoute()` runs against an initialised router:

```javascript
import router from '@/router'
import '@/plugins/my_custom_utility'
```

### 4. Start the dev server

```bash
bin/dev
```

Your utility now appears in the dashboard!

## Creating a Custom Utility

### Using the Generator

The fastest way to create a utility:

```bash
rails utility:generate[TextAnalyzer]
```

This generates a complete utility scaffold with:
- Vue component with input/output layout
- Share URL functionality
- Saved snippets integration
- Feedback links
- Plugin registration file

### Manual Creation

For more control, create utilities manually:

#### 1. Create the component

```vue
<!-- app/frontend/components/views/MyUtility/Index.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { TextTransformLayout } from '@/components/ui/text-transform-layout'
import { Button } from '@/components/ui/button'

const input = ref('')
const output = ref('')

function process() {
  output.value = input.value.toUpperCase()
}
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 p-4">
    <TextTransformLayout
      v-model:input="input"
      v-model:output="output"
      input-label="Input"
      input-placeholder="Enter text..."
    >
      <template #toolbar>
        <Button @click="process">Convert to Uppercase</Button>
      </template>
    </TextTransformLayout>
  </div>
</template>
```

#### 2. Register the utility

```typescript
// app/frontend/plugins/my_utility.ts
import { registerUtility } from '@/lib/pluginApi'

registerUtility({
  id: 100, // Choose a unique ID
  title: 'Uppercase Converter',
  description: 'Convert text to uppercase',
  icon: '🔤',
  status: 'Stable',
  category: 'Text Tools',
  createdAt: new Date(),
  component: () => import('@/components/views/MyUtility/Index.vue')
})
```

#### 3. Load the plugin

```typescript
// In your app initialization
import('./plugins/my_utility')
```

## Plugin API Reference

### `registerUtility(utility: PluginUtility)`

Register a single custom utility.

**Parameters:**

```typescript
interface PluginUtility {
  id: number              // Unique identifier
  title: string           // Display name
  description: string     // Short description
  icon: string            // Icon URL; the dashboard currently renders the
                          // first letter of the title, so this is metadata only
  status: string          // 'Stable' | 'Beta' | 'Experimental'
  category: string        // Category name
  createdAt: Date         // Creation date
  component?: Component   // Vue component or async loader
  isPlugin?: boolean      // Mark as plugin (auto-set)
}
```

**Example:**

```typescript
registerUtility({
  id: 100,
  title: 'My Utility',
  description: 'Does something useful',
  icon: '🚀',
  status: 'Beta',
  category: 'Misc',
  createdAt: new Date(),
  component: () => import('./MyUtility.vue')
})
```

### `registerPlugin(plugin: PluginDefinition)`

Register a plugin with multiple utilities.

**Parameters:**

```typescript
interface PluginDefinition {
  name: string           // Plugin identifier
  version: string        // Plugin version
  description: string    // Plugin description
  utilities: PluginUtility[]  // Array of utilities
}
```

**Example:**

```typescript
registerPlugin({
  name: 'my-plugin-pack',
  version: '1.0.0',
  description: 'Collection of useful utilities',
  utilities: [
    {
      id: 100,
      title: 'Utility A',
      // ... other fields
    },
    {
      id: 101,
      title: 'Utility B',
      // ... other fields
    }
  ]
})
```

### `pluginRegistry` Methods

Access the registry instance for advanced operations:

```typescript
import { pluginRegistry } from '@/lib/pluginApi'

// Get all utilities
const all = pluginRegistry.getAllUtilities()

// Get only custom utilities
const custom = pluginRegistry.getCustomUtilities()

// Check if ID is available
const available = pluginRegistry.isIdAvailable(100)

// Get next available ID
const nextId = pluginRegistry.getNextAvailableId()

// Unregister a plugin
pluginRegistry.unregister('my-plugin-pack')
```

## Advanced Usage

### Lazy Loading

Use dynamic imports for better performance:

```typescript
registerUtility({
  id: 100,
  title: 'Heavy Utility',
  // ...
  component: () => import('./HeavyUtility.vue')
})
```

### Conditional Registration

Register utilities based on conditions:

```typescript
if (import.meta.env.DEV) {
  registerUtility({
    id: 999,
    title: 'Debug Tool',
    // ...
  })
}
```

### Dynamic Categories

Create new categories:

```typescript
registerUtility({
  id: 100,
  title: 'Special Tool',
  category: 'My Custom Category', // New category
  // ...
})
```

### Accessing Plugin Utilities

List all custom utilities:

```typescript
import { pluginRegistry } from '@/lib/pluginApi'

const customUtils = pluginRegistry.getCustomUtilities()
console.log(`Loaded ${customUtils.length} custom utilities`)
```

## Distributing Plugins

### NPM Package Structure

```typescript
// index.ts
export function install() {
  registerPlugin({
    name: 'my-utilities',
    version: '1.0.0',
    description: 'My utility pack',
    utilities: [
      // ... utilities
    ]
  })
}
```

### Usage

```typescript
// In your app
import { install } from 'my-utilities'
install()
```

## Examples

### Example 1: Simple Text Transformer

See `app/frontend/components/views/ExampleCustomUtility/Index.vue` for a complete example.

### Example 2: Multi-Tool Plugin

```typescript
registerPlugin({
  name: 'text-tools',
  version: '1.0.0',
  description: 'Text manipulation utilities',
  utilities: [
    {
      id: 200,
      title: 'Word Counter',
      description: 'Count words, characters, and sentences',
      icon: '📝',
      status: 'Stable',
      category: 'Text Tools',
      createdAt: new Date(),
      component: () => import('./WordCounter.vue')
    },
    {
      id: 201,
      title: 'Text Statistics',
      description: 'Analyze text readability and complexity',
      icon: '📊',
      status: 'Beta',
      category: 'Text Tools',
      createdAt: new Date(),
      component: () => import('./TextStatistics.vue')
    }
  ]
})
```

## Best Practices

1. **Choose unique IDs**: Use `rails utility:list_ids` to see available IDs
2. **Use appropriate categories**: Stick to existing categories when possible
3. **Provide clear descriptions**: Help users understand what your utility does
4. **Handle errors gracefully**: Always catch and display errors to users
5. **Test thoroughly**: Ensure your utility works in both dev and production
6. **Follow naming conventions**: Use Title Case for utility names
7. **Include feedback links**: Use the `UtilityFeedback` component

## Troubleshooting

### Utility not appearing

- Check that the plugin file is imported
- Verify the utility ID is unique
- Ensure the component path is correct
- Check browser console for errors

### Component not loading

- Verify the component file exists
- Check for syntax errors in the Vue component
- Ensure all imports are correct
- Check browser console for compilation errors

### Route conflicts

- Ensure utility titles are unique
- Check for duplicate IDs
- Use `pluginRegistry.isIdAvailable(id)` to verify

## Getting Help

- See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
- Open an issue on GitHub for bugs or feature requests
- Join the community discussions for questions

## API Changes

The plugin API is stable and follows semantic versioning. Breaking changes will be documented in release notes.
