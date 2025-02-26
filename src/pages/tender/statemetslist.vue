<template>
  <ObjectList 
  :options="listo"

/>
</template>

<script>
import ObjectList from '@/components/ObjectList.vue';


export default {
    components: {
        ObjectList
    },
    data() {
        return {
    listo: {
    doctype: 'tnd Bank Statement',
    fields: ['bank_account', 'bidder','from_date', 'to_date', 'closing_balance'],
    columns: [
      {
        label: 'Bank Account',
        fieldname: 'bank_account',
        width: 3,
       
      },
      {
        label: 'from',
        fieldname: 'from_date',
      
      },
      {
        label: 'bidder',
        fieldname: 'bidder',
      
      },
      {
        label: 'to',
        fieldname: 'to_date',
      
      }
            
    ],
    }
    }
    }}
</script>

<style>

</style>