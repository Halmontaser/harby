<template>
  <div class="flex h-screen w-screen">
    <MobileSidebar />
    <div class="flex h-full flex-1 flex-col overflow-auto">
      <MobileAppHeader />
      <slot />
    </div>
  </div>
</template>
<script setup>
import MobileSidebar from './../Mobile/MobileSidebar.vue'
import MobileAppHeader from './../Mobile/MobileAppHeader.vue'
</script>
