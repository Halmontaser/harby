<template>
  <div>
    <FormControl label="Item Groups">
      <TreeControl
        doctype="Item Group"
        searchable
        multiple
        v-model="selectedGroups"
        @change="onGroupsChange"
      />
    </FormControl>
    <div>
      Selected Groups: {{ selectedGroups }}
    </div>
  </div>
</template>

<script>
import TreeControl from './TreeControl.vue';
import {FormControl} from 'frappe-ui';

export default {
  components: { TreeControl, FormControl },
  data() {
    return {
      selectedGroups: [],
    };
  },
  methods: {
    onGroupsChange(selected) {
      console.log('Selected groups changed:', selected);
    },
  },
};
</script>