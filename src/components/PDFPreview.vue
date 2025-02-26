<template>
  <LoadingIndicator
    v-if="loading"
    class="w-10 h-full text-neutral-100 mx-auto"
  />
  <div
    v-else
    class="max-h-[95vh] max-w-[75vw] bg-[#252728] rounded-lg shadow-xl"
  >
    <iframe class="w-full min-w-[75vw] h-[90vh]" :src="previewURL" />
  </div>
</template>

<script setup>
import { LoadingIndicator } from "frappe-ui"
import { onMounted, ref, watch } from "vue"
import { useObjectUrl } from "@vueuse/core"


const loading = ref(true)
const blob = ref(null)
const previewURL = useObjectUrl(blob)

async function fetchContent() {
  loading.value = true
  
  const res = await fetch(
    'http://localhost:8000/files/Country%20Safety%20Manager.pdf',
    {
      method: "GET"
    }
  )
  if (res.ok) {
    blob.value = await res.blob()
    loading.value = false
  }
}

watch(
  () => {
    fetchContent()
  }
)

onMounted(() => {
  fetchContent()
})
</script>
<style scoped></style>
