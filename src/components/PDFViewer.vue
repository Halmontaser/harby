<template>
  <div class="pdf-viewer" ref="pdfContainer"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const props = defineProps({
  url: {
    type: String,
    required: true
  }
});

const pdfContainer = ref(null);
const currentPage = ref(1);
const totalPages = ref(0);
const scale = ref(1);

const renderPage = async (pdf, pageNum) => {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: scale.value });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext);
  pdfContainer.value.innerHTML = '';
  pdfContainer.value.appendChild(canvas);
};

const loadPDF = async () => {
  try {
    const loadingTask = pdfjsLib.getDocument(props.url);
    const pdf = await loadingTask.promise;
    totalPages.value = pdf.numPages;
    await renderPage(pdf, currentPage.value);
  } catch (error) {
    console.error('Error loading PDF:', error);
  }
};

onMounted(loadPDF);
watch(() => props.url, loadPDF);


<style scoped>
.pdf-viewer {
  margin-top: 20px;
}
</style>