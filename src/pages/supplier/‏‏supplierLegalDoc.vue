<script setup>
import {FormControl,
  Autocomplate
} from "frappe-ui";
import {reactive} from 'vue'
let  state = reactive({fullname:" ",age:" ",image:""})

</script>

<template>
<div
  class="p-2"
  label="full name "
  description="write yoiur name "
  type="text"
  size=""
>
  <FormControl
    :type="'text'"
    :ref_for="true"
    size="md"
    variant="subtle"
    placeholder="Placeholder"
    :disabled="false"
    label="Label"
    v-model="state.fullname"
  />
</div>



<div class="p-2">
  <Autocomplete ,v-model="state.image"
    :options="[
      {
        label: 'John Doe',
        value: 'john-doe',
      },
      {
        label: 'Jane Doe',
        value: 'jane-doe',
      },
      {
        label: 'John Smith',
        value: 'john-smith',
      },
      {
        label: 'Jane Smith',
        value: 'jane-smith',
      },
      {
        label: 'John Wayne',
        value: 'john-wayne',
      },
      {
        label: 'Jane Wayne',
        value: 'jane-wayne',
      },
    ]"
    v-model="value"
    placeholder="Select person"
  />
</div>
<FormControl v-model="age" label="age" type="number"/>
</template>
