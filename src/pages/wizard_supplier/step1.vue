<template>
    <div class="max-w-3xl mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Bidder Registration - General Information</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold mb-4">Basic Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl
              v-model="formData.bidder_name"
              type="text"
              label="Bidder Name"
              :validate="validateEnglishText"
              required
            />
            
            <FormControl
              v-model="formData.register_no"
              type="text"
              label="Register Number"
              required
            />
  
            <FormControl
              v-model="formData.bidder_name_ar"
              type="text"
              label="Bidder Name (Arabic)"
              :validate="validateArabicText"
            />
  
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
            />
          </div>
        </div>
  
        <!-- Company Information -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold mb-4">Company Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl
              type="select"
              label="Company Type"
              v-model="formData.company_type"
              :options="companyTypeOptions"
            />
  
            <FormControl
              v-model="formData.d_first_name"
              type="text"
              label="Director First Name"
              required
            />
  
            <FormControl
              v-model="formData.d_last_name"
              type="text"
              label="Director Last Name"
              required
            />
  
            <FormControl
              type="date"
              label="Date of Establishment"
              v-model="formData.date_of_establishment"
            />
  
            <FormControl
              v-model="formData.website"
              type="url"
              label="Website"
            />
  
            <div class="col-span-2">
              <FormControl
                type="textarea"
                label="Bio"
                v-model="formData.bio"
                rows="4"
              />
            </div>
  
            <div class="flex items-center space-x-2">
              <FormControl
                type="checkbox"
                v-model="formData.is_group"
                label="Is Group"
              />
            </div>
  
            <FormControl
              v-if="formData.is_group"
              type="autocomplete"
              label="Parent Company"
              v-model="formData.parent_company"
              :options="parentCompanyOptions"
            />
          </div>
        </div>
  
        <div class="flex justify-end space-x-4">
          <Button
            type="submit"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            variant="solid"
            color="blue"
          >
            Save and Continue
          </Button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { FormControl, Button } from 'frappe-ui'
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