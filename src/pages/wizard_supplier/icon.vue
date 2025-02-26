<template>
    <component
      :is="iconComponent"
      :size="size"
      :stroke-width="strokeWidth"
      :class="className"
      v-bind="$attrs"
    />
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import * as icons from 'lucide-vue-next'
  
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 16
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    },
    class: {
      type: String,
      default: ''
    }
  })
  
  const className = computed(() => {
    return `lucide-icon ${props.class}`
  })
  
  const iconComponent = computed(() => {
    // Convert kebab-case to PascalCase
    const componentName = props.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
    
    return icons[componentName] || icons.HelpCircle
  })
  </script>