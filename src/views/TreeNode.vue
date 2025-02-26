<template>
    <div class="tree-node">
      <div class="node-content">
        <input
          type="checkbox"
          :checked="checked"
          @change="toggleCheck"
        />
        <span v-if="node.children && node.children.length" @click.stop="toggleExpand">
          {{ expanded ? '▼' : '►' }}
        </span>
        <span @click="toggleCheck">{{ node.label }}</span>
      </div>
      <div v-if="expanded && node.children && node.children.length" class="children">
        <tree-node
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :checked="checked"
          @check="checkChild"
        />
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'TreeNode',
    props: {
      node: {
        type: Object,
        required: true
      },
      checked: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        expanded: false,
        isChecked: this.checked
      };
    },
    methods: {
      toggleExpand() {
        this.expanded = !this.expanded;
      },
      toggleCheck() {
        this.isChecked = !this.isChecked;
        this.$emit('check', this.node, this.isChecked);
      },
      checkChild(childNode, isChecked) {
        this.$emit('check', childNode, isChecked);
      }
    },
    watch: {
      checked(newValue) {
        this.isChecked = newValue;
      }
    }
  };
  </script>
  <style scoped>
  .tree-node {
    margin-left: 20px;
  }
  .node-content {
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
  }
  .node-content:hover {
    background-color: #f0f0f0;
  }
  .node-content > * {
    margin-right: 5px;
  }
  .children {
    margin-left: 20px;
  }
  </style>
  