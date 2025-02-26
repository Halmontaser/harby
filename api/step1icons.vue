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
                  v-tooltip="'Only English characters allowed'"
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
import { createResource } from 'frappe-ui'
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

</script>

<style>
.tooltip {
  @apply absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg;
}
</style>