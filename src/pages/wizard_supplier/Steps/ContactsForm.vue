<template>
  <div class="bg-white px-4 pb-6 pt-5 sm:px-6">
    <div class="mb-5 flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-semibold leading-6 text-gray-900">
            'Untitled' 
        </h3>
        <Fields
        :sections="sections"
        :data="_contact"
      />      </div>
      <div class="flex items-center gap-1">
        <Button
          v-if="detailMode"
          variant="ghost"
          class="w-7"
          @click="detailMode = false"
        >
          <component :is="icon('edit')" class="h-4 w-4" />
        </Button>
        <Button variant="ghost" class="w-7" @click="show = false">
          <component :is="icon('x')" class="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div>
      <div v-if="detailMode" class="flex flex-col gap-3.5">
        <div
          v-for="field in detailFields"
          :key="field.name"
          class="flex h-7 items-center gap-2 text-base text-gray-800"
        >
          <div class="grid w-7 place-content-center">
            <component :is="icon(field.icon)" class="h-4 w-4" />
          </div>
          <div v-if="field.type == 'dropdown'">
            <Dropdown
              :options="field.options"
              class="form-control -ml-2 mr-2 w-full flex-1"
            >
              <template #default="{ open }">
                <Button
                  variant="ghost"
                  :label="contact.data[field.name]"
                  class="dropdown-button w-full justify-between truncate hover:bg-white"
                >

                
                  <div class="truncate">{{ contact.data[field.name] }}</div>
                  <template #suffix>
                    <component
                      :is="icon(open ? 'chevron-up' : 'chevron-down')"
                      class="h-4 text-gray-600"
                    />
                  </template>
                </Button>
              </template>
            </Dropdown>
          </div>
          <div v-else>{{ field.value }}</div>
        </div>
      </div>
      <Fields
        v-else-if="sections"
        :sections="sections"
        :data="_contact"
      />
    </div>
  </div>
  <div v-if="!detailMode" class="px-4 pb-7 pt-4 sm:px-6">
    <div class="space-y-2">
      <Button
        class="w-full"
        v-for="action in options.actions"
        :key="action.label"
        v-bind="action"
      >
        {{ action.label }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { icon } from "@/utils/components";

import { call } from 'frappe-ui'
import Fields from '@/components/Fields.vue'
import Dropdown from '@/components/frappe-ui/Dropdown.vue'
import Icon from '../icon.vue'

const props = defineProps({
  contact: {
    type: Object,
    default: {},
  },
  options: {
    type: Object,
    default: {
      redirect: true,
      detailMode: false,
      afterInsert: () => {},
    },
  },
})

const sections = ref([{"label":"Salutation","columns":1,"fields":["salutation"],"hideLabel":true},{"label":"Full Name","columns":2,"hideBorder":true,"fields":["first_name","last_name"],"hideLabel":true},{"label":"Email","columns":1,"hideBorder":true,"fields":["email_id"],"hideLabel":true},{"label":"Mobile No. & Gender","columns":2,"hideBorder":true,"fields":["mobile_no","gender"],"hideLabel":true},{"label":"Organization","columns":1,"hideBorder":true,"fields":["company_name"],"hideLabel":true},{"label":"Designation","columns":1,"hideBorder":true,"fields":["designation"],"hideLabel":true},{"label":"Address","columns":1,"hideBorder":true,"fields":["address"],"hideLabel":true}])
const detailMode = ref(false)
const editMode = ref(true)
const _contact = ref({})
const router = useRouter()

// Simplified detail fields with Lucide icon names
const detailFields = computed(() => {
  const details = [
    { icon: 'user', name: 'full_name', value: _contact.value.full_name },
    { icon: 'venus-mars', name: 'gender', value: _contact.value.gender },
    { icon: 'mail', name: 'email_id', value: _contact.value.email_id },
    { icon: 'phone', name: 'mobile_no', value: _contact.value.actual_mobile_no },
    { icon: 'building', name: 'company_name', value: _contact.value.company_name },
    { icon: 'briefcase', name: 'designation', value: _contact.value.designation },
    { icon: 'map-pin', name: 'address', value: _contact.value.address },
  ]

  return details.filter(detail => detail.value)
})

// Rest of the script remains mostly the same, 
// remove any icon-related imports and functions
// Keep only essential business logic

// ... (keep the existing business logic for contact management)
</script>

<style scoped>
:deep(:has(> .dropdown-button)) {
  width: 100%;
}
</style>