<template>
    <div class="tree-select">
      <input
        v-model="searchQuery"
        placeholder="Search..."
        @input="filterTree"
      />
      <div class="tree-container">
        <tree-node
          v-for="node in filteredTree"
          :key="node.id"
          :node="node"
          :checked="isNodeChecked(node)"
          @check="checkNode"
        />
      </div>
    </div>
  </template>
  <script>
  import TreeNode from './TreeNode.vue';
  export default {
    name: 'TreeSelect',
    components: {
      TreeNode
    },
    props: {
      treeData: {
        type: Array,
        required: true
      },
      modelValue: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        searchQuery: '',
        filteredTree: [],
        checkedNodes: this.modelValue
      };
    },
    created() {
      this.filteredTree = this.treeData;
    },
    methods: {
      filterTree() {
        if (!this.searchQuery) {
          this.filteredTree = this.treeData;
          return;
        }
        
        const filterNodes = (nodes) => {
          return nodes.filter(node => {
            if (node.label.toLowerCase().includes(this.searchQuery.toLowerCase())) {
              return true;
            }
            if (node.children && node.children.length) {
              node.children = filterNodes(node.children);
              return node.children.length > 0;
            }
            return false;
          });
        };
        
        this.filteredTree = filterNodes(JSON.parse(JSON.stringify(this.treeData)));
      },
      isNodeChecked(node) {
        return this.checkedNodes.some(n => n.id === node.id);
      },
      checkNode(node, isChecked) {
        const updateCheckedStatus = (nodes, status) => {
          nodes.forEach(n => {
            const index = this.checkedNodes.findIndex(cn => cn.id === n.id);
            if (status && index === -1) {
              this.checkedNodes.push(n);
            } else if (!status && index !== -1) {
              this.checkedNodes.splice(index, 1);
            }
            if (n.children) {
              updateCheckedStatus(n.children, status);
            }
          });
        };
  if (isChecked) {
          this.checkedNodes.push(node);
          if (node.children) {
            updateCheckedStatus(node.children, true);
          }
        } else {
          const index = this.checkedNodes.findIndex(n => n.id === node.id);
          if (index !== -1) {
            this.checkedNodes.splice(index, 1);
          }
          if (node.children) {
            updateCheckedStatus(node.children, false);
          }
        }
  this.$emit('update:modelValue', this.checkedNodes);
      }
    },
    watch: {
      modelValue: {
        handler(newValue) {
          this.checkedNodes = newValue;
        },
        deep: true
      }
    }
  };
  </script>
  <style scoped>
  .tree-select {
    width: 100%;
    max-width: 300px;
  }
  .tree-container {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
    max-height: 300px;
    overflow-y: auto;
  }
  </style>
  