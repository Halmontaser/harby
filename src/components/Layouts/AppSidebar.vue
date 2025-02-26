<template>
  <div
    class="relative flex h-full flex-col justify-between transition-all duration-300 ease-in-out"
    :class="isSidebarCollapsed ? 'w-12' : 'w-[220px]'"
  >
  
  <nav class="flex flex-col">
            <SidebarLink
              v-for="link in links"
              :icon="link.icon"
              :label="link.label"
              :to="link.to"
              :isCollapsed="isSidebarCollapsed"
              class="mx-2 my-0.5"
            />
          </nav>
  <button @click="isSidebarCollapsed=!isSidebarCollapsed">collapse</button></div>
</template>
<script setup>
import {ref} from "vue"
const isSidebarCollapsed=ref(false)
import { icon } from "../../utils/components.jsx";
import LeadsIcon from '../Icons/LeadsIcon.vue'
import DealsIcon from '../Icons/DealsIcon.vue'
import ContactsIcon from '../Icons/ContactsIcon.vue'
import OrganizationsIcon from '../icons/OrganizationsIcon.vue'
import Email2Icon from '../Icons/Email2Icon.vue'
import SidebarLink from '../SidebarLink.vue'
const links = ref([
  {
    label: 'supplier',
    icon: LeadsIcon,
    to: 'supplier'
  },
  {
    label: 'wizard1',
    icon: 'pdf',
    to: 'wizard'
  },
  {
    label: 'communication',
    icon: 'grid',
    to: 'communication',
  },
  {
    label: 'contact',
    icon: 'setting',
    to: 'contact',
  },
  {
    label: 'tender',
    icon: DealsIcon,
    to: 'tender',
  },
  {
    label: 'file',
    icon: ContactsIcon,
    to: 'file',
  },
  {
    label: 'Organizations',
    icon: OrganizationsIcon,
    to: 'home',
  },
  {
    label: 'tender ',
    icon: OrganizationsIcon,
    to: 'tender List',
  },
  {
    label: 'bidder ',
    icon: OrganizationsIcon,
    to: 'bidder List',
  },
  
  {
    label: 'tree',
    icon: Email2Icon,
    to: 'tree',
  },
  {
    label: 'supplier documet',
    icon: Email2Icon,
    to: 'doclist',
  },
])

</script>