<template>
  <Dialog v-model="show" :options="{ size: '3xl' }">
    <template #body-title>
      <h3
        class="flex items-center gap-2 text-2xl font-semibold leading-6 text-gray-900"
      >
        <div>'Edit Field Layout'</div>
        <Badge
          
          label="Not Saved"
          variant="subtle"
          theme="orange"
        />
      </h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-5.5">
        <div class="flex justify-between gap-2">
          hellow harby this is first columns test
        </div>
        
      </div>
    </template>
    <template #actions>
      <div class="flex flex-row-reverse gap-2">
        <Button
          loading="loading"
          label='Save'
          variant="solid"
        />
        <Button :label='Reset' />
      </div>
    </template>
  </Dialog>
</template>

<script setup>

import { ref  } from 'vue'
import {
  Button,
  Dialog,
  Badge
}
   from
    "frappe-ui"
const show = defineModel()

</script>
