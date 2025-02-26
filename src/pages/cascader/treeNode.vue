<template>
    <div class="tree-node">
      <div class="node-label">
        <span v-if="node.expandable" class="toggle" @click="handleToggle(node)">
          {{ expanded ? '▼' : '▶' }}
        </span>
        <input
          v-if="isMultiple"
          type="checkbox"
          :checked="getIsSelected(node.value)"
          @change="handleSelectionChange(node.value, $event.target.checked)"
        />
        <span
          v-if="!isMultiple"
          @click="handleSelect(node)"
          :class="{ selected: getIsSelected(node.value) }"
        >
          {{ node.title }}
        </span>
        <span v-if="isMultiple">{{ node.title }}</span>
      </div>
      <div v-if="expanded && node.children" class="children">
        <TreeNode
          v-for="child in node.children"
          :key="child.value"
          :node="child"
          :expanded="isExpanded(child.value)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, inject } from 'vue';
  
  export default defineComponent({
    name: 'TreeNode',
    props: {
      node: {
        type: Object,
        required: true,
      },
      expanded: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const isMultiple = inject('isMultiple');
      const getIsSelected = inject('getIsSelected');
      const handleToggle = inject('handleToggle');
      const handleSelect = inject('handleSelect');
      const handleSelectionChange = inject('handleSelectionChange');
      const isExpanded = inject('isExpanded');
  
      return {
        isMultiple,
        getIsSelected,
        handleToggle,
        handleSelect,
        handleSelectionChange,
        isExpanded,
      };
    },
  });
  </script>
  
  <style scoped>
  .tree-node {
    margin-left: 16px;
  }
  .node-label {
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
  }
  .node-label:hover {
    background-color: #f3f4f6;
  }
  .selected {
    background-color: #e5e7eb;
    font-weight: bold;
  }
  .toggle {
    margin-right: 4px;
  }
  .children {
    margin-left: 16px;
  }
  </style>