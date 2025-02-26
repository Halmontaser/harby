<!-- BankAccount.vue -->
 
<template>

  <div class="container mx-auto p-6">
    <Card>
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold flex items-center">
          <Building class="w-5 h-5 mr-2" />
          Bank Account
        </h2>
        <Button
          variant="solid"
          color="primary"
          :loading="loading"
          @click="submitForm"
        >
          Save
        </Button>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Account Holder Name -->
        <FormControl
          type="text"
          label="Account Holder Name"
          labelHint="اسم صاحب الحساب"
          v-model="formData.accountHolderName"
          :error="errors.accountHolderName"
          required
        >
          <template #prefix>
            <User class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Account Number -->
        <FormControl
          type="text"
          label="Account Number"
          labelHint="رقم الحساب"
          v-model="formData.accountNumber"
          :error="errors.accountNumber"
        >
          <template #prefix>
            <CreditCard class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Account Type -->
        <FormControl
          type="select"
          label="Account Type"
          labelHint="نوع الحساب"
          v-model="formData.accountType"
          :options="accountTypes"
          :error="errors.accountType"
          required
        >
          <template #prefix>
            <Folder class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Type -->
        <FormControl
          type="select"
          label="Type"
          labelHint="النوع الرئيسي"
          v-model="formData.type"
          :options="mainTypes"
          :error="errors.type"
          required
        >
          <template #prefix>
            <List class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Supplier -->
        
        <!-- Currency -->
        <FormControl
          type="autocomplete"
          label="Currency"
          labelHint="العملة"
          v-model="formData.currency"
          :options="currencies"
          :error="errors.currency"
        >
          <template #prefix>
            <DollarSign class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Bank Name -->
        <FormControl
          type="text"
          label="Bank Name"
          v-model="formData.bankName"
          :error="errors.bankName"
        >
          <template #prefix>
            <Building class="w-4 h-4" />
          </template>
        </FormControl>

        <!-- Is Payable -->
        <FormControl
          type="checkbox"
          label="Is Payable"
          v-model="formData.isPayable"
        >
          <template #prefix>
            <CheckSquare class="w-4 h-4" />
          </template>
        </FormControl>
<Dlink
label="supplier"
class="form-control select-text"
          :value="formData.supplier"
          doctype="bidder"
          placeholder="supplier"
                @change="(v) => (formData.supplier = v)"
/>
        <!-- Is Default -->
        <FormControl
          type="checkbox"
          label="Is Default"
          v-model="formData.isDefault"
        >
          <template #prefix>
            <Star class="w-4 h-4" />
          </template>
        </FormControl>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Dlink from '@/components/Controls/Link.vue'
import {
  Building,
  User,
  CreditCard,
  Folder,
  List,
  Users,
  DollarSign,
  CheckSquare,
  Star,
  Link
} from 'lucide-vue-next'
import { FormControl, Card, Button,call } from 'frappe-ui'

// Form Data
const formData = ref({
  accountHolderName: '',
  accountNumber: '',
  accountType: '',
  type: '',
  currency: '',
  supplier:'',
  bankName: '',
  isPayable: false,
  isDefault: false,
  name:''
})

const errors = ref({})
const loading = ref(false)

// Options
const accountTypes = ref([
  { label: 'Savings', value: 'Savings' },
  { label: 'Current', value: 'Current' },
  { label: 'Fixed Deposit', value: 'Fixed Deposit' }
])

const mainTypes = ref([
  { label: 'Income (دخل)', value: 'income' },
  { label: 'Expense (مصروفات)', value: 'expense' }
])

const currencies = ref([
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'SAR - Saudi Riyal', value: 'SAR' },
  { label: 'AED - UAE Dirham', value: 'AED' }
])


const validateForm = () => {
  errors.value = {}
  let isValid = true

  // Required fields validation
  if (!formData.value.accountHolderName) {
    errors.value.accountHolderName = 'Account Holder Name is required'
    isValid = false
  }

  if (!formData.value.accountType) {
    errors.value.accountType = 'Account Type is required'
    isValid = false
  }

  if (!formData.value.type) {
    errors.value.type = 'Type is required'
    isValid = false
  }

  /* if (!formData.value.supplier) {
    errors.value.supplier = 'Supplier is required'
    isValid = false
  } */

  return isValid
}

// Computed
const isFormValid = computed(() => {
  return formData.value.accountHolderName &&
         formData.value.accountType &&
         formData.value.type &&
        
         Object.keys(errors.value).length === 0
})
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

function handleBankAccountUpdate(doc) {
  // Logic to handle post-update actions, e.g., refreshing data or showing a message
}

async function submitForm() {
  if (!validateForm()) return

  
    const doc = {
      doctype: 'tnt Bank Account',
      account_holder_name: formData.value.accountHolderName,
      account_number: formData.value.accountNumber,
      account_type: formData.value.accountType,
      type: formData.value.type,
      supplier: formData.value.supplier,
      currency: formData.value.currency,
      bank_name: formData.value.bankName,
      is_payable: formData.value.isPayable,
      is_default: formData.value.isDefault,
      name:formData.value.name||null
    }
  loading.value = true;
  try {
    if (formData.value.name) {
      await callSetValue(doc);
    } else {
      await callInsertDoc(doc);
      console.log("try to ")
      resetForm()
    }
  } catch (error) {
    console.error('Error saving bank account:', error);
  } finally {
    loading.value = false;
  }
}

// Methods

const resetForm = () => {
  formData.value = {
    accountHolderName: '',
    accountNumber: '',
    accountType: '',
    type: '',
    supplier: null,
    currency: '',
    bankName: '',
    isPayable: false,
    isDefault: false,
    name:null
  };
  errors.value = {}
}
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
