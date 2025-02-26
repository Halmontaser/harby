<template>

 <h1 class="text-bold text-3xl">home</h1> 
<AppHeader title="Hellow this first" :actions="[{icon:'check'},{name:'hossam',icon:'plus'}]" status="draft"/>	 
<BodyContent :fileUrl='fileUrl' :fileType="fileType"/>
<div class="grid grid-col-1 sm:grid-col-2 md:grid-col-3 lg:grid-col-4 grid-flow-row-1 grid-row-1 gap-4">
<div class="p-2 mx-auto shadow-lg transform rotat-2 bg-blue-100 rounded border border-2 border-gray-500 flex flex-col w-[200px] md:flex-row flex-start w-[505px] gap-2">
	<div class="flex flex-col item-center my-auto w-[199px]">
	<header class="block flex flex-row justify-between bg-gray-300 md:hidden"><h3 class=" text-center text-bold text-gray-900">crident card</h3> <button class="action">update</button></header>	
	<div class="flex item-center justify-center bg-green-400">
	<FeatherIcon
          name="plus"
          class="h-[150px] w-[150px] text-red-900"
        />
	</div>
</div>
<div class="flex flex-col justify-between w-[200px] md:w-[300px]">
<header class="hidden md:block 
 bg-blue-400 rounded m-1 p-1" ><h3 class="flex flex-row justify-between text-bold text-gray-900">crident card <Button variant="solid">update</button></h3> </header>	
<div class="trunicate">hellow sososo Lorem ipsum dolor sit amets voluptatibus quae ipsum eaque, accusamus error! Ex ipsam rem eligendi nisi unde?</div>
<footer class="h-10 text-xs flex justify-between"><button>date stamp</button>
<div class="flex gap-4"><button>two</button><button>three</button></div>  
</footer>
</div>
</div>
</div>
<h1 class="text_3xl">this response {{ ping }}</h1>
</template>
<script setup>
import {FeatherIcon,Button,Badge} from 'frappe-ui';
import { comment } from 'postcss';
import {ref,computed} from 'vue'
const ping=ref("")
const showharby=ref(false)
</script>
