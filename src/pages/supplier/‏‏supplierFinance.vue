<script setup>
import {FrappeControl} from "frappe-ui"
let  obj = reactive({fullname:" ",age:" ",image:""})

</script>

<template>
<FrappeControl label= "full name " v-model='fullname' type='text'/>
<FrappeControl label= "age " v-model="age" type="number"/>
<FrappeControl label="image" v-model="image" type="Autocomplate" :options='["","onemptied","TowerControl","ThermometerSnowflake","secureHeapUsed"]'/>

</template>
