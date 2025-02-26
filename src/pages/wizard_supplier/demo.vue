<template>
  <cascader />
    <ItemGroupTree
      ref="itemGroupTreeRef"
      :initial-selected="initialSelectedGroups"
      @update:selected="handleSelectionUpdate"
    />
    
</template>


<script lang="ts" setup>
  import { Edit, Picture, UploadFilled } from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/index.css'; 
import {ElCascader,ElSteps,ElStep} from 'element-plus'
const props = { multiple: true }
import { ref } from 'vue'
import cascader from './treecascader.vue'
import ItemGroupTree from './untree.vue'

const itemGroupTreeRef = ref(null)

// Example of initial selected items
const initialSelectedGroups = ref([])

const handleSelectionUpdate = (selected) => {
  console.log('Selected groups updated:', selected)
}

const saveSelection = () => {
  const selectedGroups = itemGroupTreeRef.value.getSelectedGroups()
  // Save the selection to your backend or store
  console.log('Saving selection:', selectedGroups)
}

// Example of updating selected items programmatically
const updateSelection = (newItems) => {
  itemGroupTreeRef.value?.setSelectedItems(newItems)
}
const options = [
  {
    value: 1,
    label: 'Asia',
    children: [
      {
        value: 2,
        label: 'China',
        children: [
          { value: 3, label: 'Beijing' },
          { value: 4, label: 'Shanghai' },
          { value: 5, label: 'Hangzhou' },
        ],
      },
      {
        value: 6,
        label: 'Japan',
        children: [
          { value: 7, label: 'Tokyo' },
          { value: 8, label: 'Osaka' },
          { value: 9, label: 'Kyoto' },
        ],
      },
      {
        value: 10,
        label: 'Korea',
        children: [
          { value: 11, label: 'Seoul' },
          { value: 12, label: 'Busan' },
          { value: 13, label: 'Taegu' },
        ],
      },
    ],
  },
  {
    value: 14,
    label: 'Europe',
    children: [
      {
        value: 15,
        label: 'France',
        children: [
          { value: 16, label: 'Paris' },
          { value: 17, label: 'Marseille' },
          { value: 18, label: 'Lyon' },
        ],
      },
      {
        value: 19,
        label: 'UK',
        children: [
          { value: 20, label: 'London' },
          { value: 21, label: 'Birmingham' },
          { value: 22, label: 'Manchester' },
        ],
      },
    ],
  },
  {
    value: 23,
    label: 'North America',
    children: [
      {
        value: 24,
        label: 'US',
        children: [
          { value: 25, label: 'New York' },
          { value: 26, label: 'Los Angeles' },
          { value: 27, label: 'Washington' },
        ],
      },
      {
        value: 28,
        label: 'Canada',
        children: [
          { value: 29, label: 'Toronto' },
          { value: 30, label: 'Montreal' },
          { value: 31, label: 'Ottawa' },
        ],
      },
    ],
  },
]
</script>
<style scoped>
  .page-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.actions-panel {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}
</style>