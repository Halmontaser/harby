<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-2">
        <Icon name="shield-check" class="w-8 h-8 text-blue-600" />
        <h1 class="text-2xl font-bold text-gray-800">Bank Guarantee Submission</h1>
      </div>
      <p class="text-gray-600">Submit your bank guarantee details for tender participation</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Main Details Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold mb-6 flex items-center space-x-2">
          <Icon name="file-text" class="w-5 h-5 text-blue-600" />
          <span>Guarantee Details</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- BG ID -->
          <FormControl
            v-model="formData.bg_id"
            type="date"
            label="Bank Guarantee ID"
            required
          >
            <template #prefix>
              <Icon name="fingerprint" class="w-4 h-4 text-gray-500" />
            </template>
          </FormControl>

          <!-- Issue Date -->
          <FormControl
            v-model="formData.issue_date"
            type="date"
            label="Issue Date"
            required
            :max="maxIssueDate"
            @update:modelValue="updateExpiryDate"
          >
            <template #prefix>
              <Icon name="calendar" class="w-4 h-4 text-gray-500" />
            </template>
          </FormControl>

          <!-- Validity Duration -->
          <div class="relative">
            <FormControl
              v-model="formData.validity_for"
              type="number"
              label="Validity (Days)"
              required
              min="1"
              @update:modelValue="updateExpiryDate"
            >
              <template #prefix>
                <Icon name="clock" class="w-4 h-4 text-gray-500" />
              </template>
              <template #suffix>
                <span class="text-gray-500">days</span>
              </template>
            </FormControl>
          </div>

          <!-- Expiry Date -->
          <FormControl
            v-model="formData.expire_date"
            type="date"
            label="Expiry Date"
            required
            :min="minExpiryDate"
            disabled
          >
            <template #prefix>
              <Icon name="calendar-x" class="w-4 h-4 text-gray-500" />
            </template>
          </FormControl>
        </div>
      </div>

      <!-- Bank Details Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold mb-6 flex items-center space-x-2">
          <Icon name="building-2" class="w-5 h-5 text-blue-600" />
          <span>Bank Information</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Bank Selection -->
          <FormControl
            v-model="formData.bank"
            type="autocomplete"
            label="Bank Name"
            required
            :options="bankOptions"
            @update:modelValue="loadBranches"
          >
            <template #prefix>
              <Icon name="landmark" class="w-4 h-4 text-gray-500" />
            </template>
          </FormControl>

          <!-- Branch Code -->
          <FormControl
            v-model="formData.branch_code"
            type="autocomplete"
            label="Branch Code"
            required
            :options="branchOptions"
            :disabled="!formData.bank"
          >
            <template #prefix>
              <Icon name="git-branch" class="w-4 h-4 text-gray-500" />
            </template>
          </FormControl>

          <!-- Amount -->
          <div class="md:col-span-2">
            <FormControl
              v-model="formData.amount"
              type="currency"
              label="Guarantee Amount"
              required
              :precision="2"
              :min="0"
            >
              <template #prefix>
                <Icon name="dollar-sign" class="w-4 h-4 text-gray-500" />
              </template>
              <template #suffix>
                <span class="text-gray-500">USD</span>
              </template>
            </FormControl>
          </div>
        </div>
      </div>

      <!-- Document Upload -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold mb-6 flex items-center space-x-2">
          <Icon name="file" class="w-5 h-5 text-blue-600" />
          <span>Document Upload</span>
        </h2>

        <div class="space-y-4">
          <FileUploader
            v-model="formData.doc_attached"
            accept=".pdf,.doc,.docx"
            :maxSize="5"
            class="w-full"
          >
            <template #default="{ isDragging }">
              <div
                class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
                :class="[
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                ]"
              >
                <Icon
                  name="upload-cloud"
                  class="w-12 h-12 mx-auto mb-4 text-gray-400"
                />
                <p class="text-gray-600">
                  Drag and drop your document here, or
                  <span class="text-blue-600 hover:text-blue-700 cursor-pointer">browse</span>
                </p>
                <p class="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </template>
          </FileUploader>

          <div v-if="formData.doc_attached" class="flex items-center space-x-3">
            <Icon name="file-check" class="w-5 h-5 text-green-500" />
            <span class="text-sm text-gray-600">{{ formData.doc_attached.name }}</span>
            <button
              @click="formData.doc_attached = null"
              class="text-red-500 hover:text-red-600"
            >
              <Icon name="x" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          @click="resetForm"
          :disabled="isSubmitting"
        >
          <Icon name="refresh-ccw" class="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid"
        >
          <Icon name="send" class="w-4 h-4 mr-2" />
          Submit Guarantee
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FormControl, Button, FileUploader } from 'frappe-ui'
import { createResource } from 'frappe-ui'
import Icon from '@/components/Icon.vue'

const formData = ref({
  bg_id: null,
  issue_date: new Date(),
  expire_date: null,
  validity_for: 90,
  bank: null,
  branch_code: null,
  amount: null,
  doc_attached: null
})

const isSubmitting = ref(false)
const bankOptions = ref([
  { label: 'Central Bank', value: 'central' },
  { label: 'National Bank', value: 'national' },
  { label: 'Commercial Bank', value: 'commercial' }
])
const branchOptions = ref([])

// Computed properties
const maxIssueDate = computed(() => new Date())
const minExpiryDate = computed(() => formData.value.issue_date)

const isFormValid = computed(() => {
  return formData.value.bg_id &&
         formData.value.issue_date &&
         formData.value.expire_date &&
         formData.value.validity_for > 0 &&
         formData.value.bank &&
         formData.value.branch_code &&
         formData.value.amount > 0 &&
         formData.value.doc_attached
})

// Methods
const updateExpiryDate = () => {
  if (formData.value.issue_date && formData.value.validity_for) {
    const issueDate = new Date(formData.value.issue_date)
  }
}

const loadBranches = (bankValue) => {
  // Simulate API call to load branches
  const branchesMap = {
    central: [
      { label: 'Main Branch (001)', value: '001' },
      { label: 'Downtown (002)', value: '002' }
    ],
    national: [
      { label: 'City Center (101)', value: '101' },
      { label: 'West Wing (102)', value: '102' }
    ],
    commercial: [
      { label: 'Business District (201)', value: '201' },
      { label: 'Industrial Area (202)', value: '202' }
    ]
  }
  branchOptions.value = branchesMap[bankValue] || []
  formData.value.branch_code = null
}

const resetForm = () => {
  formData.value = {
    bg_id: null,
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    expire_date: null,
    validity_for: 90,
    bank: null,
    branch_code: null,
    amount: null,
    doc_attached: null
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  try {
    isSubmitting.value = true
    // Submit form data to your API
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    // Show success message
  } catch (error) {
    console.error('Error submitting form:', error)
    // Show error message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-control {
  @apply transition-all duration-200;
}

.form-control:focus-within {
  @apply ring-2 ring-blue-100;
}

.button-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200;
}

.button-secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-200;
}
</style>