<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <h1 class="text-2xl font-bold mb-6">BOQ Bidder Form</h1>
    
      <!-- BOQ Selection -->
  <!--     <dlink 
          name="tender"
            label="tender"
            :value="form.tender"
            doctype="tender"
            @change="(v) => (form.tender = v)"
      /> -->
<FormControl
label="tender"
v-model="form.tender"
@change="fetchBOQItems"
/>


      <Autocomplete
        label="B-BOQ"
        v-model="form.b_boq"
        :options="bBoqOptions"
      />

      <!-- Price List Display -->
      <div v-if="form.pricelist">
        <label class="block text-sm font-medium mb-2">Price List (JSON)</label>
        <pre class="p-4 bg-gray-100 rounded">{{ formattedPriceList }}</pre>
      </div>

      <!-- Pricing Details -->
      <div class="grid grid-cols-2 gap-4">
        <FormControl
          label="Price Offer"
          v-model="form.final_price"
          type="number"
        />
        <FormControl
          label="Discount Percent (%)"
          v-model="form.discount_percent"
          type="number"
          min="0"
          max="100"
        />
        <FormControl
          label="Amount Discount"
          v-model="form.amount_discount"
          type="number"
        />
      </div>

      <!-- Status -->
      <Select
        label="Status"
        v-model="form.status"
        :options="statusOptions"
      />
     

      
</template>

<script setup>
import { ref, reactive, computed ,onMounted} from 'vue'
import { Autocomplete, FormControl, Select, Button, createResource} from 'frappe-ui'
import { useRoute } from 'vue-router'; // If using Vue Router
import dlink from '@/components/Controls/Link.vue';
import itemlist from './itemlist.vue';
// If using Vue Router, get route params
const route = useRoute();
const autoSetRFQ = ref(false);

onMounted(() => {
  // Check for RFQ in route params (if using Vue Router)
  const routeRFQ = route.params.tender;
  
  // Check for RFQ in props
  if ( routeRFQ) {
    const targetRFQ = routeRFQ;
    
    // Set RFQ value
    form.tender = targetRFQ;
    autoSetRFQ.value = true;
    
    // Load RFQ items automatically
    fetchBOQItems();
  }
});


const form = reactive({
  tender: null,
  b_boq: null,
  final_price: null,
  discount_percent: 0,
  items:[],
  amount_discount: 0,
  pricelist: null,
  status: 'Draft'
})

// Options for dropdowns
const statusOptions = [
  { label: 'Draft', value: 'Draft' },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Rejected', value: 'Rejected' }
]

// Fetch BOQ options
const boqOptions = createResource({
  url: 'frappe.client.get_list',
  params: {
    doctype: 'tender',
    fields: ['name', 'title']
  }
}).data

// Fetch B-BOQ options
const bBoqOptions = createResource({
  url: 'frappe.client.get_list',
  params: {
    doctype: 'bidder_quotation',
    fields: ['name', 'title'],
    filter:{'tender_name':form.boq}
  }
}).data

// Fetch items without prices when BOQ changes
async function fetchBOQItems() {
  if (!form.tender) return
  
  const resource = createResource({
    url: 'frappe.client.get',
    params: { doctype:'tender',name: form.tender }
  })
  
  await resource.fetch()
  form.items = resource.data.itemslist

}
const rates=reactive({})
// Fetch prices when B-BOQ changes
async function fetchPriceList() {
  if (!form.b_boq) return
  
  const resource = createResource({
    url: 'frappe.client.get',
    params: { doctype:'G BOQ',name: form.b_boq}
  })
  
  await resource.fetch()
  form.pricelist = resource.data
}

// Format price list for display
const formattedPriceList = computed(() => {
  return form.pricelist 
    ? JSON.stringify(form.pricelist, null, 2)
    : 'No price list available'
})

// Submit form
async function submitForm() {
  const doc = {
    doctype: 'Bidder',
    ...form,
    items: form.items,
    price_list: JSON.stringify(form.pricelist)
  }

  try {
    await createResource('G BOQ', doc)
    alert('Bid submitted successfully!')
  } catch (error) {
    alert('Error submitting bid: ' + error.message)
  }
}
</script>

<!-- Add this in your mock API responses -->
// Demo data for testing


