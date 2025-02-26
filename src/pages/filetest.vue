<template>
    <div>
      <DgHeader 
        title="File Manager" 
        status="Active"
        :actions="[
          { icon: 'edit', label: 'Edit' },
          { icon: 'trash', label: 'Delete' },
          { icon: 'refresh', label: 'Refresh' }
        ]"
      />
      <BodyContent 
      class="ml-5 px-3"
        :fileUrl="currentFileUrl" 
        :fileType="currentFileType"
        :fields="formFields"
        :modelValue="formValues"
      />
     
    </div>
  </template>
  
  <script>


import 'vue-files-preview/lib/style.css'
import { ref } from 'vue'
  import DgHeader from '../components/DgHeader.vue'
  import BodyContent from '../components/BodyContent.vue'
  
  export default {
    components: {
      DgHeader,
      BodyContent
    },
    setup() {
      const currentFileUrl = ref('')
      const currentFileType = ref('')
  
      const formFields = [

        { name: 'fileName', label: 'File Name', type: 'text' },
        { name: 'fileSize', label: 'File Size', type: 'number' },
        { name: 'uploadDate', label: 'Upload Date', type: 'date' },
        { name: 'fileCategory', label: 'Category', type: 'select', options: [
          { label: 'Document', value: 'document' },
          { label: 'Image', value: 'image' },
          { label: 'Spreadsheet', value: 'spreadsheet' }
        ]},
        { name: 'isPublic', label: 'Is Public', type: 'checkbox' }
      ]
  
      const formValues = {
        fileName: 'Sample File',
        fileSize: 1024,
        uploadDate: '2023-04-20',
        fileCategory: 'document',
        isPublic: false
      }
      const setCurrentFile = (type) => {
  switch(type) {
    case 'pdf':
      currentFileUrl.value = '/assets/1.pdf'; // Dummy PDF
      currentFileType.value = 'pdf';
      break;
      
    case 'docx':
      currentFileUrl.value = '/assets/1.docx'; // Sample DOCX
      currentFileType.value = 'docx';
      break;
          case 'image':
            currentFileUrl.value = '/assets/1.png'
            currentFileType.value = 'image'
            break
        }
      }
  
      return {
        currentFileUrl,
        currentFileType,
        formFields,
        formValues,
        setCurrentFile
      }
    }
  }
  </script>