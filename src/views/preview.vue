
<template>
  <FilePreviewDialog
    :row="row"
    @open="logEvent('Preview opened')"
    @close="logEvent('Preview closed')"
  >
    <!-- Custom Trigger -->
    <template #trigger="{ openPreview }">
      <Button
        icon="eye"
        label="View document"
        @click="openPreview"
      />
    </template>

    <!-- Additional Actions -->
    <template #actions="{ fileData }">
      <Button
        label="Download"
        @click="downloadFile(fileData)"
      />
    </template>
  </FilePreviewDialog>
</template>
<script setup>
  import FilePreviewDialog  from '@/views/FilePreviewDialog.vue';
  import { Button } from 'frappe-ui';

defineProps({
  row: Object,
  required: true
});
</script>

  
