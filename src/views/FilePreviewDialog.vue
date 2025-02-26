<template>
  <div>
    <!-- Trigger Slot (use anywhere to activate preview) -->
    <slot name="trigger" :openPreview="openPreview">
      <Button @click="openPreview" label="Preview File" />
    </slot>

    <!-- Preview Dialog -->
    <Dialog
      v-model="showPreview"
      title="File Preview"
      :dismissable="true"
      :width="width"
      @close="handleClose"
    >
      <template #body>
        <!-- Loading State -->
        <div 
          v-if="loading" 
          class="flex items-center justify-center h-64"
        >
          <Spinner size="lg" />
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="p-4 text-red-600 bg-red-50 rounded-lg"
        >
          <AlertCircle class="w-5 h-5 mr-2 inline" />
          {{ error }}
        </div>

        <!-- Preview Content -->
        <div v-else class="vue-preview-container">
          <VueFilesPreview 
            :file="fileData"
            :key="previewKey"
            class="rounded-lg overflow-hidden"
          />
        </div>
      </template>

      <!-- Footer Slot -->
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            @click="showPreview = false"
            label="Close"
            variant="subtle"
          />
          <slot name="actions" :fileData="fileData" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Dialog, Button, Spinner,call } from 'frappe-ui';
import { VueFilesPreview } from 'vue-files-preview';
import { AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  row: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: String,
    default: '4xl'
  },
  maxHeight: {
    type: String,
    default: '80vh'
  }
});

const emit = defineEmits(['open', 'close', 'error']);

// Reactive State
const showPreview = ref(false);
const fileData = ref(null);
const loading = ref(false);
const error = ref(null);
const previewKey = ref(0);

// Get file extension from Frappe File doc
const fileType = computed(() => {
  if (!fileData.value?.type) return '';
  return fileData.value.type.split('/').pop();
});

// Fetch file data from Frappe API
const fetchFileData = async (row) => {
  try {
    async function getFileType() {
      const result = await call('frappe.client.get_value', { doctype: 'File', filters: { file_url: row.file_url }, fieldname: ['file_type','file_name']});
      ;
  }    return {
      url: row.file_url,
      type: result.file_type,
      name: result.file_name,
      title:row.attachment_type
    };
  } catch (err) {
    throw new Error('Failed to fetch file: ' + err.message);
  }
};

// Open preview dialog
const openPreview = async (customFileId) => {
  try {
    loading.value = true;
    error.value = null;
    emit('open');

    const fileId = customFileId || props.row.attached_file;
    if (!fileId) throw new Error('No file ID provided');

    fileData.value = await fetchFileData(fileId);
    previewKey.value++; // Force re-render
    showPreview.value = true;
  } catch (err) {
    error.value = err.message;
    emit('error', err);
  } finally {
    loading.value = false;
  }
};

// Reset state on close
const handleClose = () => {
  if (fileData.value?.url?.startsWith('blob:')) {
    URL.revokeObjectURL(fileData.value.url);
  }
  fileData.value = null;
  emit('close');
};
</script>

<style scoped>
.vue-preview-container {
  max-height: v-bind('props.maxHeight');
  min-height: 300px;
}

:deep(.vue-files-preview-container) {
  @apply rounded-lg shadow-sm border;
}

:deep(.vue-files-preview-container iframe) {
  @apply w-full min-h-[400px] border-0;
}
</style>