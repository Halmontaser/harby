<template>
    <div class="image-viewer">
      <img :src="url" alt="Image preview" class="max-w-full h-auto" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'ImageViewer',
    props: {
      url: {
        type: String,
        required: true
      }
    }
  }
  </script>