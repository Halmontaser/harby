<template>
    <div
      v-for="field in _fields"
      :key="field.label"
      :class="[field.hidden && 'hidden']"
      class="section-field flex items-center gap-2 px-3 leading-5 first:mt-3"
    >
      <Tooltip :text="__(field.label)" :hoverDelay="1">
        <div class="sm:w-[106px] w-36 shrink-0 truncate text-sm text-gray-600">
          <span>{{ __(field.label) }}</span>
          <span class="text-red-500">{{ field.reqd ? ' *' : '' }}</span>
        </div>
      </Tooltip>
      <div
        class="grid min-h-[28px] flex-1 items-center overflow-hidden text-base"
      >
        <div
          v-if="field.read_only && field.type !== 'checkbox'"
          class="flex h-7 cursor-pointer items-center px-2 py-1 text-gray-600"
        >
          <Tooltip :text="__(field.tooltip)">
            <div>{{ data[field.name] }}</div>
          </Tooltip>
        </div>
        <FormControl
          v-else-if="field.type == 'checkbox'"
          class="form-control"
          :type="field.type"
          v-model="data[field.name]"
          @change.stop="emit('update', field.name, $event.target.checked)"
          :disabled="Boolean(field.read_only)"
        />
        <FormControl
          v-else-if="
            ['email', 'number', 'date', 'password', 'textarea'].includes(
              field.type,
            )
          "
          class="form-control"
          :class="{
            '[&_input]:text-gray-500':
              field.type === 'date' && !data[field.name],
          }"
          :type="field.type"
          :value="data[field.name]"
          :placeholder="field.placeholder"
          :debounce="500"
          @change.stop="emit('update', field.name, $event.target.value)"
        />
        <FormControl
          v-else-if="field.type === 'select'"
          class="form-control cursor-pointer [&_select]:cursor-pointer"
          type="select"
          :value="data[field.name]"
          :options="field.options"
          :debounce="500"
          @change.stop="emit('update', field.name, $event.target.value)"
        />
                
        <FormControl
          v-else
          class="form-control"
          type="text"
          :value="data[field.name]"
          :placeholder="field.placeholder"
          :debounce="500"
          @change.stop="emit('update', field.name, $event.target.value)"
        />
      </div>
    </div>
</template>

<script setup>
import ArrowUpRightIcon from './Icons/ArrowUpRightIcon.vue'
import { Tooltip } from 'frappe-ui'
import { computed } from 'vue'

const props = defineProps({
  fields: {
    type: Object,
    required: true,
  }  
})


const emit = defineEmits(['update'])

const data = defineModel()

const _fields = computed(() => {
  let all_fields = []
  props.fields?.forEach((field) => {
    let df = field.all_properties
    if (df?.depends_on) evaluate_depends_on(df.depends_on, field)
    all_fields.push({
      ...field,
      placeholder: field.placeholder || field.label,
    })
  })
  return all_fields
})

function evaluate_depends_on(expression, field) {
  if (expression.substr(0, 5) == 'eval:') {
    try {
      let out = evaluate(expression.substr(5), { doc: data.value })
      if (!out) {
        field.hidden = true
      }
    } catch (e) {
      console.error(e)
    }
  }
}

function evaluate(code, context = {}) {
  let variable_names = Object.keys(context)
  let variables = Object.values(context)
  code = `let out = ${code}; return out`
  try {
    let expression_function = new Function(...variable_names, code)
    return expression_function(...variables)
  } catch (error) {
    console.log('Error evaluating the following expression:')
    console.error(code)
    throw error
  }
}
</script>

<style scoped>
.form-control {
  margin: 2px;
}

:deep(.form-control input:not([type='checkbox'])),
:deep(.form-control select),
:deep(.form-control textarea),
:deep(.form-control button) {
  border-color: transparent;
  background: white;
}

:deep(.form-control button) {
  gap: 0;
}
:deep(.form-control [type='checkbox']) {
  margin-left: 9px;
  cursor: pointer;
}

:deep(.form-control button > div) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.form-control button svg) {
  color: white;
  width: 0;
}
</style>
