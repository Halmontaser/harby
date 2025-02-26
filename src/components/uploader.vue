<template>
  <FileUploader
    :upload-args="{
      doctype: 'Party Documents',
      docname: modelvalue,
      is_private: true,
      fieldname:'attached_file',
      
    }"
    @success="handleSuccess"
  >
    <template v-slot="{file, 
          uploading,
          progress,
          uploaded,
          message,
          error,
          total,
          success,
          openFileSelector
          }">

         <!--  <Button  @click="openFileSelector" :loading="uploading">
          {{ uploading ? `Uploading ${progress}%` : '' }}
      </Button> -->
      <div class="flex justify-center space-x-3">
              <button class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                <Download class="w-6 h-6" />
              </button>
              <button class="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                <Upload class="w-6 h-6" />
              </button>
              <button class="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                <FileInput class="w-6 h-6" />
              </button>
              <button class="p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
                <CheckCircle class="w-6 h-6" />
              </button></div>
    </template>
  </FileUploader>
</template>

<script>
import { defineComponent } from 'vue';
import { FileUploader, Button,call} from 'frappe-ui';
import Icon from './Icon.vue';
import { LucideUpload ,LucideDownload, LucideView} from 'lucide-vue-next';

import { Download, Upload, FileInput, CheckCircle } from 'lucide-vue-next';
import Supplier from '@/pages/supplier/supplier.vue';
import { createFilterWrapper } from '@vueuse/core';

export default defineComponent({
  name: 'FileUploadComponent',
  components: {
    Download,
    Upload,
    CheckCircle,
    FileInput,
    FileUploader,
    Button,
    call
  },
  props: {
    modelvalue: {
      type: String,
      required: true
    }
  },
  methods: {
   async handleSuccess(file) {
    console.log(file);
    await call('frappe.client.set_value', {
    doctype:'Party Documents',
    name:file.attached_to_name,
    fieldname:{attached_file:file.file_url}//supplier and tender
  
  });
  alert("doooooooo")
    }
  }
});
</script>