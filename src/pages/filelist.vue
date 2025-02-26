<!-- index.vue -->
<script setup>
import { ref, computed } from 'vue'
import DocumentCard from '@/components/DocumentCard.vue'
import { Button, Input, Dialog } from 'frappe-ui'
import uploader from '@/components/uploader.vue'

const documents = ref([
  {
    id: 1,
    title: 'طلب موافقة',
    type: 'PDF',
    requestType: 'Request',
    status: 'pending',
    date: '2024-01-10',
    deadline: '2024-01-15',
    userName: 'أحمد محمد',
    userAvatar: 'https://picsum.photos/32/32',
    fileUrl: 'https://picsum.photos/32/32'
  },
  {
    id: 2,
    title: 'تقرير شهري',
    type: 'DOCX',
    requestType: 'Request',
    status: 'pending',
    date: '2024-01-10',
    deadline: '2024-01-15',
    userName: 'أحمد محمد',
    userAvatar: 'https://picsum.photos/32/32',
    fileUrl: 'https://picsum.photos/32/32'
  },
  {
    id: 3,
    title: 'تقرير نصف السنوي',
    type: 'PDF',
    requestType: 'complete',
    status: 'approved',
    date: '2024-01-10',
    deadline: '2024-01-15',
    userName: 'أحمد محمد',
    userAvatar: 'https://picsum.photos/32/32',
    fileUrl: 'https://picsum.photos/32/32'
  },
  {
    id: 4,
    title: 'تقرير نهاية العام',
    type: 'DOCX',
    requestType: 'complete',
    status: 'rejected',
    date: '2024-01-10',
    deadline: '2024-01-15',
    userName: 'أحمد محمد',
    userAvatar: 'https://picsum.photos/32/32',
    fileUrl: 'https://picsum.photos/32/32'
  },
  {
    id: 5,
    title: 'تقرير نهاية العام',
    type: 'PDF',
    requestType: 'Request',
    status: 'draft',
    date: '2024-01-10',
    deadline: '2024-01-15',
    userName: 'أحمد محمد',
    userAvatar: 'https://picsum.photos/32/32',
    fileUrl: 'https://picsum.photos/32/32'
  },
  {
    id: 6,
    title: 'تقرير نهاية العام',
    type: 'DOCX',
    requestType: 'Request',
    status: 'draft',
    date: '2024-01-10',
    deadline: '2024-01-15',
    userName: 'أحمد محمد',
    userAvatar: 'https://picsum.photos/32/32',
    fileUrl: 'https://picsum.photos/32/32'
  },
])

const statusFilters = ref([
  { label: 'الكل', value: 'all' },
  { label: 'قيد الانتظار', value: 'pending' },
  { label: 'تم الموافقة', value: 'approved' },
  { label: 'مرفوض', value: 'rejected' }
])

const selectedStatus = ref('all')
const showUploadDialog = ref(false)
const newDocument = ref({
  title: '',
  type: '',
  file: null
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newDocument.value.file = file
    newDocument.value.type = file.type
  }
}

const submitDocument = () => {
  if (!newDocument.value.title || !newDocument.value.file) return

  const newDoc = {
    id: documents.value.length + 1,
    title: newDocument.value.title,
    type: newDocument.value.type,
    requestType: 'Request',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    userName: 'المستخدم الحالي',
    userAvatar: 'https://picsum.photos/32/32',
    fileUrl: URL.createObjectURL(newDocument.value.file)
  }

  documents.value.unshift(newDoc)
  showUploadDialog.value = false
  newDocument.value = { title: '', type: '', file: null }
}

const filteredDocuments = computed(() => {
  if (selectedStatus.value === 'all') return documents.value
  return documents.value.filter(doc => doc.status === selectedStatus.value)
})
</script>

<template>
  <uploader modelvalue="6"/>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex gap-2">
        <Button 
          v-for="filter in statusFilters" 
          :key="filter.value"
          :variant="selectedStatus === filter.value ? 'solid' : 'outline'"
          @click="selectedStatus = filter.value"
        >
          {{ filter.label }}
        </Button>
      </div>
      <Button variant="solid" color="blue" @click="showUploadDialog = true">
        رفع مستند جديد
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DocumentCard 
        v-for="document in filteredDocuments" 
        :key="document.id" 
        :document="document" 
      />
    </div>

    <Dialog
      v-model="showUploadDialog"
      title="رفع مستند جديد"
    >
      <div class="space-y-4 p-4">
        <Input
          v-model="newDocument.title"
          label="عنوان المستند"
          placeholder="أدخل عنوان المستند"
        />
        
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            الملف
          </label>
          <input
            type="file"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <Button variant="outline" @click="showUploadDialog = false">
            إلغاء
          </Button>
          <Button variant="solid" color="blue" @click="submitDocument">
            رفع المستند
          </Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* RTL Support */
:root {
  direction: rtl;
}
</style>
