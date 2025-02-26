<template>
<section class="max-w-7xl mx-auto py-8 px-4">
      <div class="bg-white rounded-lg shadow">
        <!-- Header -->
        <header class="p-4 border-b flex justify-between items-center">
          <div class="flex items-center gap-2">
            <FileContract class="h-5 w-5" />
            <h1 class="text-xl font-semibold">Experience Contract</h1>
          </div>
          <FormControl
            type="button"
            variant="primary"
            :loading="isSubmitting"
            :disabled="!canSubmit"
            @click="handleSubmit"
          >
            Save Contract
          </FormControl>
        </header>
  
        <!-- Form Content -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Contract Type -->
          <FormControl
            type="select"
            name="contractType"
            label="Contract Type"
            v-model="formData.contractType"
            :options="contractTypes"
            :error="errors.contractType"
            required
          >
            <template #prefix>
              <FileText class="h-4 w-4" />
            </template>
          </FormControl>
  
          <!-- Contract Dates -->
          <FormControl
            type="date"
            name="startDate"
            label="Contract Start Date"
            v-model="formData.startDate"
            :error="errors.startDate"
            required
          >
            <template #prefix>
              <CalendarPlus class="h-4 w-4" />
            </template>
          </FormControl>
  
          <FormControl
            type="date"
            name="endDate"
            label="Contract End Date"
            v-model="formData.endDate"
            :error="errors.endDate"
            :min-date="formData.startDate"
            required
          >
            <template #prefix>
              <CalendarCheck class="h-4 w-4" />
            </template>
          </FormControl>
  
          <!-- Supplier -->
          <link 
          name="supplier"
            label="Supplier"
            :value="formData.supplier"
            doctype="Supplier"
            :error="errors.supplier"
            required
          >
            <template #prefix>
              <Users class="h-4 w-4" />
            </template>
          </link>
  
          <!-- Contract Value -->
          <FormControl
            type="number"
            name="contractValue"
            label="Contract Value"
            v-model="formData.contractValue"
            :error="errors.contractValue"
            required
          >
            <template #prefix>
              <DollarSign class="h-4 w-4" />
            </template>
          </FormControl>
  
          <!-- Organisation -->
          <FormControl
            name="organisation"
            label="Organisation"
            v-model="formData.organisation"
            :error="errors.organisation"
            required
          >
            <template #prefix>
              <Building2 class="h-4 w-4" />
            </template>
          </FormControl>
  
          <!-- Contract Status -->
          <FormControl
            type="select"
            name="contractStatus"
            label="Contract Status"
            v-model="formData.contractStatus"
            :options="contractStatuses"
            :error="errors.contractStatus"
            required
          >
            <template #prefix>
              <Activity class="h-4 w-4" />
            </template>
          </FormControl>
  
          <!-- Project -->
          <autoComplete
            name="project"
            label="Project"
            v-model="formData.project"
            options="Project"
            :error="errors.project"
          >
            <template #prefix>
              <FolderGit2 class="h-4 w-4" />
            </template>
          </autoComplete>
  
          <!-- Attachment -->
          <FormControl
            type="file"
            name="attachment"
            label="Attachment"
            v-model="formData.attachment"
            :error="errors.attachment"
            accept=".pdf,.doc,.docx"
          >
            <template #prefix>
              <Paperclip class="h-4 w-4" />
            </template>
          </FormControl>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import{call,FormControl,Button} from 'frappe-ui'
  import link from '@/components/Controls/Link.vue';
  import { ref, computed } from 'vue'
  import {
    FileContract,
    FileText,
    CalendarPlus,
    CalendarCheck,
    Users,
    DollarSign,
    Building2,
    Activity,
    FolderGit2,
    Paperclip
  } from 'lucide-vue-next'
  
  // Form State
  const formData = ref({
    contractType: '',
    startDate: null,
    endDate: null,
    supplier: null,
    contractValue: null,
    organisation: null,
    contractStatus: '',
    project: null,
    attachment: null
  })
  
  const errors = ref({})
  const isSubmitting = ref(false)
  
  // Options
  const contractTypes = [
    { value: 'fixed_term', label: 'Fixed Term' },
    { value: 'project_based', label: 'Project Based' },
    { value: 'service_agreement', label: 'Service Agreement' }
  ]
  
  const contractStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'terminated', label: 'Terminated' }
  ]
  
  // Validation
  const validateForm = () => {
    const errors = {}
  
    if (!formData.value.contractType) {
      errors.contractType = 'Contract Type is required'
    }
  
    if (!formData.value.startDate) {
      errors.startDate = 'Start Date is required'
    }
  
    if (!formData.value.endDate) {
      errors.endDate = 'End Date is required'
    }
  
    if (formData.value.startDate && formData.value.endDate) {
      if (new Date(formData.value.startDate) >= new Date(formData.value.endDate)) {
        errors.endDate = 'End Date must be after Start Date'
      }
    }
  
    if (!formData.value.supplier) {
      errors.supplier = 'Supplier is required'
    }
  
    if (!formData.value.contractValue || formData.value.contractValue <= 0) {
      errors.contractValue = 'Valid Contract Value is required'
    }
  
    if (!formData.value.organisation) {
      errors.organisation = 'Organisation is required'
    }
  
    if (!formData.value.contractStatus) {
      errors.contractStatus = 'Contract Status is required'
    }
  
    return errors
  }
  
  // Computed
  const canSubmit = computed(() => {
    return formData.value.contractType &&
           formData.value.startDate &&
           formData.value.endDate &&
           formData.value.supplier &&
           formData.value.contractValue &&
           formData.value.organisation 
  })
  
  // Methods
  async function callSetValue(doc) {
    
    let {doctype,name}=doc
    delete doc.doctype
    delete doc.name
    let values=doc
    const d = await call('frappe.client.set_value', {
      doctype,
      name,
      fieldname: values,
    });
    return d.name;
  }
  
  async function callInsertDoc(form) {
    const doc = await call('frappe.client.insert', {
      doc:form
    });
  }
  const handleSubmit = async () => {
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors
      return
    }
  
    isSubmitting.value = true
    try {
      const doc = {
        doctype: 'Experience_Contract',
        contract_type: formData.value.contractType,
        start_date: formData.value.startDate,
        end_date: formData.value.endDate,
        supplier: formData.value.supplier,
        contract_value: formData.value.contractValue,
        organisation: formData.value.organisation,
        status: formData.value.contractStatus,
        project: formData.value.project
      }
  
     response=callInsertDoc(doc)
      
  
      alert({
        message: 'Contract saved successfully'
      })
  
      resetForm()
    } catch (error) {
      frappe.show_alert({
        message: error.message || 'Error saving contract',
        indicator: 'red'
      })
    } finally {
      isSubmitting.value = false
    }
  }
  
  const handleAttachmentUpload = async (docName) => {
    const formDataFile = new FormData()
    formDataFile.append('file', formData.value.attachment)
    formDataFile.append('doctype', 'Experience_Contract')
    formDataFile.append('docname', docName)
    formDataFile.append('is_private', 1)
  
    await frappe.upload_file(formDataFile)
  }
  
  const resetForm = () => {
    formData.value = {
      contractType: '',
      startDate: null,
      endDate: null,
      supplier: null,
      contractValue: null,
      organisation: null,
      contractStatus: '',
      project: null,
      attachment: null
    }
    errors.value = {}
  }
  </script>
  
  <style scoped>
  .form-grid {
    display: grid;
    gap: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .form-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .form-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  </style>