<template>
    <div class="card" style="margin: 3rem">
        <header class="card-header">
            <p class="card-header-title">
                Component
            </p>
            <a href="#" class="card-header-icon" aria-label="more options">
              <span class="icon">
              </span>
            </a>
        </header>
        <div class="card-content grid grid-cols-3 gap-4">
           <FormControl v-for='field in fields' :key="field.name" v-model="field.value" :placeholder="field.name" :label="field.name" :prefix="field.icon"/>
            
        </div>
        <footer class="card-footer">
            <button class="card-footer-item" @click="canContinue">Can Continue</button>
        </footer>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import Fields from '../components/Fields.vue';
import ContactIcon from '../components/Icons/ContactIcon.vue'
import Email2Icon from '../components/Icons/Email2Icon.vue'
import PhoneIcon from '../components/Icons/PhoneIcon.vue'
import OrganizationsIcon from '../components/Icons/OrganizationsIcon.vue'
import AddressIcon from '../components/Icons/AddressIcon.vue'
import CertificateIcon from '../components/Icons/CertificateIcon.vue'
import EditIcon from '../components/Icons/EditIcon.vue'
import GenderIcon from '../components/Icons/GenderIcon.vue';
const props= defineProps([
    'currentStep'
])
      
const  contact=ref({
                full_name:"",
                gender:"",
                email_id:"",
                mobile_no:"",
                address:"",
                company_name:"",
                designation:""

            })

             const fields=ref([
           {
      icon: ContactIcon,
      name: 'full_name',
      value:contact.value.full_name || "" ,
    },
    {
      icon: GenderIcon,
      name: 'gender',
      value: contact.value.gender||"",
    },
    {
      icon: Email2Icon,
      name: 'email_id',
      value: contact.value.email_id||"",
    },
    {
      icon: PhoneIcon,
      name: 'mobile_no',
      value: contact.value.mobile_no||"",
    },
    {
      icon: OrganizationsIcon,
      name: 'company_name',
      value: contact.value.company_name||"",
    },
    {
      icon: CertificateIcon,
      name: 'designation',
      value: contact.value.designation||"",
    },
    {
      icon: AddressIcon,
      name: 'address',
      value: contact.value.address||"",
    },
  ])


 const emit=defineEmits('canContinue')           
emit('canContinue',{value:true})
      
        

        
    
</script>