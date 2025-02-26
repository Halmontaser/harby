<template>
    <div>
      <tree-select
        :tree-data="doctypeTree"
        v-model="selectedNodes"
        @update:modelValue="handleSelection"
      />
      <div>
        <h3>Selected Nodes:</h3>
        <ul>
          <li v-for="node in selectedNodes" :key="node.id">
            {{ node.label }}
          </li>
        </ul
        >
      </div>
    </div>
    <h1>what the wrong in this </h1>
    <div class="bg-gray-900">
    <TreeView class="bg-dark-900" :items="doctypeTree" />
  </div>
    <!-- <div>
    <Tree
        :options="{
          showIndentationGuides: state.showIndentationGuides,
          rowHeight: state.rowHeight,
          indentWidth: state.indentWidth,
        }"
        nodeKey="name"
        :node="state.node"
      />
      </div> -->
  </template>
  <script>
  import TreeView from '../components/viewtree.vue';
  import TreeSelect from './TreeSelect.vue';
  export default {
    components: {
      TreeSelect,
      TreeView
    
    },
    data() {
      return {
        doctypeTree:[
  {
    "id": "1",
    "label": "Electronics",
    "children": [
      {
        "id": "1.1",
        "label": "Computers",
        "children": [
          {
            "id": "1.1.1",
            "label": "Laptops"
          },
          {
            "id": "1.1.2",
            "label": "Desktops"
          }
        ]
      },{"id": "1.2",
        "label": "TV",
  }]
  }
],
        selectedNodes: [],
        state:{
  showIndentationGuides: true,
  rowHeight: '25px',
  indentWidth: '15px',
  node: {
    name: 'guest',
    label: 'Guest',
    children: [
      {
        name: 'downloads',
        label: 'Downloads',
        children: [
          {
            name: 'download.zip',
            label: 'download.zip',
            children: [
              {
                name: 'image.png',
                label: 'image.png',
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: 'documents',
        label: 'Documents',
        children: [
          {
            name: 'somefile.txt',
            label: 'somefile.txt',
            children: [],
          },
          {
            name: 'somefile.pdf',
            label: 'somefile.pdf',
            children: [],
          },
        ],
      },
    ],
  },
}
      };
    },
    methods: {

      handleSelection(selectedNodes) {
        // Handle the selection
        console.log('Selected nodes:', selectedNodes);
        
        // Here you can make an API call to update the selection
      
      },
      
  }
};
  </script>
  