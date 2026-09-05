# Contributing to Rails Utilities

Thank you for your interest in contributing to Rails Utilities! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Ruby 3.3.7+
- Bun (JavaScript runtime)
- Rails 8.1.3.1+

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rails-utilities.git
   cd rails-utilities
   ```

2. **Install dependencies**
   ```bash
   bundle install
   bun install
   ```

3. **Start the development server**
   ```bash
   bin/dev
   ```

4. **Visit** `http://localhost:3000`

## 🛠️ Adding a New Utility

### 1. Create the Component

Create a new Vue component in `app/frontend/components/views/`:

```bash
mkdir -p app/frontend/components/views/MyNewUtility
touch app/frontend/components/views/MyNewUtility/Index.vue
```

Use this template:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const input = ref('')
const output = ref('')

const process = () => {
  // Your utility logic here
  output.value = input.value
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6 p-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold">My New Utility</h1>
      <p class="text-muted-foreground">
        Brief description of what this utility does
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-medium">Input</label>
        <Textarea v-model="input" rows="10" placeholder="Enter your input..." />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium">Output</label>
        <Textarea v-model="output" rows="10" readonly />
      </div>
    </div>

    <Button @click="process" class="w-full">
      Process
    </Button>
  </div>
</template>
```

### 2. Register the Utility

Add your utility to `app/frontend/data/utilities.ts`:

```typescript
{
  id: NEXT_AVAILABLE_ID, // Find the highest ID and increment
  title: 'My New Utility',
  description: 'Brief description of what this utility does',
  icon: 'https://api.iconify.design/lucide:your-icon.svg',
  status: 'Stable', // or 'Beta', 'Experimental'
  category: 'Appropriate Category', // See categories array
  createdAt: new Date()
}
```

### 3. Choose the Right Category

Available categories:
- Encoders/Decoders
- Formatters
- Converters
- Generators
- Crypto & Security
- Image Tools
- Text Tools
- Parsers & Analyzers
- Network
- Misc

### 4. Select an Icon

Use icons from [Iconify](https://icon-sets.iconify.design/lucide/):

```typescript
icon: 'https://api.iconify.design/lucide:file-code.svg'
```

## 📝 Code Style Guidelines

### Vue Components
- Use `<script setup lang="ts">` for TypeScript
- Keep components focused and single-purpose
- Use composition API (ref, computed, watch)
- Prefer TailwindCSS classes for styling
- Use shadcn/ui components when available

### TypeScript
- Use strict typing
- Define interfaces for complex data structures
- Use type inference where appropriate
- Export types that may be reused

### Testing
- Test your utility manually in the browser
- Verify it works in both light and dark modes
- Test on mobile viewport sizes
- Ensure keyboard navigation works

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to trigger the bug
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Browser, OS, and version information
6. **Screenshots**: If applicable

Use our [bug report template](https://github.com/da-vinci-noob/rails-utilities/issues/new?template=bug_report.md).

## 💡 Requesting Features

For feature requests:

1. Check if the feature already exists or is planned
2. Describe the use case and why it's valuable
3. Provide examples of how it would work
4. Consider if it fits the project scope

Use our [feature request template](https://github.com/da-vinci-noob/rails-utilities/issues/new?template=feature_request.md).

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-new-utility`
3. **Commit** your changes: `git commit -m 'Add my new utility'`
4. **Push** to the branch: `git push origin feature/my-new-utility`
5. **Open** a Pull Request

### PR Checklist
- [ ] Utility works as described
- [ ] Code follows project style guidelines
- [ ] Component uses TypeScript
- [ ] Responsive design tested
- [ ] Dark/light mode tested
- [ ] Added to `utilities.ts` with correct metadata
- [ ] Icon is appropriate and accessible
- [ ] Documentation/comments added where needed

## 🎨 Design Principles

1. **Privacy First**: All processing happens client-side
2. **Simplicity**: Keep utilities focused and easy to use
3. **Performance**: Optimize for fast load times
4. **Accessibility**: Follow WCAG guidelines
5. **Consistency**: Match existing UI patterns

## 🤝 Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## ❓ Questions?

Feel free to:
- Open an issue for general questions
- Reach out on [GitHub Discussions](https://github.com/da-vinci-noob/rails-utilities/discussions)

Thank you for contributing! 🎉
