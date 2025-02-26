<template>
    <div class="flex flex-col md:flex-row mb-3 shadow-md border border-gray-300">
      <div class="flex items-center md:justify-between md:flex-1">
        <div class="flex items-center justify-center w-12 h-12 bg-green-400 text-white">
          <FeatherIcon name="mail" />
        </div>
        <div class="flex flex-col md:flex-row items-center justify-center md:justify-between md:pl-4 md:py-2 bg-gray-100 rounded-lg border border-gray-200">
          <h6 class="text-md md:text-base px-3">اخر موعد لإستلام الوثائق</h6>
          <h6 class="text-md md:text-base px-3">DEADLINE SUBMISSION</h6>
        </div>
        <div class="flex md:flex-row items-center md:justify-between md:pl-4 md:py-2">
          <div class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 text-white px-4">
            <h3 class="text-center m-0 p-0 text-xl">15</h3>
            <h2 class="m-0 p-0 text-sm">JUN</h2>
            <span class="bg-red-500 text-white text-xs">21:00م</span> <!-- Added 'م' for 'pm' -->
          </div>
          <div class="hidden md:block month"></div>
          <div class="flex items-center justify-center bg-gray-800 text-white text-xl md:text-right transform rotate-90" > <!-- Added 'md:text-right' for right-aligned weekdays -->
            <h3 class="m-0 p-0 flex-1">التلاثاء</h3>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DeadlineCard'
  }
  </script>