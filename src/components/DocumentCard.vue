<!-- DocumentCard.vue -->
<script setup>
import { ref } from 'vue'
import { Star, MoreVertical, Upload, Clock, CheckCircle,FileIcon,FileSpreadsheetIcon ,FileArchive } from 'lucide-vue-next'

const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})

const isFavorite = ref(false)

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || colors.draft
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-SA')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <template v-if="document.requestType === 'Request' || !document.fileUrl">
          <Upload class="w-10 h-10 text-blue-600" />
        </template>
        <template v-else-if="document.type === 'PDF'">
          <FileIcon class="w-10 h-10 text-red-600" />
        </template>
        <template v-else-if="document.type === 'DOCX'">
          <FileSpreadsheetIcon class="w-10 h-10 text-green-600" />
        </template>
        <template v-else-if="document.type.startsWith('image/')">
          <img :src="document.fileUrl" alt="Document Image" class="w-10 h-10 object-cover rounded" />
        </template>
        <div>
          <h3 class="font-medium text-gray-900">{{ document.title }}</h3>
          <p class="text-sm text-gray-500">{{ document.type }} <span class="text-gray-400">({{ document.requestType }})</span></p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="isFavorite = !isFavorite" 
                class="p-1 hover:bg-gray-100 rounded-full">
          <Star :class="['w-5 h-5', isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400']" />
        </button>
        <button class="p-1 hover:bg-gray-100 rounded-full">
          <MoreVertical class="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    <div class="mt-4">
      <div class="flex items-center gap-2">
        <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(document.status)]">
          {{ document.status }}
        </span>
        <span class="text-sm text-gray-500">
          {{ formatDate(document.date) }}
        </span>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between text-sm">
      <div class="flex items-center gap-2 text-gray-500">
        <Clock class="w-4 h-4" />
        <span>{{ document.deadline }}</span>
      </div>
      <div class="flex items-center gap-2">
        <img 
          :src="document.userAvatar || 'https://picsum.photos/32'" 
          alt="User avatar" 
          class="w-6 h-6 rounded-full"
        />
        <span class="text-gray-600">{{ document.userName }}</span>
      </div>
    </div>
  </div>
</template>
