
<template>
    <div class="mb-3 shadow-md border border-gray-400">
      <div class="md:flex justify-between">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-500">
            <i class="fa fa-life-saver"></i>
          </div>
          <div class="flex flex-col md:flex-row bg-gray-100 rounded-full border">
            <h6 class="my-auto mx-3">{{ event_translation }}</h6>
            <h6 class="my-auto mx-auto">{{ event_title }}</h6>
          </div>
        </div>
        <div class="flex">
          <div class="flex flex-col items-center justify-between bg-gray-700 text-white px-4">
            <h3 class="text-center m-0 p-0">{{ day }}</h3>
            <h2 class="m-0 p-0">{{ month }}</h2>
            <span class="badge bg-green-500">{{ time }} pm</span>
          </div>
          <div class="text-center bg-blue-500">
            <h3 class="m-0 p-0">{{ weekday }}</h3>
          </div>
        </div>
      </div>
      <div class="md:flex justify-between">
        <div class="flex">
          <i class="fa fa-address-card"></i>
          <small class="card-footer">العنوان : صنعاء -شارع حدة -امام مطعم الطازح -المؤسسة الوطنية للتنمية والاستجابة الانسانية <i class="fa fa-phone"></i> 7676868768 <i class="far fa-envelope"></i></small>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'events-tender',
    props: {
      datetime: {
        type: String,
        required: true,
      },
      event_title: {
        type: String,
        required: true,
      },
      event_translation: {
        type: String,
        required: true,
      },
      event_evenue: {
        type: String,
        required: true,
      },
      event_address: {
        type: String,
      
      },
      event_has_address: {
        type: Boolean,
        
      },
    },
    computed: {
      day() {
        const date = new Date(this.datetime);
        return date.getDate();
      },
      weekday() {
        const date = new Date(this.datetime);
        const options = { weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
      },
      month() {
        const date = new Date(this.datetime);
        const options = { month: 'short' };
        return date.toLocaleDateString('en-US', options);
      },
      time() {
        const date = new Date(this.datetime);
        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        return date.toLocaleTimeString('ar-sa', options);
      },
    },
  };
  </script>
  
  <style scoped>
  .badge {
    @apply px-2 py-1 rounded-full text-white;
  }
  </style>