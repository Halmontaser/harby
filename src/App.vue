<template>
  <Layout v-if="sessionStore">

    <router-view />
  </Layout>
  <Toaster position="top-right" />
		<component v-for="dialog in dialogs" :is="dialog" :key="dialog.id" />

</template>

<script setup>
// import { sessionStore as session } from '@/stores/session'
import { computed, ref,defineAsyncComponent } from 'vue'

import { dialogs } from './utils/components';


const sessionStore =ref(true)
const MobileLayout = defineAsyncComponent(() =>
  import('./components/Layouts/MobileLayout.vue')
)
const DesktopLayout = defineAsyncComponent(() =>
  import('./components/Layouts/DesktopLayout.vue')
)
const Layout = computed(() => {
  if (window.innerWidth < 640) {
    return MobileLayout
  } else {
    return DesktopLayout
  }
})
</script>
