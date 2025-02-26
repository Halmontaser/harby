<template>
  <div class="w-full p-4">
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
                <div class="flex items-center space-x-2">
                  <button 
                    @click="decrementQuantity(item)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    -
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button 
                    @click="incrementQuantity(item)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    +
                  </button>
                </div>
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
import { ref, computed } from 'vue'

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

const items = ref([
  {
    id: 1,
    category: "Beverages",
    name: "Premium Coffee Beans",
    description: "Arabica coffee beans sourced from Ethiopian highlands. These premium beans are carefully selected and roasted to perfection.",
    uom: "KG",
    quantity: 250
  },
  {
    id: 2,
    category: "Beverages",
    name: "Organic Green Tea",
    description: "High-grade organic green tea leaves harvested from the mountains of Japan.",
    uom: "GM",
    quantity: 50
  },
  {
    id: 3,
    category: "Condiments",
    name: "Himalayan Pink Salt",
    description: "Pure Himalayan pink salt mined from ancient sea salt deposits.",
    uom: "KG",
    quantity: 100
  },
  {
    id: 4,
    category: "Condiments",
    name: "Black Pepper",
    description: "Premium black peppercorns from Kerala, India.",
    uom: "GM",
    quantity: 150
  },
  {
    id: 5,
    category: "Beverages",
    name: "Earl Grey Tea",
    description: "Classic Earl Grey tea with bergamot essence.",
    uom: "GM",
    quantity: 75
  }
])

// Computed Properties
const uniqueCategories = computed(() => {
  return [...new Set(items.value.map(item => item.category))]
})

const filteredItems = computed(() => {
  return items.value.filter(item => {
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
}

const incrementQuantity = (item) => {
  item.quantity++
}

const decrementQuantity = (item) => {
  if (item.quantity > 0) {
    item.quantity--
  }
}

const getAmountColor = (amount) => {
  if (amount === '-') return 'text-gray-500'
  const value = parseFloat(amount)
  if (value > 1000) return 'text-green-600'
  if (value < 100) return 'text-red-600'
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