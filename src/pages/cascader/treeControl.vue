<template>
    <div class="tree-control">
      <Input
        v-if="searchable"
        v-model="filterText"
        placeholder="Search..."
        class="mb-2"
      />
      <div class="tree-container">
        <TreeNode
          v-for="node in filteredNodes"
          :key="node.value"
          :node="node"
          :expanded="isExpanded(node.value)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, provide } from 'vue';
  import { frappe } from 'frappe-ui';
  import TreeNode from './TreeNode.vue';
  import Input from 'frappe-ui/src/components/Input.vue';
  
  export default {
    name: 'TreeControl',
    components: { TreeNode, Input },
    props: {
      doctype: {
        type: String,
        required: true,
      },
      searchable: {
        type: Boolean,
        default: false,
      },
      modelValue: [String, Array],
      multiple: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
      const nodes = ref([]);
      const filterText = ref('');
      const expandedNodes = ref([]);
      const selectedValues = ref(props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : []);
  
      // Fetch top-level nodes
      const fetchTopLevelNodes = async () => {
        try {
          const response = await frappe.call({
            method: 'frappe.desk.treeview.get_children',
            args: {
              doctype: props.doctype,
              parent: '',
            },
          });
          nodes.value = response.message.map(node => ({ ...node, children: [] }));
        } catch (error) {
          console.error('Error fetching top-level nodes:', error);
        }
      };
  
      // Filter tree recursively
      const filterTree = (nodes, text) => {
        return nodes
          .map(node => {
            const matches = node.title.toLowerCase().includes(text.toLowerCase());
            const filteredChildren = node.children ? filterTree(node.children, text) : [];
            if (matches || filteredChildren.length > 0) {
              return { ...node, children: filteredChildren };
            }
            return null;
          })
          .filter(Boolean);
      };
  
      const filteredNodes = computed(() => {
        if (!filterText.value) return nodes.value;
        return filterTree(nodes.value, filterText.value);
      });
  
      // Toggle node expansion
      const toggleNode = async (node) => {
        const index = expandedNodes.value.indexOf(node.value);
        if (index === -1) {
          if (!node.children || node.children.length === 0) {
            const response = await frappe.call({
              method: 'frappe.desk.treeview.get_children',
              args: {
                doctype: props.doctype,
                parent: node.value,
              },
            });
            node.children = response.message.map(child => ({ ...child, children: [] }));
          }
          expandedNodes.value.push(node.value);
        } else {
          expandedNodes.value.splice(index, 1);
        }
      };
  
      // Handle single selection
      const handleSelect = (node) => {
        if (!props.multiple) {
          emit('update:modelValue', node.value);
          emit('change', node);
        }
      };
  
      // Handle multiple selection change
      const handleSelectionChange = (nodeValue, isSelected) => {
        if (props.multiple) {
          let newSelected = [...selectedValues.value];
          if (isSelected) {
            if (!newSelected.includes(nodeValue)) {
              newSelected.push(nodeValue);
            }
          } else {
            newSelected = newSelected.filter(v => v !== nodeValue);
          }
          selectedValues.value = newSelected;
          emit('update:modelValue', newSelected);
          emit('change', newSelected);
        }
      };
  
      // Provide to TreeNode
      provide('isMultiple', props.multiple);
      provide('getIsSelected', (nodeValue) => {
        if (props.multiple) {
          return selectedValues.value.includes(nodeValue);
        } else {
          return nodeValue === props.modelValue;
        }
      });
      provide('handleToggle', toggleNode);
      provide('handleSelect', handleSelect);
      provide('handleSelectionChange', handleSelectionChange);
      provide('isExpanded', (nodeValue) => expandedNodes.value.includes(nodeValue));
  
      // Load initial data
      onMounted(fetchTopLevelNodes);
  
      return {
        filterText,
        filteredNodes,
      };
    },
  };
  </script>
  
  <style scoped>
  .tree-control {
    padding: 8px;
  }
  .tree-container {
    max-height: 400px;
    overflow-y: auto;
  }
  .mb-2 {
    margin-bottom: 8px;
  }
  </style>