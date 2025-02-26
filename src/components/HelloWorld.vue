<template>
<div data-state="open" 
class="fixed inset-0 
z-50 bg-black/80 data-[state=open]
:animate-in data-[state=closed]:
animate-out data-[state=closed]:fade-out-0 data-[state=open]
:fade-in-0" style="pointer-events: auto;" data-aria-hidden="true" aria-hidden="true"></div>

<div data-state="open" 
class="fixed inset-0 z-50 bg-black/80 
data-[state=open]
:animate-in data-[state=closed]
:animate-out data-[state=closed]:
fade-out-0 data-[state=open]:fade-in-0" 
data-aria-hidden="true" 
aria-hidden="true" style="pointer-events: auto;">
</div>
<div data-dismissable-layer=""
 id="radix-vue-dialog-content-2"
  role="dialog" aria-describedby="radix-vue-dialog-description-6"
   aria-labelledby="radix-vue-dialog-title-5" 
   data-state="open" tabindex="-1" class="fixed z-50 gap-4 bg-white p-6 shadow-lg transition 
   ease-in-out data-[state=open]:
   animate-in data-[state=closed]:animate-out data-[state=closed]
   :duration-300 data-[state=open]:duration-500 dark:bg-slate-950 inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]
   :slide-out-to-right data-[state=open]:
   slide-in-from-right sm:max-w-sm" 
   style="pointer-events: auto;"><
   div class="flex flex-col gap-y-2 text-center sm:text-left"><
   h2 id="radix-vue-dialog-title-5" class="text-lg font-semibold text-slate-950 dark:text-slate-50">
   Edit profile</h2><p id="radix-vue-dialog-description-6" class="text-sm text-slate-500 dark:text-slate-400"> Make changes to your profile here. Click save when you're done. </p></div><div class="grid gap-4 py-4"><div class="grid items-center grid-cols-4 gap-4"><label for="name" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right">Name</label><input class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 col-span-3" id="name"></div><div class="grid items-center grid-cols-4 gap-4"><label for="username" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-right">Username</label><input class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 col-span-3" id="username"></div></div><div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2"><button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2" type="submit"> Save changes </button></div><button type="button" class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-xicon w-4 h-4 text-slate-500 dark:text-slate-400"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button></div>
<div id="app" data-v-app="" 
data-aria-hidden="true" aria-hidden="true">
<div class="flex h-screen w-screen">
<div class="h-full border-r bg-gray-50">
<div class="relative flex h-full flex-col justify-between transition-all duration-300 ease-in-out w-[220px]">
<div class="header h-20 flex pb-5 justfiy-between">
  <div class="title">
    title <Badge>status</Badge>
  </div>
 <div class="actions">
  <Button/>upload</Button> 
 <Button/>download</Button> 
 <Button/>locked</Button>
</div>
<Tabs>
  <tab>procedures and actions</tab>
  button
  if user is team. 
  check form validate by orginal 
   check for validate by staff
   comments of staff user
 
  <tab>details infom</tab>
  edits,user,actions
  fields ,
  summary,
  is expired
  <tab>overview</tab>

</Tabs>
<template #default="{ tab }">
  <div class="pt-5 px-5 pb-10">
    
</div></template>   

</div>
</div></div>
<div class="flex-1 flex flex-col h-full overflow-auto">

</template>

<script >
import {Tabs,Button,FeatherIcon,FormControl} from "frappe-ui"
defineProps({
  current_documents: {
    p_name: "",
    bc_group:"",
    attached_file:"",
    description_output:"",
    supplier:"",
    states:"",
    is_lock:false,
    comments:[],
    tender:"",
    is_allowed_to_update_data:"",
    allowed_to_update_file:""
    comments_allowed:false,   
  }})

  methods: {

  computed:{
    get_fields:get_list(filterFields=(p_name,caches))
    is_attached:attached_file ?true:false
    filetype:getFileRenderType()// to create file extention
    is_data_type:get_fields.length>1
    discription_template:get_value(p_name)
    render_description_output:// this could take two state from backend or make template
    data=JSON.parse(json)
    is_data=json.length// if the json field have data or not length
    is_expired:data.expire_data
    update_description:render_description_output
    is_workflow: when is third tab is available 
    comments_counts:
    




    
    


    

  }

})
</script>

tabs=[{name:"processing"
       icon:h(FeatherIcon,"")},
       {name:"document_data"
       icon:h(FeatherIcon,"")},
       {name:"overview"
       icon:h(FeatherIcon,"")},
      ]



<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
