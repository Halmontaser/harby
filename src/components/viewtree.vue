<script setup >
import { ref } from 'vue'
import TreeView from './TreeView.vue'


const treeViewItems = ref([
	{
		id: 1,
		label: 'Javascript',
		children: [
			{
				id: 2,
				label: 'Vue',
				children: [
					{ id: 5, label: 'Vue-Router' },
					{ id: 6, label: 'Pinia' },
				],
			},
			{
				id: 3,
				label: 'React',
				children: [
					{ id: 7, label: 'Redux' },
					{ id: 8, label: 'Remix' },
					{ id: 11, label: 'harby',children:[
                    { id: 12, label: 'test' },
                    { id: 13, label: 'roa' },

                    ] },
				],
			},
			{ id: 4, label: 'Angular' },
		],
	},
	{
		id: 9,
		label: 'Java',
		children: [
			{
				id: 10,
				label: 'Spring Boot',
			},
		],
	},
])
</script>

<template>
	<div class="w-full min-h-screen bg-back flex flex-col items-center pt-12">
		<div class="w-[480px] px-6 py-4">
			<TreeView :items="treeViewItems" />
		</div>
	</div>
</template>
