<template>
    <div>
    <horizontal-stepper :steps="demoSteps" @completed-step="completeStep" @clicking-back=canContinue :top-buttons="true"
    @active-step="isStepActive" @stepper-finished="alert"></horizontal-stepper>      
    </div>
</template>
<script >
import HorizontalStepper from '../components/HorizontalStepper.vue';

    import StepOne from './StepOne.vue';
    import StepTwo from './StepTwo.vue';


    export default {
        name: 'app',
        components: {
            HorizontalStepper
        },
        data(){
            return {
                demoSteps: [
                                        {
                        icon: 'plus',
                        name: 'first',
                        title: 'Sample title 1',
                        subtitle: 'Subtitle sample',
                        component: StepOne,
                        completed: false

                    },
                    {
                        icon: 'check',
                        name: 'second',
                        title: 'Sample title 2',
                        subtitle: 'Subtitle sample',
                        component: StepTwo,
                        completed: false
                    },
                    {
                        icon: 'aye',
                        name: 'third',
                        title: 'Sample title 3',
                        subtitle: 'Subtitle sample',
                        component: StepOne,
                        completed: false
                    }
                ],
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

        