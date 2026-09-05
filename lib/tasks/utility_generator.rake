# frozen_string_literal: true

namespace :utility do
  desc 'Generate a new custom utility template'
  task :generate, [:name] => :environment do |_t, args|
    name = args[:name]

    if name.blank?
      puts 'Usage: rails utility:generate[MyUtilityName]'
      exit 1
    end

    # Convert to proper case and path
    title = name.titleize
    path_name = name.underscore
    class_name = name.camelize

    # Determine next available ID
    utilities_file = Rails.root.join('app/frontend/data/utilities.ts')
    utilities_content = utilities_file.read
    ids_found = utilities_content.scan(/id: (\d+)/)
    max_id = ids_found.map { |(id)| id.to_i }
                      .max.to_i
    next_id = max_id + 1

    puts "Generating utility: #{title} (ID: #{next_id})"

    # Create component directory
    component_dir = Rails.root.join("app/frontend/components/views/#{class_name}")
    FileUtils.mkdir_p(component_dir)

    # Generate Vue component
    component_path = component_dir.join('Index.vue')
    component_template = <<~VUE
      <script setup lang="ts">
      import { ref } from 'vue'
      import { TextTransformLayout } from '@/components/ui/text-transform-layout'
      import { Button } from '@/components/ui/button'
      import SavedSnippets from '@/components/addons/SavedSnippets.vue'
      import UtilityFeedback from '@/components/addons/UtilityFeedback.vue'
      import { useCopy } from '@/lib/useCopy'
      import { shareUrl } from '@/lib/shareUrl'

      const input = ref('')
      const output = ref('')
      const error = ref('')
      const { state: shareState, copy: copyShare } = useCopy()

      function process() {
        error.value = ''
        if (!input.value) {
          output.value = ''
          return
        }
      #{'  '}
        try {
          // TODO: Implement your utility logic here
          output.value = input.value
        } catch (e: any) {
          error.value = e.message
        }
      }

      function share() {
        copyShare(shareUrl({ input: input.value }))
      }
      </script>

      <template>
        <div class="flex min-h-full flex-col gap-4 p-4">
          <SavedSnippets#{' '}
            tool="#{title}"#{' '}
            :input="input"#{' '}
            :output="output"#{' '}
            @load="input = $event.input; output = $event.output"#{' '}
          />
      #{'    '}
          <TextTransformLayout
            v-model:input="input"
            v-model:output="output"
            input-label="Input"
            input-placeholder="Enter your input..."
            :error="error"
          >
            <template #toolbar>
              <Button @click="process">Process</Button>
              <Button variant="outline" @click="share">
                {{ shareState === 'copied' ? 'Copied URL!' : 'Share URL' }}
              </Button>
            </template>
          </TextTransformLayout>
      #{'    '}
          <div class="mt-auto pt-4 border-t">
            <UtilityFeedback utility-title="#{title}" />
          </div>
        </div>
      </template>
    VUE

    File.write(component_path, component_template)
    puts "✓ Created component: #{component_path.relative_path_from(Rails.root)}"

    # Generate plugin registration file
    plugin_dir = Rails.root.join('app/frontend/plugins')
    FileUtils.mkdir_p(plugin_dir)

    plugin_path = plugin_dir.join("#{path_name}.ts")
    plugin_template = <<~TS
      /**
       * #{title} - Custom Utility Plugin
       *#{' '}
       * Generated utility for #{title}
       */

      import { registerUtility } from '@/lib/pluginApi'

      registerUtility({
        id: #{next_id},
        title: '#{title}',
        description: 'TODO: Add description for #{title}',
        icon: 'https://api.iconify.design/lucide:wrench.svg', // TODO: pick an icon from https://icon-sets.iconify.design
        status: 'Beta',
        category: 'Misc', // TODO: Choose appropriate category
        createdAt: new Date(),
        isPlugin: true,
        component: () => import('@/components/views/#{class_name}/Index.vue')
      })

      console.log('#{title} plugin loaded')
    TS

    File.write(plugin_path, plugin_template)
    puts "✓ Created plugin: #{plugin_path.relative_path_from(Rails.root)}"

    # Generate example registration
    registration_example = <<~TS

      // Add this to app/frontend/entrypoints/application.js, after the router import:
      import('./plugins/#{path_name}')
    TS

    puts "\n#{'=' * 60}"
    puts 'Utility generated successfully!'
    puts('=' * 60)
    puts "\nNext steps:"
    puts "1. Edit the component: #{component_path.relative_path_from(Rails.root)}"
    puts "2. Update the plugin metadata: #{plugin_path.relative_path_from(Rails.root)}"
    puts '3. Import the plugin from app/frontend/entrypoints/application.js:'
    puts registration_example
    puts "\nSee docs/EXTENDING.md for more information."
    puts('=' * 60)
  end

  desc 'List all available utility IDs'
  task list_ids: :environment do
    utilities_file = Rails.root.join('app/frontend/data/utilities.ts')
    utilities_content = utilities_file.read

    pairs = utilities_content.scan(/id: (\d+),\s*title: '([^']+)'/)
    ids = pairs.map { |id, title| { id: id.to_i, title: title } }
    ids.sort_by! { |utility| utility[:id] }

    puts 'Available Utility IDs:'
    puts '-' * 60
    ids.each do |utility|
      puts "#{utility[:id].to_s.rjust(3)} - #{utility[:title]}"
    end
    puts '-' * 60
    puts "Total: #{ids.size} utilities"
    puts "Next available ID: #{(ids.last&.fetch(:id) || 0) + 1}"
  end
end
