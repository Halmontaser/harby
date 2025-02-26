<script setup>

import { RouterView,useRoute,useRouter } from 'vue-router';
import {TabButtons} from 'frappe-ui'
import {  watchEffect,onMounted, ref,h } from 'vue'
import { FeatherIcon } from 'frappe-ui';


const route = useRoute()
const router = useRouter()
const getbuttons=()=>{return [{label:"supplierProfile",icon:h(FeatherIcon,{name:'plus'})},{label:"doc"},{label:"experience"},{label:"capacity"},{label:"contact"},{label:"legal"},{label:"account"}]}
const activeTab = ref('')
watchEffect(() => {
	if (activeTab.value) {
		let route = {
			supplierProfile:{name:"supplierProfile"},
			doc: { name:'doc'},
			experience: { name: 'experience' },
			capacity: { name: 'capacity' },
			contact: { name:'contact'},
			account: { name: 'account'},
			legal: { name: 'legaldoc' },
		}[activeTab.value]
		router.push(route)
	}
})

onMounted(() => {

	setActiveTab()
})
function setActiveTab(){

	let fragments = route.path.split('/')
	let sections = ['doc',"account" ,'contact', 'experience', 'capacity',"legal","contact","supplierProfile"]
	sections.forEach((section) => {
		if (fragments.includes(section)) {
			activeTab.value = section
		}
	})
	if (!activeTab.value) activeTab.value = 'supplierProfile'


}



</script>

<template>

<div class="group relative h-[130px] w-full">
			<img
			
				src="../../assets/igcc-banner-900x450.png"
				class="h-[130px] w-full object-cover object-center"
			/>
			
			<div
				class="absolute bottom-0 left-1/2 mb-4 flex -translate-x-1/2 space-x-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100"
			>
			
			
		</div>
		<div class="mx-auto -mt-4 max-w-4xl translate-x-0 sm:px-5">
			<div class="flex items-center">
				<div>
					<img
						v-if="true"
						src="../../assets/Frame 2.png"
						
						class="object-cover h-[100px] w-[100px] rounded-full border-4 border-white object-cover"
					/>
					<!-- <UserAvatar
						v-else
						:user="profile.data"
						class="object-cover h-[100px] w-[100px] rounded-full border-4 border-white object-cover"
					/> -->
				</div>
				<div class="ml-6">
					<h2 class="mt-2 text-3xl font-semibold text-gray-900">
						Harby merzah almontaser
					</h2>
					<div class="mt-2 text-base text-gray-700">
					 harby workshop for all working on contsrtuciton 
					</div>
				</div>
				
			</div>
	</div>


<section class="clearfix mt[100]">

		<TabButtons
					class="inline-block p-6"
					:buttons="getbuttons()"
					v-model="activeTab"
/>

</section>



  <router-view></router-view>
</div>
</template>
