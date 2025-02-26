import { createRouter, createWebHistory } from 'vue-router'
import generateRoutes from '../objects/generateRoutes';
import ss from '../pages/wizard_supplier/home.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'wizard',
      component:ss
    },
    {
      path: '/filelist',
      name: 'home',
      component:()=> import('../pages/filelist.vue') 
    },
    {
      path: '/contact',
      name: 'contact',
      component:()=> import('../pages/ContactModal.vue') 
    },
    {
      path: '/communication',
      name: 'communication',
      component:()=> import('../components/CommunicationArea.vue') 
    },
    {
      path: '/form',
      name: 'form',
      component:()=> import('../models/BankStatement2.vue') 
    },
    ...generateRoutes(),
    {
      path: '/file',
      name: 'file',
      component:()=> import('../pages/filetest.vue') 
    }, 
   
  
    {
      path: '/contract',
      name: 'contract',
      component:()=>import('../pages/contracts.vue'),
    }, 
    {
      path: '/doclist',
      name: 'doclist',
      component:()=> import('../pages/partydocumets.vue') 
    }, 
    {
      path: '/tree',
      name: 'tree',
      component:()=> import('../pages/tender/itemlist.vue') 
    }, 
    {
      path: '/boq',
      name: 'boq',
      component:()=> import('../pages/tender/BOQ.vue') 
    }, 
    {
      path: '/wizard',
      name: 'wizard',
      component:()=> import('../pages/wizard_supplier/home.vue') 
    }, 
    {
      path: '/doclist',
      name: 'doclist',
      component:()=> import('../pages/partydocumets.vue') 
    }, 
    {
      path: '/tender',
      name: 'tender',
      component: ( )=> import('../pages/tender/tenderLists.vue'),
      children: [{
        path: 'tab1',
        name: 'tab1',
        component:()=>import('../pages/tender/statemetslist.vue'),
      },
      {
        path: 'tab2',
        name: 'tab2',
        component: import('../pages/itemsLists.vue'),
      },
      {
        path: 'tab3',
        name: 'tab3',
        component: import('../pages/ItemDetails.vue'),
      },
    ]
    }
    ,
    {
      path: '/supplier',
      name: 'supplier',
      redirect:{name:"supplierProfile"},
      component: ( )=> import('../pages/supplier/supplier.vue')
      ,children:
      [
        {
        path:"",
        name:"supplierProfile",
        component:()=> import('../pages/wizard_supplier/Steps/BasicInformation.vue')
      },
      { path:"doc",
        component:()=> import('../pages/supplier/‏‏‏‏supplierDocs.vue'),
        name:"doc",
      },
      {
        path:"experience",
        name:"experience",
        component: ()=> import('../pages/contracts.vue')
      },
      {
        path:"scontact",
        name:"scontact",
        component: ()=> import('../pages/supplier/‏‏supplierAddressContacts.vue')
      },
      {
        path:"account",
        name:"account",
        component: ()=> import('../pages/supplier/supplierAccounts.vue')
      },
      {
        path:"legal",
        name:"legaldoc",
        component: ()=> import('../pages/supplier/‏‏supplierLegalDoc.vue')
      },
      {
        path:"capacity",
        name:"capacity",
        component: ()=> import('../pages/supplier/‏‏‏‏supplierCapacity.vue')
      }

]
    },
  
    
  ]
})

export default router
