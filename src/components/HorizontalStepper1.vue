<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-center relative py-6">
          <!-- Top buttons -->
          <div v-if="topButtons" class="absolute top-1/2 -translate-y-1/2 w-full px-4 flex justify-between z-10">
              <div v-if="currentStep.index > 0" 
                   class="p-2 rounded-full cursor-pointer border-2 border-gray-300 hover:border-gray-400 transition-colors"
                   @click="backStep()">
                   <FeatherIcon name="chevron-left" class="h-5 w-5 text-gray-600"/>
              </div>
              
              <div v-if="!finalStep"
                   :class="[
                     'p-2 rounded-full cursor-pointer border-2 transition-colors ml-auto',
                     canContinue ? 'border-blue-500 hover:border-blue-600' : 'border-gray-300 cursor-not-allowed'
                   ]"
                   @click="nextStep()">
                   <FeatherIcon name="chevron-right" class="h-5 w-5 text-gray-600"/>
              </div>
          </div>
 
          <!-- Progress line -->
          <div class="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gray-200">
              <div 
                class="h-full bg-blue-500 transition-all duration-300" 
                :style="{width: `${(currentStep.index / (steps.length - 1)) * 100}%`}"
              ></div>
          </div>

          <!-- Steps wrapper -->
          <div class="relative w-[90%] flex items-center justify-between">
              <template v-for="(step, index) in steps" :key="index">
                  <div 
                    :class="[
                      'relative flex flex-col items-center text-center transition-opacity duration-300',
                      'w-full max-w-[150px]',
                      {
                        'opacity-100': currentStep.index >= index,
                        'opacity-50': currentStep.index < index
                      }
                    ]"
                  >
                      <div 
                        :class="[
                          'mb-4 rounded-full w-12 h-12 flex items-center justify-center transition-colors',
                          step.completed || currentStep.index > index ? 'bg-blue-500' : 
                          currentStep.index === index ? 'bg-blue-500' : 'bg-gray-300'
                        ]"
                      >
                        <FeatherIcon 
                          :name='step.icon' 
                          class="w-6 h-6 text-white"
                        />
                      </div>
                      <div class="text-center">
                          <h4 class="text-sm font-semibold text-gray-800 mb-1">{{step.title}}</h4>
                          <h5 class="text-xs text-gray-600">{{step.subtitle}}</h5>
                      </div>
                  </div>
              </template>
          </div>
      </div>

      <!-- Content area -->
      <div class="relative overflow-hidden px-6 py-8">
          <transition 
            :enter-active-class="enterAnimation" 
            :leave-active-class="leaveAnimation" 
            mode="out-in"
          >
              <keep-alive v-if="keepAliveData">
                  <component 
                    :is="steps[currentStep.index].component" 
                    :clickedNext="nextButton[currentStep.name]"
                    @can-continue="proceed"
                    @change-next="changeNextBtnValue"
                    :current-step="currentStep"
                  />
              </keep-alive>
              <component 
                v-else
                :is="steps[currentStep.index].component"
                :clickedNext="nextButton[currentStep.name]"
                @can-continue="proceed"
                @change-next="changeNextBtnValue"
                :current-step="currentStep"
              />
          </transition>
      </div>

      <!-- Bottom buttons -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            v-if="currentStep.index > 0"
            class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            @click="backStep()"
          >
              <FeatherIcon name='arrow-left-circle' class="w-5 h-5"/>
              <span>Back</span>
          </button>
          <button
            :class="[
              'ml-auto flex items-center gap-2 px-6 py-2 rounded-md transition-colors',
              canContinue ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
            @click="nextStep()"
          >
              <span>{{ finalStep ? 'Finish' : 'Next' }}</span>
              <FeatherIcon name='arrow-right-circle' class="w-5 h-5"/>
          </button>
      </div>
  </div>
</template>

<script>
import { FeatherIcon } from 'frappe-ui'

export default {
  components: {
    FeatherIcon
  },
  
  props: {
    topButtons: {
      type: Boolean,
      default: false
    },
    steps: {
      type: Array,
      default: () => ([
        {
          icon: "mail",
          name: "first",
          title: "Sample title 1",
          subtitle: "Subtitle sample"
        },
        {
          icon: "alert-triangle",
          name: "second",
          title: "Sample title 2",
          subtitle: "Subtitle sample"
        }
      ])
    },
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
    }
  },

  computed: {
    enterAnimation() {
      return this.currentStep.index < this.previousStep.index
        ? "animate-slide-in-left"
        : "animate-slide-in-right"
    },
    leaveAnimation() {
      return this.currentStep.index > this.previousStep.index
        ? "animate-slide-out-left"
        : "animate-slide-out-right"
    }
  },

  methods: {
    // Your existing methods remain the same
    isStepActive(index, step) {
      return this.currentStep.index === index ? "activated" : "deactivated"
    },

    activateStep(index, back = false) {
      if (this.steps[index]) {
        this.previousStep = this.currentStep
        this.currentStep = {
          name: this.steps[index].name,
          index: index
        }

        this.finalStep = index + 1 === this.steps.length

        if (!back) {
          this.$emit("completed-step", this.previousStep)
        }
      }
      this.$emit("active-step", this.currentStep)
    },

    nextStepAction() {
      this.nextButton[this.currentStep.name] = true
      if (this.canContinue) {
        if (this.finalStep) {
          this.$emit("stepper-finished", this.currentStep)
        }
        this.activateStep(this.currentStep.index + 1)
      }
      this.canContinue = false
      this.$forceUpdate()
    },

    nextStep() {
      if (!this.$listeners || !this.$listeners['before-next-step']) {
        this.nextStepAction()
        return
      }

      this.canContinue = false
      this.$emit("before-next-step", { currentStep: this.currentStep }, (next = true) => {
        this.canContinue = true
        if (next) {
          this.nextStepAction()
        }
      })
    },

    backStep() {
      this.$emit("clicking-back")
      const currentIndex = this.currentStep.index - 1
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true)
      }
    },

    proceed(payload) {
      this.canContinue = payload.value
    },

    changeNextBtnValue(payload) {
      this.nextButton[this.currentStep.name] = payload.nextBtnValue
      this.$forceUpdate()
    },

    init() {
      this.activateStep(0)
      this.steps.forEach(step => {
        this.nextButton[step.name] = false
      })
    }
  },

  watch: {
    reset(val) {
      if (!val) return
      
      this.keepAliveData = false
      this.init()
      this.previousStep = {}

      this.$nextTick(() => {
        this.keepAliveData = this.keepAlive
        this.$emit('reset', true)
      })
    }
  },

  created() {
    this.init()
  }
}
</script>

<style scoped>
.animate-slide-in-left {
  animation: slideInLeft 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

.animate-slide-out-left {
  animation: slideOutLeft 0.3s ease-out;
}

.animate-slide-out-right {
  animation: slideOutRight 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>