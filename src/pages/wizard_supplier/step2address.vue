<template>
    <div class="max-w-3xl mx-auto p-4">
      <div class="flex items-center space-x-2 mb-6">
        <MapPin class="w-6 h-6 text-blue-600" />
        <h2 class="text-2xl font-bold">Address Information</h2>
      </div>
  
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Address Title & Type -->
            <div class="relative">
              <FormControl
                v-model="formData.address_title"
                type="text"
                label="Address Title"
              >
                <template #prefix>
                  <Tag class="w-4 h-4 text-gray-500" />
                </template>
                <template #suffix>
                  <Button
                    v-tooltip="'Give a unique name to identify this address'"
                    variant="ghost"
                    class="p-1"
                  >
                    <HelpCircle class="w-4 h-4 text-gray-400" />
                  </Button>
                </template>
              </FormControl>
            </div>
  
            <div class="relative">
              <FormControl
                type="select"
                label="Address Type"
                v-model="formData.address_type"
                :options="addressTypeOptions"
                required
              >
                <template #prefix>
                  <List class="w-4 h-4 text-gray-500" />
                </template>
              </FormControl>
            </div>
  
            <!-- Address Lines -->
            <div class="col-span-2">
              <FormControl
                v-model="formData.address_line1"
                type="text"
                label="Address Line 1"
                maxlength="240"
              >
                <template #prefix>
                  <HomeIcon class="w-4 h-4 text-gray-500" />
                </template>
              </FormControl>
            </div>
  
            <div class="col-span-2">
              <FormControl
                v-model="formData.address_line2"
                type="text"
                label="Address Line 2"
                maxlength="240"
              >
                <template #prefix>
                  <HomeIcon class="w-4 h-4 text-gray-500" />
                </template>
              </FormControl>
            </div>
  
            <!-- City & State -->
            <div class="relative">
              <FormControl
                v-model="formData.city"
                type="text"
                label="City/Town"
                required
              >
                <template #prefix>
                  <Building2 class="w-4 h-4 text-gray-500" />
                </template>
              </FormControl>
            </div>
  
            <div class="relative">
              <FormControl
                v-model="formData.state"
                type="text"
                label="State/Province"
              >
                <template #prefix>
                  <Map class="w-4 h-4 text-gray-500" />
                </template>
              </FormControl>
            </div>
  
            <!-- Country & Postal Code -->
            <div class="relative">
              <FormControl
                type="select"
                label="Country"
                v-model="formData.country"
                :options="countryOptions"
                :defaultValue="'Yemen'"
              >
                <template #prefix>
                  <Globe class="w-4 h-4 text-gray-500" />
                </template>
              </FormControl>
            </div>
  
            <div class="relative">
              <FormControl
                v-model="formData.pincode"
                type="text"
                label="Postal Code"
              >
                <template #prefix>
                  <Hash class="w-4 h-4 text-gray-500" />
                </template>
              </FormControl>
            </div>
  
            <!-- Checkboxes -->
            <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center space-x-2">
                <FormControl
                  type="checkbox"
                  v-model="formData.is_primary_address"
                  label="Preferred Billing Address"
                >
                  <template #prefix>
                    <CreditCard class="w-4 h-4 text-gray-500" />
                  </template>
                  <template #suffix>
                    <Button
                      v-tooltip="'Set as default billing address'"
                      variant="ghost"
                      class="p-1"
                    >
                      <HelpCircle class="w-4 h-4 text-gray-400" />
                    </Button>
                  </template>
                </FormControl>
              </div>
  
              <div class="flex items-center space-x-2">
                <FormControl
                  type="checkbox"
                  v-model="formData.is_shipping_address"
                  label="Preferred Shipping Address"
                >
                  <template #prefix>
                    <Truck class="w-4 h-4 text-gray-500" />
                  </template>
                  <template #suffix>
                    <Button
                      v-tooltip="'Set as default shipping address'"
                      variant="ghost"
                      class="p-1"
                    >
                      <HelpCircle class="w-4 h-4 text-gray-400" />
                    </Button>
                  </template>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
  
        <div class="flex justify-end space-x-4">
          <Button
            type="submit"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            variant="solid"
            color="blue"
            class="flex items-center space-x-2"
          >
            <Save class="w-4 h-4" />
            <span>Save Address</span>
          </Button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { FormControl, Button,createResource } from 'frappe-ui'
  import {
    MapPin,
    Tag,
    List,
    HomeIcon,
    Building2,
    Map,
    Globe,
    Hash,
    CreditCard,
    Truck,
    HelpCircle,
    Save
  } from 'lucide-vue-next'
  
  const formData = ref({
    address_title: '',
    address_type: 'Billing',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'Yemen',
    pincode: '',
    is_primary_address: false,
    is_shipping_address: false
  })
  
  const isSubmitting = ref(false)
  
  const addressTypeOptions = [
    'Billing', 'Shipping', 'Office', 'Personal', 'Plant',
    'Postal', 'Shop', 'Subsidiary', 'Warehouse', 'Current',
    'Permanent', 'Other'
  ].map(type => ({ label: type, value: type }))
  
  const countryOptions = ref([
    { label: 'Yemen', value: 'Yemen' }
    // Add other countries as needed
  ])
  
  const isFormValid = computed(() => {
    return formData.value.address_type &&
           formData.value.city
  })
  
  const createAddress = createResource({
    url: 'yourapi/create-address',
    method: 'POST'
  })
  
  const handleSubmit = async () => {
    if (!isFormValid.value) return
    
    try {
      isSubmitting.value = true
      await createAddress.submit(formData.value)
      // Handle success (emit event or redirect)
    } catch (error) {
      console.error('Error submitting address:', error)
    } finally {
      isSubmitting.value = false
    }
  }
  </script>
  
  <style>
  .tooltip {
    @apply absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg;
  }
  </style>