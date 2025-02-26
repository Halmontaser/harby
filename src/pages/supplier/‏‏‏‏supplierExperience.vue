<script setup>
import { FeatherIcon,FileUploader} from 'frappe-ui';
import { reactive,h,computed} from 'vue';



import ObjectList from '@/components/ObjectList.vue';

const simple_columns = computed(()=>[
  { label: 'Name', key: 'name', width:"30%"},
  { label: 'Email', key: 'email', width:"30%" },
  { label: 'Role', key: 'role' },
  { label: 'Status', key: 'status' },
   {
    label: 'action',
    key: 'RR',
    width: 3,
  }
])

const simple_rows = [
  { id: 1, name: 'John Doe', eil: 'john@doe.com', status: 'Active', role: 'Developer' },
  { id: 2, name: 'harby Doe', email: 'jane@doe.com', status: 'Inactive', role: 'HR' },
  { id: 3, name: 'harby', email: 'harby@doe.com', status: 'Active', role: 'Developer' },
];
// Define options directly
const options =reactive({
  selectable: true,
  columns:simple_columns,
  showTooltip: true,
  data: simple_rows,
  emptyState:{
    title: 'No records found',
    description: 'Create a new record to get started',
    button: {
      label: 'New Record',
      variant: 'solid',
      onClick: () => console.log('New Record'),
    }
  },
  onRowClick: (row) => {
    console.log(row);
  }
})

 

</script>
<template>
  <GenericList
    :options="options"
  />
</template>