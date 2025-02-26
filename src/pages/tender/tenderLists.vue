
<template>

<Tabs
				v-model="tabIndex"
				:tabs="tabs"
			>

		</Tabs>
	


  <h1>tender list</h1>
  <RouterView />

</template>
<script setup>
import { Tabs } from 'frappe-ui';
import {ref}from 'vue';
import { RouterView } from 'vue-router';
const tabIndex=ref[""]
const tabs=ref([{
            label: 'tab1',
            name: 'tab1'
          }, {
            label: 'tab2',
            name: 'tab2'
          }, {
              label: 'tab3',
            name: 'tab3'
          }, {
            label: 'tab4',
            name: 'tab4'
          }])

</script>