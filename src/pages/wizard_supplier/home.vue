 
<template >
    
    <horizontal-stepper :steps="demoSteps" @completed-step="completeStep" @clicking-back=canContinue :top-buttons="true"
        @active-step="isStepActive" @stepper-finished="alert"/>
    </template>
<script >
import HorizontalStepper from '../../components/HorizontalStepper.vue';
import BasicInformation from './Steps/BasicInformation.vue'
  import survey from './survey/survey.vue'
  import ContactsForm from './Steps/ContactsForm.vue'
  import AddressForm from './Steps/AddressForm.vue'
  import ProductsServices from './Steps/ProductsServices.vue'
  import DocumentsList from './Steps/DocumentsList.vue'
   


    export default {
        name: 'app',
        components: {
            HorizontalStepper
        },
        data(){
            return {
                demoSteps: [
                                        {
            name: 'basic-info',
            icon: 'briefcase',
            title: 'Basic Information',
            subtitle: 'Company details',
            component: BasicInformation,
                    completed: true
          },
          {
            name: 'contacts',
            icon: 'users',
            title: 'Contacts',
            subtitle: 'Primary contacts',
            component: survey,
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
            component: DocumentsList
            ,
                        completed: false
          },
          {
            name: 'documents',
            icon: 'file-text',
            title: 'Documents',
            subtitle: 'Required files',
            component:ProductsServices,
            completed: false
          }
         
        ]
                ,
                activeStep: 0
            }
        },
        computed: {},
        methods: {
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

 