
<template>
  <h1>supplier capacity</h1>
  <Button @click="dialog1 = true">
  Show Dialog
</Button>
<Dialog v-model="dialog1"
  :options="{
    title: 'Confirm',
    message: 'Are you sure you want to confirm this action?',
    size: 'xl',
    actions: [
      {
        label: 'Confirm',
        variant: 'solid',
        onClick: () => {
                },
      },
    ],
  }"
  
/>
</template>
<script setup>
import { Badge, Button ,Dialog} from 'frappe-ui'
import { ref } from 'vue'
const dialog1=ref(false)
//import badge as comonents in the file 

</script>


