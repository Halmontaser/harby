<template>
    <div class="max-w-xl w-full bg-white rounded-lg shadow-lg p-4 md:p-8">
      <!-- Vertical Steps Container -->
      <div class="relative flex flex-col">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="flex items-start"
        >
          <!-- Step Column -->
          <div class="flex flex-col items-center">
            <!-- Step Circle -->
            <div 
              class="rounded-full flex items-center justify-center step-transition z-10"
              :class="{
                'text-white': step === index + 1 || step > index + 1,
                'text-gray-400': step < index + 1
              }"
              :style="getStepStyle(index + 1)"
            >
              <template v-if="step > index + 1">
                <svg 
                  v-if="!tab.iconSuccess"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <img
                  v-else
                  :src="tab.iconSuccess"
                  :alt="tab.title"
                  class="w-5 h-5"
                />
              </template>
              <span v-else class="text-base font-semibold">{{ index + 1 }}</span>
            </div>
  
            <!-- Vertical Line -->
            <div 
              v-if="index !== tabs.length - 1"
              class="w-0.5 flex-grow mt-2"
              :style="{
                backgroundColor: step > index + 1 ? primaryColor1 : '#e5e7eb',
                height: '40px'
              }"
            ></div>
          </div>
  
          <!-- Content Column -->
          <div class="ml-4 flex-grow">
            <span 
              class="text-sm font-medium block"
              :class="{
                'text-gray-900': step === index + 1,
                [primaryColorClass]: step > index + 1,
                'text-gray-400': step < index + 1
              }"
            >{{ tab.title }}</span>
            
            <!-- Step Content -->
            <div 
              v-if="step === index + 1"
              class="mt-2 mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100"
            >
              <slot :name="index + 1"></slot>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Controls -->
      <div class="flex mt-6 px-4">
        <button 
          v-if="step !== 1"
          @click="decrementStep"
          class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          {{ backText }}
        </button>
        <button 
          v-if="step !== tabs.length"
          @click="incrementStep"
          class="px-4 py-2 text-sm rounded transition-colors ml-auto"
          :class="buttonClasses"
          :disabled="!tabs[step - 1].isValid"
        >
          {{ nextText }}
        </button>
        <button
          v-else
          @click="finalize"
          class="px-4 py-2 text-sm rounded transition-colors ml-auto"
          :class="buttonClasses"
          :disabled="!tabs[step - 1].isValid || loading"
        >
          <span v-if="loading" class="loader"></span>
          <span v-else>{{ doneText }}</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    step: {
      type: Number,
      default: 1,
    },
    tabs: {
      type: Array,
      default: () => ([
        { title: 'Step 1', iconSuccess: null, isValid: true },
        { title: 'Step 2', iconSuccess: null, isValid: true },
        { title: 'Step 3', iconSuccess: null, isValid: true },
      ]),
    },
    finalize: {
      type: Function,
      default: () => ({}),
    },
    backText: {
      type: String,
      default: 'Back',
    },
    nextText: {
      type: String,
      default: 'Next',
    },
    doneText: {
      type: String,
      default: 'Done',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    primaryColor1: {
      type: String,
      default: '#f97316', // Tailwind orange-500
    },
    primaryColor2: {
      type: String,
      default: '#ffffff',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    circleSize: {
      type: Number,
      default: 40, // Smaller circle size for mobile
    },
  });
  
  const emit = defineEmits(['update:step']);
  
  const primaryColorClass = computed(() => {
    return 'text-orange-500';
  });
  
  const buttonClasses = computed(() => ({
    'text-white': true,
    'disabled:opacity-50': true,
    'disabled:cursor-not-allowed': true,
    [`hover:brightness-90`]: true,
    [`bg-[${props.primaryColor1}]`]: true,
  }));
  
  const getStepStyle = (stepNumber) => {
    const baseStyle = {
      width: `${props.circleSize}px`,
      height: `${props.circleSize}px`,
      backgroundColor: props.primaryColor2,
      borderWidth: '2px',
    };
  
    if (props.step === stepNumber) {
      return {
        ...baseStyle,
        backgroundColor: props.primaryColor1,
        borderColor: props.primaryColor1,
      };
    } else if (props.step > stepNumber) {
      return {
        ...baseStyle,
        backgroundColor: props.primaryColor1,
        borderColor: props.primaryColor1,
      };
    } else {
      return {
        ...baseStyle,
        borderColor: '#d1d5db',
      };
    }
  };
  
  const incrementStep = () => {
    emit('update:step', props.step + 1);
  };
  
  const decrementStep = () => {
    emit('update:step', props.step - 1);
  };
  </script>
  
  <style scoped>
  .step-transition {
    transition: all 500ms ease;
  }
  
  .loader {
    width: 20px;
    height: 20px;
    border: 2px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
  
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>