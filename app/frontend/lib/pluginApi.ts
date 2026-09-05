/**
 * Plugin API for extending Rails Utilities with custom utilities
 * 
 * This API allows third-party developers and users to register custom utilities
 * that integrate seamlessly with the existing utility system.
 */

import { defineAsyncComponent, type Component } from 'vue'
import { utilities as builtinUtilities, categories, type Utility } from '@/data/utilities'
import router from '@/router'
import { titleToPath } from '@/lib/routes'

export interface PluginUtility extends Utility {
  /** Custom component to render for this utility */
  component?: Component | (() => Promise<Component>)
  /** Whether this is a plugin-provided utility */
  isPlugin?: boolean
}

export interface PluginDefinition {
  /** Unique plugin identifier */
  name: string
  /** Plugin version */
  version: string
  /** Plugin description */
  description: string
  /** Array of utilities provided by this plugin */
  utilities: PluginUtility[]
}

class PluginRegistry {
  private plugins: Map<string, PluginDefinition> = new Map()
  private customUtilities: PluginUtility[] = []

  /**
   * Register a new plugin with its utilities
   */
  register(plugin: PluginDefinition): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered. Overwriting.`)
    }

    this.plugins.set(plugin.name, plugin)
    
    // Register each utility from the plugin
    plugin.utilities.forEach(utility => {
      this.registerUtility(utility, plugin.name)
    })

    console.log(`Plugin "${plugin.name}" v${plugin.version} registered with ${plugin.utilities.length} utilities`)
  }

  /**
   * Register a single custom utility
   */
  registerUtility(utility: PluginUtility, pluginName?: string): void {
    // `builtinUtilities` is the shared reactive registry that the dashboard,
    // sidebar, mobile nav and command palette all read from.
    const existingId = builtinUtilities.find(u => u.id === utility.id)
    if (existingId) {
      console.error(`Utility ID ${utility.id} is already in use by "${existingId.title}"`)
      return
    }

    // Check for title conflicts
    const existingTitle = builtinUtilities.find(u => u.title === utility.title)
    if (existingTitle) {
      console.error(`Utility title "${utility.title}" is already in use`)
      return
    }

    // Mark as plugin utility
    utility.isPlugin = true

    // Publish into the shared list so the UI renders it, and keep a private
    // record so the plugin can be unregistered later.
    this.customUtilities.push(utility)
    builtinUtilities.push(utility)

    // Register route if component is provided
    if (utility.component) {
      this.registerRoute(utility)
    }

    console.log(`Registered custom utility: ${utility.title}${pluginName ? ` (from plugin: ${pluginName})` : ''}`)
  }

  /**
   * Dynamically register a route for a custom utility
   */
  private registerRoute(utility: PluginUtility): void {
    const path = `/${titleToPath(utility.title)}`
    
    // Check if route already exists
    const existingRoute = router.getRoutes().find(r => r.path === path)
    if (existingRoute) {
      console.warn(`Route "${path}" already exists`)
      return
    }

    // Create async component loader
    let componentLoader: () => Promise<Component>
    
    if (typeof utility.component === 'function') {
      componentLoader = utility.component as () => Promise<Component>
    } else {
      componentLoader = () => Promise.resolve(utility.component as Component)
    }

    const AsyncComponent = defineAsyncComponent(componentLoader)

    // Add route
    router.addRoute({
      path,
      name: utility.title,
      component: AsyncComponent
    })
  }

  /**
   * Get all utilities (built-in + plugin-registered)
   */
  getAllUtilities(): Utility[] {
    return [...builtinUtilities]
  }

  /**
   * Get only custom/plugin utilities
   */
  getCustomUtilities(): PluginUtility[] {
    return [...this.customUtilities]
  }

  /**
   * Get a specific plugin by name
   */
  getPlugin(name: string): PluginDefinition | undefined {
    return this.plugins.get(name)
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): PluginDefinition[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Unregister a plugin and its utilities
   */
  unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      console.warn(`Plugin "${pluginName}" not found`)
      return
    }

    // Remove utilities from both the shared list and the private record
    plugin.utilities.forEach(utility => {
      const customIndex = this.customUtilities.findIndex(u => u.id === utility.id)
      if (customIndex !== -1) this.customUtilities.splice(customIndex, 1)

      const sharedIndex = builtinUtilities.findIndex(u => u.id === utility.id)
      if (sharedIndex !== -1) builtinUtilities.splice(sharedIndex, 1)

      if (router.hasRoute(utility.title)) router.removeRoute(utility.title)
    })

    // Remove plugin
    this.plugins.delete(pluginName)
    console.log(`Plugin "${pluginName}" unregistered`)
  }

  /**
   * Check if a utility ID is available
   */
  isIdAvailable(id: number): boolean {
    return !builtinUtilities.some(u => u.id === id)
  }

  /**
   * Get next available utility ID
   */
  getNextAvailableId(): number {
    return Math.max(...builtinUtilities.map(u => u.id), 0) + 1
  }
}

// Create singleton instance
export const pluginRegistry = new PluginRegistry()

// Convenience function for quick utility registration
export function registerUtility(utility: PluginUtility): void {
  pluginRegistry.registerUtility(utility)
}

// Convenience function for plugin registration
export function registerPlugin(plugin: PluginDefinition): void {
  pluginRegistry.register(plugin)
}

// Export categories for plugin developers
export { categories }

// Export types for plugin developers
export type { Utility }
