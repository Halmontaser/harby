
<template>
  
      <Tabs v-model="tabIndex" :tabs="taboptions">
      <template #default="{ tab }">
      <div class="mt-4">
        <div v-if="tab.name === 'preview'">
          <h2 class="text-xl font-semibold mb-4">File Preview</h2>
          
          <PDFPreview />

          <!-- <div v-if="fileType === 'pdf'">
          <PDFViewer :url="fileUrl" />
        </div>
        <div v-else-if="fileType === 'docx'">
          <DOCXViewer :url="fileUrl" />
        </div>
        <div v-else-if="fileType === 'image'">
          <ImageViewer :url="fileUrl" />
        </div>
        <div v-else>
          <p>Unsupported file type or no file selected.</p>
        </div> -->
  
        </div>
  
        <div v-else-if="tab.name === 'filedata'">
  
          <h2 class="text-xl font-semibold mb-4">File Data</h2>
          <!-- Add your file data content here -->
          <p>Here you can see the details of your file.</p>
          <DynamicForm :fields="fields" :values="modelValue" @update:values="updateFormValues" />
        </div>
  
        <div class="mx-5" v-else-if="tab.name === 'validation'">
          <h2 class="text-xl font-semibold mb-4">Validation & Workflow</h2>
        
          <FormControl  type="checkbox" label="validate file" v-model="archived"/>
          <FormControl  type="checkbox" label="validate data" v-model="valid"/>
          <FormControl class="mt-5" type="text" label="staff note" v-model="notes"/>
          <h5 class="m-5 p-2 bg-blue-100">actions allowed to supplier to update datafile in case of the comments</h5>
          <div class="mx-5 space-x-3">
          <FormControl type="checkbox" label="allowed to update file" v-model="allowed_to_attached"/>
          <FormControl type="checkbox" label="allowed to update data attached" v-model="allowed_to_update"/>
        </div>
          <!-- Add your validation and workflow content here -->
          <p>This section shows the validation status and workflow of your file.</p>
        </div>
      </div>
    </template>
      </Tabs>
  </template>
  
  <script setup>
  import PDFPreview from "./PDFPreview.vue"
  import {FormControl} from "frappe-ui"
  import { ref,h } from 'vue'
  import { Tabs} from 'frappe-ui'
  import ImageViewer from './ImageViewer.vue';
import { FeatherIcon } from 'frappe-ui';
import DynamicForm from './DynamicForm.vue'
  const file="1.pdf"
      const tabIndex = ref(0)
      const taboptions=[{name:"preview",icon:h(FeatherIcon,{name:'aye'}),label:"Preview"},
        {name:"filedata", icon:h(FeatherIcon,{name:'file-text'}),label:"File Data" },
        {name:"validation",icon:h(FeatherIcon,{name:'check-circle'}),label:"Validation & Workflow"}]
    const props= defineProps({
      
    fileUrl: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Object,
      default: () => ({})
    }})




  </script>