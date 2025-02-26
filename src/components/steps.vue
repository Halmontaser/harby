<template>
  <div class="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
    <!-- Steps Container -->
    <div class="relative">
      <!-- Progress Bar -->
      <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2">
        <div 
          class="h-full progress-transition"
          :style="{
            width: progressWidth,
            backgroundColor: primaryColor1
          }"
        ></div>
      </div>

      <!-- Steps -->
      <div class="relative flex justify-between">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="flex flex-col items-center"
        >
          <div 
            class="rounded-full flex items-center justify-center mb-2 step-transition"
            :class="{
              'text-white': step === index + 1 || step > index + 1,
              'text-gray-400': step < index + 1
            }"
            :style="getStepStyle(index + 1)"
          >
            <template v-if="step > index + 1">
              <svg 
                v-if="!tab.iconSuccess"
                class="w-6 h-6"
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
                class="w-6 h-6"
              />
            </template>
            <span v-else class="text-xl font-semibold">{{ index + 1 }}</span>
          </div>
          <span 
            class="text-sm"
            :class="{
              'text-gray-600': step === index + 1,
              [primaryColorClass]: step > index + 1,
              'text-gray-400': step < index + 1
            }"
          >{{ tab.title }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="mt-16 mb-8 bg-white rounded-xl shadow-md p-6">
      <div v-for="index in tabs.length" :key="index">
        <div v-if="step === index">
          <slot :name="index"></slot>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex justify-between">
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
    default: 'blue', // Tailwind orange-500
  },
  primaryColor2: {
    type: String,
    default: 'gray',
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  circleSize: {
    type: Number,
    default: 30,
  },
});

const emit = defineEmits(['update:step']);

const progressWidth = computed(() => {
  return `${(100 / (props.tabs.length - 1)) * (props.step - 1)}%`;
});

const primaryColorClass = computed(() => {
  // Convert hex to tailwind class if possible
  return 'text-orange-500'; // Default fallback
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
      borderColor: '#d1d5db', // gray-300
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
.progress-transition {
  transition: width 500ms ease;
}

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