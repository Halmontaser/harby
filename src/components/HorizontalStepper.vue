
<template>
  <div class="bg-white shadow-md min-h-[200px]">
  
      <div class="flex items-center justify-center relative">
          <!-- Top buttons -->
          <div v-if="topButtons" class="relative flex items-center justify-between">
              <div v-if="currentStep.index > 0" 
                   class="z-20 p-1.5 rounded-full cursor-pointer absolute left-[1%] border-2 flex items-center justify-between text-gray-700"
                   @click="backStep()">
                   <Feather-icon name="chevron-left" class="h-5 w-5"/>
              </div>
          </div>
          
 
          <!-- Divider line -->
          <div class="border-b border-red-500 h-1 absolute w-[80%]" 
               :style="{width: `${(100/(steps.length) * (steps.length - 1)) - 10}%`}">
          </div>

          <!-- Steps wrapper -->
          <div class="flex items-center justify-between  relative w-[95%] left-0  px-[4%] md:w-[95%]">
              <template v-for="(step, index) in steps"  :key="index" >
                  <div :class="[
                      'relative flex flex-col items-center text-center',
                      'md: w-full mx-auto',
                      isStepActive(index, step),
                      {'hidden md:flex': isStepActive(index, step) === 'deactivated'}
                  ]" 
                 
                  :style="{width: `${100 / steps.length}%`}">
                      <div class="mb-4 p-4 bg-white">
                        <FeatherIcon :name='step.icon' class="inline-block rounded-full w-10 h-10 p-1 mt-4 " 
                             :class="step.completed ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'" />
                        
                      </div>
                      <div class="absolute top-[90%] w-full">
                          <h4 class="m-0 mb-0.5 text-gray-800 font-semibold">{{step.title}}</h4>
                          <h5 class="m-0 text-gray-600 font-light">{{step.subtitle}}</h5>
                      </div>
                  </div>
              </template>
            </div>

              <!-- Next button top -->
              <div v-if="topButtons" 
                   :class="['z-20 p-1.5 rounded-full cursor-pointer absolute right-[1%] shadow-lg flex items-center justify-between border-2',
                           !canContinue ? 'border-gray-300 text-gray-500 cursor-not-allowed' : 'border-blue-600 text-blue-600']"
                   @click="nextStep()">
                   <Feather-icon name="chevron-right" class=" h-5 w-5 font-bold "/>
              </div>
      </div>

      <!-- Content -->
      <div class="overflow-hidden my-6">
          <transition :enter-active-class="enterAnimation" :leave-active-class="leaveAnimation" mode="out-in">
              <keep-alive v-if="keepAliveData">
                  <component :is="steps[currentStep.index].component" 
                           :clickedNext="nextButton[currentStep.name]"
                           @can-continue="proceed"
                           @change-next="changeNextBtnValue"
                           :current-step="currentStep">
                  </component>
              </keep-alive>
              <component v-else 
                        :is="steps[currentStep.index].component"
                        :clickedNext="nextButton[currentStep.name]"
                        @can-continue="proceed"
                        @change-next="changeNextBtnValue"
                        :current-step="currentStep">
              </component>
          </transition>
      </div>

      <!-- Bottom buttons -->
      <div :class="['relative flex items-center p-8 border-t border-gray-300',
                   currentStep.index > 0 ? 'justify-between' : 'justify-end']">
          <div v-if="currentStep.index > 0" 
               class="px-4 py-2 cursor-pointer flex items-center justify-between text-gray-700"
               @click="backStep()">
              <FeatherIcon name='arrow-left-circle'/>
              <span>{{ 'back'}}</span>
          </div>
          <div :class="['px-4 py-2 cursor-pointer flex items-center justify-between text-white shadow-md',
                       !canContinue ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600']"
               @click="nextStep()">
              <span>{{ (finalStep) ? 'finish' : 'next' }}</span>
              <FeatherIcon name='arrow-right-circle'/>
          </div>
      </div>
  </div>
</template>
<script>
import {FeatherIcon} from 'frappe-ui'
export default {
  
  props: {
    topButtons: {
      type: Boolean,
      default: false
    },
    steps: {
      type: Array,
      default: function() {
        return [
          {
            icon: "mail",
            name: "first",
            title: "Sample title 1",
            subtitle: "Subtitle sample"
          },
          {
            icon: "report_problem",
            name: "second",
            title: "Sample title 2",
            subtitle: "Subtitle sample"
          }
        ];
      }
    },
    // need to have save and continue, observe if there is any value change so this save will enable, onclose make alert if there is no save,some observer for error 
    keepAlive: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentStep: {},
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false,
      keepAliveData: this.keepAlive
    };
  },

  computed: {
    
    enterAnimation() {
      if (this.currentStep.index < this.previousStep.index) {
        return "animate-slide-in-left";
      } else {
        return "animate-slide-in-right";
      }
    },
    leaveAnimation() {
      if (this.currentStep.index > this.previousStep.index) {
        return "animate-slide-out-left";
      } else {
        return "animate-slide-out-right";
      }}
    }
  ,

  methods: {
    isStepActive(index, step) {
      if (this.currentStep.index === index) {
        return "activated";
      } else {
        return "deactivated";
      }
    },

    activateStep(index, back = false) {
      if (this.steps[index]) {
        this.previousStep = this.currentStep;
        this.currentStep = {
          name: this.steps[index].name,
          index: index
        };

        if (index + 1 === this.steps.length) {
          this.finalStep = true;
        } else {
          this.finalStep = false;
        }

        if (!back) {
          this.$emit("completed-step", this.previousStep);
        }
      }
      this.$emit("active-step", this.currentStep);
    },

    nextStepAction() {
      this.nextButton[this.currentStep.name] = true;
      if (this.canContinue) {
        if (this.finalStep) {
          this.$emit("stepper-finished", this.currentStep);
        }
        let currentIndex = this.currentStep.index + 1;

        this.activateStep(currentIndex);
      }
      this.canContinue = false;
      this.$forceUpdate();
    },

    nextStep () {

      if (!this.$listeners || !this.$listeners['before-next-step']) {
        this.nextStepAction()
      }

      this.canContinue = false;

      this.$emit("before-next-step", { currentStep: this.currentStep }, (next = true) => {
        this.canContinue = true;
        if (next) {
          this.nextStepAction()
        }
      });
    },
    backStep() {
      this.$emit("clicking-back");
      let currentIndex = this.currentStep.index - 1;
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true);
      }
    },

    proceed(payload) {
      this.canContinue = payload.value;
    },

    changeNextBtnValue(payload) {
      this.nextButton[this.currentStep.name] = payload.nextBtnValue;
      this.$forceUpdate();
    },

    init() {
      // Initiate stepper
      this.activateStep(0);
      this.steps.forEach(step => {
        this.nextButton[step.name] = false;
      });
    }
  },

  watch: {
    reset(val) {
      if(!val) {
        return;
      }

      this.keepAliveData = false;

      this.init();
      this.previousStep = {};

      this.$nextTick(() => {
        this.keepAliveData = this.keepAlive;
        this.$emit('reset', true);
      });

    }
  },

  created() {
    this.init();
  }
};
</script>



<style scoped>
/* fallback */
@keyframes slideInLeft{
  from{ transform: translateX(-100%);
  opacity:0;}
  to{ transform: translateX(0%);
  opacity:1;}
}
@keyframes slideInRight{
  from{ transform: translateX(-100%);
  opacity:0;}
  to{ transform: translateX(0%);
  opacity:1;}
}
@keyframes slideOutLeft{
  from{ transform: translateX(100%);
  opacity:0;}
  to{ transform: translateX(0%);
  opacity:1;}
}
@keyframes slideOutRight{
  from{ transform: translateX(-100%);
  opacity:0;}
  to{ transform: translateX(0%);
  opacity:1;}
}
.animate-slide-in-left{
  animation: slideInLeft 0.8s;
}
.animate-slide-in-right{
  animation: slideInRight 0.8s;
}
.animate-slide-out-left{
  animation: slideOutLeft 0.8s;
}
.animate-slide-out-right{
  animation: slideOutRight 0.8s;
}
.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
}

</style>
