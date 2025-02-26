<template>
    <form class="grid grid-cols-[repeat(auto-fit, minmax(200px,1fr))]">
      
        <FormControl
          v-for="field in fields" 
          :key="field.name"
          :type="field.type"
          :modelValue="modelValue[field.name]"
          :label="field.label"
          :options="field.options"
          :placeholder="field.placeholder"
        />

      
      
      <Button type="submit" label="Save" />
    </form>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  import { FormControl,Button } from 'frappe-ui'
  
  const props=defineProps({
      fields: {
        type: Array,
        required: true
      },
      values: {
        type: Object,
        default: () => ({})
      }
    })
    let modelValue=ref({ ...props.values })
    const emit = defineEmits(['update:modelValue'],'submit')
    watch (()=> props.values,(newValues) => {modelValue={...newValues} })
    watch(modelValue,()=>{emit('update:values',newValues)})
    
</script>