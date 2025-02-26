<template>
  <div class="document-list">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="doc in documents" :key="doc.type" class="document-item">
        <div
          class="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          @click="handleDocumentClick(doc)"
        >
        
          <!-- Document Icon -->
          <div class="mr-4">
            <span v-if="!doc.uploaded" class="text-gray-400">
              <FeatherIcon :name="doc.icon" class="w-6 h-6" />
            </span>
            <span v-else class="text-green-500">
              <FeatherIcon name="check-circle" class="w-6 h-6" />
            </span>
          </div>

          <!-- Document Info -->
          <div class="flex-1">
            <h2 class="text-base font-bold text-gray-900">{{ doc.name }}</h2>
            <p class="text-sm text-gray-500">
              {{ doc.uploaded ? 'Uploaded' : 'Not uploaded' }}
            </p>
          </div>
          <Uploader modelValue="s"/>
     
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button, FeatherIcon } from 'frappe-ui'
import BaseIcon from '../BaseIcon.vue'
import Uploader from '@/components/uploader.vue'
const documents = ref([
  {
    type: 'tax_id',
    name: 'Tax ID',
    icon: 'plus',
    uploaded: true,
    file: null
  },
  {
    type: 'insurance_id',
    name: 'insurance ID',
    icon: 'cog',
    uploaded: true,
    file: null
  },
  {
    type: 'invoice',
    name: 'Invoice',
    icon: 'check',
    uploaded: false,
    file: null
  },
  {
    type: 'license',
    name: 'Business License',
    icon: 'file-text',
    uploaded: false,
    file: null
  }
])


const removeDocument = (doc) => {
  const index = documents.value.findIndex(d => d.type === doc.type)
  if (index !== -1) {
    documents.value[index] = {
      ...documents.value[index],
      uploaded: false,
      file: null
    }
  }
}

const handleDocumentClick = (doc) => {
  // Handle document click (e.g., preview document)
  console.log('Document clicked:', doc)
}

// Simulate upload delay
const simulateUpload = (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}
</script>

<style scoped>
.document-list {
  padding: 1rem;
}

.document-item {
  transition: all 0.3s ease;
}

.document-item:hover {
  transform: translateY(-2px);
}
</style>