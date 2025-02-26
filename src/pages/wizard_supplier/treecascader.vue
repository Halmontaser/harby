<template>
    <div class="tree-cascader">
      <el-cascader
        v-model="selectedValue"
        :props="cascaderProps"
        :options="options"
        :loading="loading"
        @change="handleChange"
        @expand-change="handleExpandChange"
        @check="handleCheck"

        placeholder="Select items"
        :show-all-levels="showAllLevels"
        :collapse-tags="collapseTags"
        :collapse-tags-tooltip="collapseTagsTooltip"
        clearable
      >
        <template class="w-30" #default="{ node, data }">
          <span>{{ data.label }}</span>
          <span v-if="data.isLeaf" style="margin-left: 4px; color: #999;">
          </span>
        </template>
      </el-cascader>
  
      <!-- Optional: Display selected values summary -->
      <div v-if="selectedValue.length" class="selected-summary">
        <p>Selected items: {{ selectedValue.length }}</p>
        <el-tag 
          v-for="item in getSelectedLabels()" 
          :key="item"
          class="selected-tag"
          closable
          @close="removeSelection(item)"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>
    <pre>{{ selectedValue }}</pre>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElCascader, ElTag, ElMessage } from 'element-plus'
  import('element-plus/theme-chalk/el-cascader.css')
  const props = defineProps({
    doctype: {
      type: String,
      default:'UNSPCS'
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    collapseTagsTooltip: {
      type: Boolean,
      default: true
    }
  })
  import {computed} from 'vue'
  const emit = defineEmits(['change', 'expand'])
  import {createResource} from 'frappe-ui'
  const selectedValue = ref([])
  const options = ref([])
  const loading = ref(false)
  
  
  // Cascader configuration
    const itemGroupResource = createResource({
    url: 'frappe.desk.treeview.get_children',
    transform(response) {
      return response.map(node => ({
        value: node.value,
        label: node.title,
        leaf: !node.expandable,
        isLeaf: node.expandable,
        cheldren:[]
      }))
    }
  })
  const loadNodes = async (node, resolve) => {
    try {
      const parentValue = node.level === 0 ? '' : node.value
      const nodes = await itemGroupResource.submit({
        doctype: 'UNSPCS',
        parent: parentValue,
        is_root: !parentValue,
        children:[]
      })
      resolve(nodes)
    } catch (error) {
      console.error('Error loading nodes:', error)
      resolve()
      showError('Failed to load item groups')
    }
  }
  const cascaderProps = ref({
    lazy: true,
    lazyLoad:loadNodes,
    value: 'value',
    label: 'label',
    multiple: true,
    checkStrictly: true,
    expandTrigger: 'click'
  })
  const showError = (message) => {
    hasError.value = true
    errorMessage.value = message
  }
  
  const initializeRootNodes = async () => {
    loading.value = true
    try {
      const rootNodes = await itemGroupResource.submit({
        doctype: 'UNSPCS',
        parent: '',
        is_root: true,
      })
      
      options.value = rootNodes
      
      
    } catch (error) {
      console.error('Error initializing tree:', error)
      showError('Failed to load item groups')
    } finally {
      loading.value = false
    }
  }
  

  // Load nodes from Frappe
  
  // Initialize root nodes
  
  // Handle selection change
  
  // Handle node expansion
  const handleExpandChange = (expandedNodes) => {
    emit('expand', expandedNodes)
  }

  
  // Get labels for selected values
  const getSelectedLabels = () => {
    const findLabel = (value, nodes) => {
      for (const node of nodes) {
        if (node.name === value) return node.label
        if (node.children) {
          const label = findLabel(value, node.children)
          if (label) return label
        }
      }
      return value
    }
  
    return selectedValue.value.map(value => 
      findLabel(value[value.length - 1], options.value)
    )
  }
  
  // Remove a selection
  const removeSelection = (label) => {
    const newSelection = selectedValue.value.filter(value => {
      const valueLabel = findLabel(value[value.length - 1], options.value)
      return valueLabel !== label
    })
    selectedValue.value = newSelection
    emit('change', newSelection)
  }
  
  // Clear cache and reload nodes
  const refreshNodes = async () => {
    loadedNodes.clear()
    await initializeRootNodes()
  }
  
  onMounted(() => {
    initializeRootNodes()
  })
  
  // Expose methods for parent component
  defineExpose({
    refresh: refreshNodes,
    clearSelection: () => {
      selectedValue.value = []
    }
  })
  </script>
  
  <style scoped>
  .tree-cascader {
    width: 100%;
  }
  
  .selected-summary {
    margin-top: 10px;
  }
  
  .selected-tag {
    margin: 4px;
  }
  
  :deep(.el-cascader) {
    width: 100%;
  }
  
  :deep(.el-cascader-panel) {
    max-height: 300px;
  }
  </style>