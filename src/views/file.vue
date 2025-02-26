<template>
    <div>
      <h1>File Upload</h1>
      <input type="file" @change="onFileChange" />
      <button @click="uploadFile">Upload</button>
      
      <h2>Download File</h2>
      <input v-model="filename" placeholder="Enter filename to download" />
      <button @click="downloadFile">Download</button>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        file: null,
        filename: '',
        message: '',
      };
    },
    methods: {
      onFileChange(event) {
        this.file = event.target.files[0];
      },
      async uploadFile() {
        if (!this.file) {
          this.message = 'Please select a file first.';
          return;
        }
  
        const formData = new FormData();
        formData.append('file', this.file);
  
        try {
          const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          this.message = `File uploaded: ${data.filePath}`;
        } catch (error) {
          this.message = 'Upload failed.';
        }
      },
      downloadFile() {
        if (!this.filename) {
          this.message = 'Please enter a filename.';
          return;
        }
  
        window.open(`http://localhost:3000/download/${this.filename}`, '_blank');
      },
    },
  };
  </script>