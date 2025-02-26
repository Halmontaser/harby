<template>
  <div class="max-w-3xl mx-auto p-4">
    <div class="flex items-center space-x-2 mb-6">
      <UserPlus class="w-6 h-6 text-blue-600" />
      <h2 class="text-2xl font-bold">Bidder Registration - General Information</h2>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center space-x-2 mb-4">
          <FileText class="w-5 h-5 text-gray-600" />
          <h3 class="text-lg font-semibold">Basic Details</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="relative">
            <FormControl
              v-model="formData.bidder_name"
              type="text"
              label="Bidder Name"
              :validate="validateEnglishText"
              required
            >
              <template #prefix>
                <User class="w-4 h-4 text-gray-500" />
              </template>
              <template #suffix>
                <Button
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
              v-model="formData.register_no"
              type="text"
              label="Register Number"
              required
            >
              <template #prefix>
                <Hash class="w-4 h-4 text-gray-500" />
              </template>
              <template #suffix>
                <Button
                  v-tooltip="'Unique registration number required'"
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
              v-model="formData.bidder_name_ar"
              type="text"
              label="Bidder Name (Arabic)"
              :validate="validateArabicText"
            >
              <template #prefix>
                <Languages class="w-4 h-4 text-gray-500" />
              </template>
              <template #suffix>
                <Button
                  v-tooltip="'Only Arabic characters allowed'"
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
              label="Bidder Group"
              v-model="formData.category"
              :options="[
                { label: 'Company', value: 'Company' },
                { label: 'Individual', value: 'Individual' },
                { label: 'Proprietorship', value: 'Proprietorship' },
                { label: 'Partnership', value: 'Partnership' }
              ]"
            >
              <template #prefix>
                <Users class="w-4 h-4 text-gray-500" />
              </template>
            </FormControl>
          </div>
        </div>
      </div>

      <!-- Company Information -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center space-x-2 mb-4">
          <Building2 class="w-5 h-5 text-gray-600" />
          <h3 class="text-lg font-semibold">Company Details</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="relative">
            <FormControl
              type="select"
              label="Company Type"
              v-model="formData.company_type"
              :options="companyTypeOptions"
            >
              <template #prefix>
                <Briefcase class="w-4 h-4 text-gray-500" />
              </template>
            </FormControl>
          </div>

          <div class="relative">
            <FormControl
              v-model="formData.d_first_name"
              type="text"
              label="Director First Name"
              required
            >
              <template #prefix>
                <UserCircle class="w-4 h-4 text-gray-500" />
              </template>
            </FormControl>
          </div>

          <div class="relative">
            <FormControl
              v-model="formData.d_last_name"
              type="text"
              label="Director Last Name"
              required
            >
              <template #prefix>
                <UserCircle class="w-4 h-4 text-gray-500" />
              </template>
            </FormControl>
          </div>

          <div class="relative">
            <FormControl
              type="date"
              label="Date of Establishment"
              v-model="formData.date_of_establishment"
            >
              <template #prefix>
                <Calendar class="w-4 h-4 text-gray-500" />
              </template>
            </FormControl>
          </div>

          <div class="relative">
            <FormControl
              v-model="formData.website"
              type="url"
              label="Website"
            >
              <template #prefix>
                <Globe class="w-4 h-4 text-gray-500" />
              </template>
              <template #suffix>
                <Button
                  v-tooltip="'Enter complete URL (e.g., https://example.com)'"
                  variant="ghost"
                  class="p-1"
                >
                  <HelpCircle class="w-4 h-4 text-gray-400" />
                </Button>
              </template>
            </FormControl>
          </div>

          <div class="col-span-2">
            <FormControl
              type="textarea"
              label="Bio"
              v-model="formData.bio"
              rows="4"
            >
              <template #prefix>
                <FileText class="w-4 h-4 text-gray-500" />
              </template>
            </FormControl>
          </div>

          <div class="flex items-center space-x-2">
            <FormControl
              type="checkbox"
              v-model="formData.is_group"
              label="Is Group"
            >
              <template #prefix>
                <Network class="w-4 h-4 text-gray-500" />
              </template>
              <template #suffix>
                <Button
                  v-tooltip="'Check if this bidder is part of a group company'"
                  variant="ghost"
                  class="p-1"
                >
                  <HelpCircle class="w-4 h-4 text-gray-400" />
                </Button>
              </template>
            </FormControl>
          </div>

          <div class="relative" v-if="formData.is_group">
            <FormControl
              type="autocomplete"
              label="Parent Company"
              v-model="formData.parent_company"
              :options="parentCompanyOptions"
            >
              <template #prefix>
                <Building class="w-4 h-4 text-gray-500" />
              </template>
            </FormControl>
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
          <span>Save and Continue</span>
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FormControl, Button } from 'frappe-ui'
import {
  User,
  Users,
  UserCircle,
  UserPlus,
  Building,
  Building2,
  FileText,
  Globe,
  Calendar,
  Network,
  Languages,
  Hash,
  HelpCircle,
  Briefcase,
  Save
} from 'lucide-vue-next'

// ... Rest of the script remains the same as previous version ...
  import { createResource } from 'frappe-ui'
  
  const formData = ref({
    bidder_name: '',
    register_no: '',
    bidder_name_ar: '',
    category: '',
    company_type: '',
    d_first_name: '',
    d_last_name: '',
    is_group: false,
    parent_company: '',
    date_of_establishment: '',
    website: '',
    bio: ''
  })
  
  const isSubmitting = ref(false)
  const canContinueToNext = ref(false)
  
  const companyTypeOptions = [
    'Authorized agent', 'Consulting company', 'Manufacturer', 'Trader',
    'Software support', 'Services', 'Publishing', 'Design', 'Research',
    'Audit / accounting', 'NGO', 'Supreme Audit Institutions (SAI\'s)'
  ].map(type => ({ label: type, value: type }))
  
  const parentCompanyOptions = ref([]) // This should be populated from your backend
  
  const validateEnglishText = (value) => {
    if (!value) return 'This field is required'
    if (/[\u0600-\u06FF]/.test(value)) return 'Arabic characters are not allowed'
    return true
  }
  
  const validateArabicText = (value) => {
    if (value && !/^[\u0600-\u06FF\s]+$/.test(value)) {
      return 'Only Arabic characters are allowed'
    }
    return true
  }
  
  const isFormValid = computed(() => {
    return formData.value.bidder_name &&
           formData.value.register_no &&
           formData.value.d_first_name &&
           formData.value.d_last_name &&
           validateEnglishText(formData.value.bidder_name) === true &&
           (!formData.value.bidder_name_ar || validateArabicText(formData.value.bidder_name_ar) === true)
  })
  
  const createBidder = createResource({
    url: 'yourapi/create-bidder',
    method: 'POST'
  })
  
  const handleSubmit = async () => {
    if (!isFormValid.value) return
    
    try {
      isSubmitting.value = true
      await createBidder.submit(formData.value)
      canContinueToNext.value = true
      // Emit event or use router to move to next step
    } catch (error) {
      console.error('Error submitting form:', error)
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