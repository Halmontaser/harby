
<template>
  <div class="container mx-auto p-6">
    <Card>
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold flex items-center">
          <Building class="w-5 h-5 mr-2" />
          Bank Statement
        </h2>
        <Button
          variant="primary"
          :loading="loading"
          :disabled="!isFormValid"
          @click="submitForm"
        >
          Save
        </Button>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Bank Account -->
        <dlink

          label="Bank Account"
          :modelValue="formData.bankAccount"
          doctype="tnt Bank Account"
          @change="(v) => (formData.bankAccount = v)"
          :error="errors.bankAccount"
          required
        >
          <template #prefix>
            <Building class="w-4 h-4" />
          </template>
        </dlink>

        <!-- Date Range -->
        <FormControl
          type="date"
          label="From Date"
          v-model="formData.fromDate"
          :error="errors.fromDate"
          required
        >
          <template #prefix>
            <Calendar class="w-4 h-4" />
          </template>
        </FormControl>

        <FormControl
          type="date"
          label="To Date"
          v-model="formData.toDate"
          :error="errors.toDate"
          required
          :min-date="formData.fromDate"
        >
          <template #prefix>
            <Calendar class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Balance Information -->
        <FormControl
          type="number"
          label="Opening Balance"
          v-model="formData.openingBalance"
          :error="errors.openingBalance"
        >
          <template #prefix>
            <DollarSign class="w-4 h-4" />
          </template>
        </FormControl>

        <FormControl
          type="number"
          label="Closing Balance"
          v-model="formData.closingBalance"
          :error="errors.closingBalance"
        >
          <template #prefix>
            <DollarSign class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Posting Date -->
        <FormControl
          type="date"
          label="Posting Date"
          v-model="formData.postingDate"
          :error="errors.postingDate"
        >
          <template #prefix>
            <CalendarCheck class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Amount Fields -->
        <FormControl
          type="number"
          label="Debit Amount"
          v-model="formData.debitAmount"
          :error="errors.debitAmount"
        >
          <template #prefix>
            <ArrowDownRight class="w-4 h-4 text-red-500" />
          </template>
        </FormControl>

        <FormControl
          type="number"
          label="Credit Amount"
          v-model="formData.creditAmount"
          :error="errors.creditAmount"
        >
          <template #prefix>
            <ArrowUpRight class="w-4 h-4 text-green-500" />
          </template>
        </FormControl>

        <!-- Reference Number -->
        <FormControl
          type="text"
          label="Reference Number"
          v-model="formData.referenceNumber"
          :error="errors.referenceNumber"
        >
          <template #prefix>
            <Hash class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Supplier -->
        

        <!-- Attachment -->
        <FormControl
          type="file"
          label="Attachment"
          v-model="formData.attachment"
          :error="errors.attachment"
        >
          <template #prefix>
            <Paperclip class="w-4 h-4" />
          </template>
        </FormControl>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Building,
  Calendar,
  CalendarCheck,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  Hash,
  Users,
  Paperclip
} from 'lucide-vue-next'
import { FormControl, Card, Button,call } from 'frappe-ui'
import dlink from '@/components/Controls/Link.vue';

// Form Data
const formData = ref({
  bankAccount: '',
  fromDate: null,
  toDate: null,
  openingBalance: null,
  closingBalance: null,
  postingDate: null,
  debitAmount: null,
  creditAmount: null,
  referenceNumber: '',
  attachment: null
})

const errors = ref({})
const loading = ref(false)
const bankAccounts = ref([])

// Fetch Bank Accounts

// Validation
const validateForm = () => {
  errors.value = {}
  let isValid = true


  

  if (!formData.value.fromDate) {
    errors.value.fromDate = 'From Date is required'
    isValid = false
  }

  if (!formData.value.toDate) {
    errors.value.toDate = 'To Date is required'
    isValid = false
  }

  if (formData.value.fromDate && formData.value.toDate) {
    if (new Date(formData.value.fromDate) > new Date(formData.value.toDate)) {
      errors.value.toDate = 'To Date must be after From Date'
      isValid = false
    }
  }

  // Validate amounts
  if (formData.value.debitAmount && formData.value.debitAmount < 0) {
    errors.value.debitAmount = 'Debit amount cannot be negative'
    isValid = false
  }

  if (formData.value.creditAmount && formData.value.creditAmount < 0) {
    errors.value.creditAmount = 'Credit amount cannot be negative'
    isValid = false
  }

  return isValid
}

// Computed
const isFormValid = computed(() => {
  return  formData.value.fromDate && 
         formData.value.toDate &&
         Object.keys(errors.value).length === 0
})

// Methods
const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const doc = {
      doctype: 'tnt Bank Statement',
      bank_account: formData.value.bankAccount,
      from_date: formData.value.fromDate,
      to_date: formData.value.toDate,
      opening_balance: formData.value.openingBalance,
      closing_balance: formData.value.closingBalance,
      posting_date: formData.value.postingDate,
      debit_amount: formData.value.debitAmount,
      credit_amount: formData.value.creditAmount,
      reference_number: formData.value.referenceNumber,
      supplier: formData.value.supplier
    }

    // Insert document
    const response = callInsertDoc(doc)

    // Handle attachment if exists
    if (formData.value.attachment) {
      await uploadAttachment(response.name)
    }

    alert({
      message: 'Bank Statement saved successfully',
      indicator: 'green'
    })
    resetForm()
  } catch (error) {
    alert({
      message: error.message || 'Error saving bank statement',
      indicator: 'red'
    })
  } finally {
    loading.value = false
  }
}

const uploadAttachment = async (docName) => {
  const formDataFile = new FormData()
  formDataFile.append('doctype','File')
  formDataFile.append('attached_to_doctype', 'tnt Bank Statement')
  formDataFile.append('fieldname','attachment')
  formDataFile.append('attached_to_docname', docName)
  formDataFile.append('is_private', 0)

  try {
    await frappe.upload_file(formDataFile)
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
async function callSetValue(values) {
  const d = await call('frappe.client.set_value', {
    doctype: 'CRM Organization',
    name: _organization.value.name,
    fieldname: values,
  })
  loading.value = false
  return d.name
}

async function callInsertDoc() {
  const doc = await call('frappe.client.insert', {
    doc: {
      doctype: 'tnt Bank Statement',
      ...formData.value,
    },
  })
  loading.value = false
  formData.value.name=doc.name
  resetForm()
  return doc.name
}

const resetForm = () => {
  formData.value = {
    bankAccount: '',
    fromDate: null,
    toDate: null,
    openingBalance: null,
    closingBalance: null,
    postingDate: null,
    debitAmount: null,
    creditAmount: null,
    referenceNumber: '',
    supplier: null,
    attachment: null
  }
  errors.value = {}
}

// Lifecycle

</script>

<style scoped>
.container {
  max-width: 1200px;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}
</style>