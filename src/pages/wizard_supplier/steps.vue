<template>
    <HorizontalStepper1
      :steps="Steps"
      :top-buttons="true"
      @completed-step="completeStep"
        @active-step="isStepActive" @stepper-finished="alert"
    >
    
    </HorizontalStepper1>
  </template>
  
  <script>

import HorizontalStepper1 from '../../components/HorizontalStepper1.vue'
  import BasicInformation from './Steps/BasicInformation.vue'
  import ContactsForm from './Steps/ContactsForm.vue'
  import AddressForm from './Steps/AddressForm.vue'
  import ProductsServices from './Steps/ProductsServices.vue'
  import DocumentsList from './Steps/DocumentsList.vue'
  
  export default {
    name: 'ss',
        components: [
            HorizontalStepper1,BasicInformation,ContactsForm,AddressForm,ProductsServices,DocumentsList
        ],
    data() {
      return {
        Steps: [
          {
            name: 'basic-info',
            icon: 'briefcase',
            title: 'Basic Information',
            subtitle: 'Company details',
            component: BasicInformation,
                    completed: false
          },
          {
            name: 'contacts',
            icon: 'users',
            title: 'Contacts',
            subtitle: 'Primary contacts',
            component: ContactsForm,
            completed: false
          },
          {
            name: 'address',
            icon: 'map-pin',
            title: 'Address',
            subtitle: 'Business locations',
            component: AddressForm,
            completed: false
          },
          {
            name: 'products',
            icon: 'package',
            title: 'Products & Services',
            subtitle: 'Offerings list',
            component: ProductsServices
            ,
                        completed: false
          },
          {
            name: 'documents',
            icon: 'file-text',
            title: 'Documents',
            subtitle: 'Required files',
            component: DocumentsList,
            completed: false
          }
         
        ],
        formData: {
          basicInfo: {},
          contacts: [],
          addresses: [],
          products: [],
          documents: [],
          termsAccepted: false
        },  activeStep: 0

      }
    },
    methods:{
            completeStep(payload) {
                this.demoSteps.forEach((step) => {
                 if (step.name === payload.name) {
                        step.completed = true;
                    }
                })
            },
            isStepActive(payload) {
                this.demoSteps.forEach((step) => {
                    if (step.name === payload.name) {
                        if(step.completed === true) {
                            step.completed = false;
                        }
                    }
                })
            },
            alert(payload) {
                alert('end')
            }
          }
  }
  </script>