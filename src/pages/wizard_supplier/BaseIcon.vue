
<script setup>
import { h,defineComponent } from 'vue'
import { FeatherIcon } from 'frappe-ui'
import * as LucideIcons from 'lucide-vue-next'

// Create BaseIcon component
const BaseIcon = defineComponent({
  name: 'BaseIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    class: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const renderIcon = () => {
      try {
        // First try to render as FeatherIcon
        return h(FeatherIcon, {
          name: props.name,
          class: props.class,
          size: props.size
        })
      } catch (error) {
        // If FeatherIcon fails, try Lucide
        const iconName = toPascalCase(props.name) + 'Icon' // Convert to PascalCase and add 'Icon' suffix
        const LucideIcon = LucideIcons[iconName]

        if (LucideIcon) {
          return h(LucideIcon, {
            class: props.class,
            size: props.size
          })
        }

        // If icon not found in either library, render fallback or null
        console.warn(`Icon "${props.name}" not found in Feather or Lucide icons`)
        return null
      }
    }

    return () => renderIcon()
  }
})

// Helper function to convert kebab-case or snake_case to PascalCase
const toPascalCase = (str) => {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}


</script>

<style scoped>
/* Your existing styles */
</style>