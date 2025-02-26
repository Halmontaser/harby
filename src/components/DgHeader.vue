<template>
    <header class="bg-white shadow mx-4">
      <div class="container mx-auto p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-semibold text-gray-800">{{ title }}</h1>
          <Badge :label="status" :color="statusColor" />
        </div>
        <div class="flex items-center m-4 space-x-2">
          <Button v-for="(action, index) in actions" :key="index" :icon="action.icon" :label="action.label" />
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { Badge, Button } from 'frappe-ui'
  
  export default {
    name: 'DgHeader',
    components: {
      Badge,
      Button
    },
    props: {
      title: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Active'
      },
      actions: {
        type: Array,
        default: () => []
      }
    },
    setup(props) {
      const statusColor = ref('green')
  
      // You can add logic here to determine the status color based on the status prop
      // For example:
      // watch(() => props.status, (newStatus) => {
      //   statusColor.value = newStatus === 'Active' ? 'green' : 'red'
      // }, { immediate: true })
  
      return {
        statusColor
      }
    }
  }
  </script>