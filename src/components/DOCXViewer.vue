<template>
  <div class="docx-viewer" v-html="content"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import mammoth from 'mammoth'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const content = ref('')

const loadDocument = async () => {
  try {
    const response = await fetch(props.url)
    const arrayBuffer = await response.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    content.value = result.value
  } catch (error) {
    console.error('Error loading DOCX file:', error)
    content.value = 'Error loading document'
  }
}

onMounted(loadDocument)

watch(() => props.url, loadDocument)
</script>

<style scoped>
.docx-viewer {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  padding: 20px;
}
</style>
