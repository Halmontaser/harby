<template>
    <div class="w-full p-4">
      <h1 class="text-2xl font-bold mb-6">BOQ Bidder Form</h1>
    
    <!-- BOQ Selection -->
<!--     <dlink 
        name="tender"
          label="tender"
          :value="form.tender"
          doctype="tender"
          @change="(v) => (form.tender = v)"
    /> -->



    
  

    <!-- Pricing Details -->
    <div class="grid grid-cols-2 gap-4">
      <FormControl
label="tender"
class="w-50"
v-model="form.tender"
@change="fetchBOQItems"
/>
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
    
      <!-- Search and Filter Controls -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search items..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="categoryFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button
            @click="exportToCSV"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>
  
      <!-- Table Container -->
      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                v-for="header in headers" 
                :key="header.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy(header.key)"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ header.label }}</span>
                  <span v-if="sortColumn === header.key" class="text-blue-500">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="(group, category) in groupedItems" :key="category">
              <!-- Category Header Row -->
              <tr class="bg-gray-100">
                <td 
                  colspan="5" 
                  class="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {{ category }}
                </td>
                <td class="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  {{ calculateCategoryTotal(group) }}
                </td>
              </tr>
              
              <!-- Category Items -->
              <tr 
                v-for="item in group" 
                :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 pl-8">
                  {{ item.id }}
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 mb-1">
                    {{ item.name }}
                    <span 
                      v-if="item.quantity < 100"
                      class="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
                    >
                      Low Stock
                    </span>
                  </div>
                  <div 
                    class="text-sm text-gray-500 overflow-hidden"
                    :class="{ 'line-clamp-2': !expandedRows.has(item.id) }"
                  >
                    {{ item.description }}
                  </div>
                  <button
                    v-if="item.description.length > 100"
                    @click="toggleExpand(item.id)"
                    class="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    {{ expandedRows.has(item.id) ? 'Read less' : 'Read more' }}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 ml-1 transform transition-transform"
                      :class="{ 'rotate-90': expandedRows.has(item.id) }"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.uom }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  
                    {{ item.quantity }}
               
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    v-model.number="rates[item.id]"
                    @input="validateRate($event, item.id)"
                    class="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter rate"
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span :class="getAmountColor(calculateAmount(item))">
                    {{ calculateAmount(item) }}
                  </span>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="5" class="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                Total Amount:
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {{ totalAmount }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, reactive, computed ,onMounted,watch} from 'vue'
import { Autocomplete, FormControl, Select, Button, createResource} from 'frappe-ui'
import { useRoute } from 'vue-router'; // If using Vue Router
const route = useRoute();
const autoSetRFQ = ref(false);

import dlink from '@/components/Controls/Link.vue';
  const searchQuery = ref('')
  const categoryFilter = ref('')

  const expandedRows = ref(new Set())
  const rates = ref({})
  const sortColumn = ref('id')
  const sortDirection = ref('asc')
  const headers = [
    { key: 'id', label: 'No.' },
    { key: 'name', label: 'Item Details' },
    { key: 'uom', label: 'UOM' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'rate', label: 'Rate' },
    { key: 'amount', label: 'Amount' }
  ]
  
 
  
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
const bBoqOptions = []

// Fetch items without prices when BOQ changes
async function fetchBOQItems() {
  if (!form.tender) return
  
  const resource = createResource({
    url: 'frappe.client.get',
    params: { doctype:'tender',name: form.tender }
  })
  
  await resource.fetch()
  form.items = resource.data.itemslist.map(r => ({
  id:r.idx,
  name:r.item_name,
  description:r.discription,
  category:r.maingroup,
  uom:r.unit,
  quantity:r.qnty,
}))

}
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



  // Computed Properties
  watch(() => form.items, (newItems, oldItems) => {
  console.log('form.items changed:', newItems);
}, { deep: true });
  const uniqueCategories = computed(() => {
    return [...new Set(form.items.map(item => item.category))]
  })
  
  const filteredItems = computed(() => {
    return form.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = !categoryFilter.value || item.category === categoryFilter.value
      return matchesSearch && matchesCategory
    })
  })
  
  const groupedItems = computed(() => {
    const grouped = {}
    filteredItems.value.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    return grouped
  })
  
  const calculateCategoryTotal = (items) => {
    return items.reduce((sum, item) => {
      const amount = parseFloat(calculateAmount(item)) || 0
      return sum + amount
    }, 0).toFixed(2)
  }
  
  const totalAmount = computed(() => {
    return filteredItems.value.reduce((sum, item) => {
      const rate = rates.value[item.id] || 0
      return sum + (rate * item.quantity)
    }, 0).toFixed(2)
  })
  
  // Methods remain the same as in previous version
  const toggleExpand = (id) => {
    if (expandedRows.value.has(id)) {
      expandedRows.value.delete(id)
    } else {
      expandedRows.value.add(id)
    }
  }
  
  const calculateAmount = (item) => {
    const rate = rates.value[item.id] || 0
    return rate ? (rate * item.quantity).toFixed(2) : '-'
  }
  
  const validateRate = (event, id) => {
    const value = parseFloat(event.target.value)
    if (value < 0) {
      rates.value[id] = 0
      
    }
    console.log(rates.value)
  }
  
  const getAmountColor = (amount) => {
    if (amount === '-') return 'text-gray-500'
    const value = parseFloat(amount)
    if (value) return 'text-green-600'
    if (!value) return 'text-red-600'
    return 'text-gray-900'
  }
  
  const exportToCSV = () => {
    const headers = ['Category', 'ID', 'Name', 'UOM', 'Quantity', 'Rate', 'Amount']
    const data = filteredItems.value.map(item => [
      item.category,
      item.id,
      item.name,
      item.uom,
      item.quantity,
      rates.value[item.id] || 0,
      calculateAmount(item)
    ])
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'inventory.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  </style>