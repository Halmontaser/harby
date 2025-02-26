<template>
    <div class="tree-container">
      <!-- Search Filter -->
      <div class="filter-section">
        <el-input
          v-model="filterText"
          placeholder="Search item groups..."
          prefix-icon="el-icon-search"
          clearable
          @clear="handleFilterClear"
        >
          <template #prefix>
            <i class="fas fa-search"></i>
          </template>
        </el-input>
      </div>
  
      <!-- Tree View -->
      <div class="tree-section" v-loading="isLoading">
        <el-tree
          v-if="!isLoading && !hasError"
          ref="treeRef"
          :data="treeData"
          :props="treeProps"
          :filter-node-method="filterNode"
          :load="loadNodes"
          lazy
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultCheckedKeys"
          @check="handleCheck"
        
          >
          <template #default="{ node, data }">
          <span class="custom-tree-node">
            <i :class="getNodeIcon(data)" class="mr-2"></i>
            <span :class="{ 'highlight': isHighlighted(node) }">
              {{ node.label }}
            </span>
          </span>
        </template>
        </el-tree>
        
  
        <!-- Error State -->
        <div v-if="hasError" class="error-state">
          <i class="fas fa-exclamation-circle error-icon"></i>
          <p class="error-message">{{ errorMessage }}</p>
          <el-button size="small" type="primary" @click="retryLoading">
            Retry Loading
          </el-button>
        </div>
      </div>
  
      <!-- Selected Items Summary -->
      <div v-if="selectedNodes.length && !hasError" class="selected-panel">
        <div class="panel-header">
          <h3>Selected Groups ({{ selectedNodes.length }})</h3>
          <el-button 
            size="small" 
            type="text" 
            @click="clearSelection"
          >
            Clear All
          </el-button>
        </div>
        <ul>
          <li v-for="node in selectedNodes" :key="node.id" class="selected-item">
            {{ node.label }}
            <el-button 
              size="small" 
              type="text" 
              class="remove-btn"
              @click="removeSelection(node)"
            >
              <i class="fas fa-times"></i>
            </el-button>
          </li>
        </ul>
        <pre>{{selectedNodes}}</pre>
      </div>
    </div>
    
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  import { createResource } from 'frappe-ui'
  import {ElTree,ElInput,ElButton} from 'element-plus'
  const props = defineProps({
    initialSelected: {
      type: Array,
      default: () => []
    }
  })
  
  const treeRef = ref(null)
  const treeData = ref([])
  const selectedNodes = ref([])
  const isLoading = ref(false)
  const hasError = ref(false)
  const errorMessage = ref('')
  const filterText = ref('')
  const defaultCheckedKeys = ref([])
  const emit = defineEmits(['canContinue','nextStep','update:selected'])
  watch(() => {
    selectedNodes.value.length>1?emit('canContinue',true):emit('canContinue',false)

  
  const treeProps = {
    label: 'label',
    children: 'children',
    isLeaf: 'leaf'
  }
  
  // Watch filter text changes
  watch(filterText, (val) => {
    treeRef.value?.filter(val)
  })
  
  // Filter method
  const filterNode = (value, data) => {
    if (!value) return true
    return data.label.toLowerCase().includes(value.toLowerCase())
  }
  
  const handleFilterClear = () => {
    filterText.value = ''
  }
  
  // Highlight filtered text
  const isHighlighted = (node) => {
    if (!filterText.value) return false
    return node.label.toLowerCase().includes(filterText.value.toLowerCase())
  }
  
  const itemGroupResource = createResource({
    url: 'frappe.desk.treeview.get_children',
    transform(response) {
      return response.map(node => ({
        id: node.value,
        label: node.title,
        leaf: !node.expandable,
        isLeaf: node.expandable
      }))
    }
  })
  const loadNodes = async (node, resolve) => {
    try {
      const parentValue = node.level === 0 ? '' : node.data.id
      const nodes = await itemGroupResource.submit({
        doctype: 'UNSPCS',
        parent: parentValue,
        is_root: !parentValue,
      })
      resolve(nodes)
    } catch (error) {
      console.error('Error loading nodes:', error)
      resolve([])
      showError('Failed to load item groups')
    }
  }
  
  const showError = (message) => {
    hasError.value = true
    errorMessage.value = message
  }
  
  const initializeTree = async () => {
    isLoading.value = true
    try {
      const rootNodes = await itemGroupResource.submit({
        doctype: 'UNSPCS',
        parent: '',
        is_root: true,
      })
      console.log(rootNodes.data)
      treeData.value = {id:1,label:"UNSPCS",children:rootNodes,leaf:0}
      
      // Set initial checked keys from props
      defaultCheckedKeys.value = props.initialSelected.map(item => item.id)
      
      // Update selected nodes with initial values
      selectedNodes.value = props.initialSelected
    } catch (error) {
      console.error('Error initializing tree:', error)
      showError('Failed to load item groups')
    } finally {
      isLoading.value = false
    }
  }
  
  const handleCheck = (data, { checkedNodes, checkedKeys }) => {
    selectedNodes.value = checkedNodes.map(node => ({
      id: node.id,
      label: node.label
    }))
    emit('update:selected', selectedNodes.value)
  }
  
  const clearSelection = () => {
    treeRef.value?.setCheckedKeys([])
    selectedNodes.value = []
    emit('update:selected', [])
  }
  
  const removeSelection = (node) => {
    treeRef.value?.setChecked(node.id, false)
    selectedNodes.value = selectedNodes.value.filter(item => item.id !== node.id)
    emit('update:selected', selectedNodes.value)
  }
  
  const getNodeIcon = (data) => {
    return data.is_group ? 'fas fa-folder' : 'fas fa-folder-open'
  }
  
  const retryLoading = () => {
    hasError.value = false
    initializeTree()
  }
  
  // Update tree when initialSelected prop changes
  watch(() => props.initialSelected, (newVal) => {
    if (treeRef.value) {
      treeRef.value.setCheckedKeys(newVal.map(item => item.id))
      selectedNodes.value = newVal
    }
  }, { deep: true })
  
  // Emit events
  
  // Expose methods
  defineExpose({
    getSelectedGroups: () => selectedNodes.value,
    clearSelection,
    reloadTree: initializeTree,
    setSelectedItems: (items) => {
      if (treeRef.value) {
        treeRef.value.setCheckedKeys(items.map(item => item.id))
        selectedNodes.value = items
      }
    }
  })
  
  // Initialize on mount
  onMounted(() => {
    initializeTree()
  })
  </script>
  
  <style scoped>
  .tree-container {
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .filter-section {
    margin-bottom: 15px;
  }
  
  .tree-section {
    min-height: 200px;
  }
  
  .custom-tree-node {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  
  .highlight {
    background-color: #ffeaa7;
    padding: 0 2px;
    border-radius: 2px;
  }
  
  .selected-panel {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .panel-header h3 {
    margin: 0;
    font-size: 16px;
    color: #2c3e50;
  }
  
  .selected-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
  }
  
  .remove-btn {
    padding: 2px 5px;
    color: #909399;
  }
  
  .remove-btn:hover {
    color: #f56c6c;
  }
  
  .error-state {
    text-align: center;
    padding: 20px;
  }
  
  .error-icon {
    font-size: 24px;
    color: #f56c6c;
    margin-bottom: 10px;
  }
  
  .mr-2 {
    margin-right: 8px;
  }
  
  :deep(.el-tree-node__content) {
    height: 32px;
  }
  
  :deep(.el-tree-node__content:hover) {
    background-color: #f5f7fa;
  }
  </style>